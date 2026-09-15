import { watch } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import markdownIt from "markdown-it";

const root = new URL("./", import.meta.url);
const rootPath = resolve(fileURLToPath(root));
const markdown = markdownIt({ html: true });
const pages = {
   MAIN: "pages/main.md",
   MAIN_PRINT: "pages/main-print.md",
   PROJECTS: "pages/projects.md",
   PROJECTS_PRINT: "pages/projects-print.md",
   PHOTOGRAPHY: "pages/photography.md",
};
const types = {
   ".css": "text/css",
   ".html": "text/html",
   ".js": "text/javascript",
   ".jpg": "image/jpeg",
   ".png": "image/png",
   ".svg": "image/svg+xml",
};

const read = path => readFile(new URL(path, root), "utf8");

async function build() {
   let html = await read("index.template.html");

   for (const [name, path] of Object.entries(pages)) {
      const marker = `<!-- ${name} -->`;

      if (!html.includes(marker)) {
         throw new Error(`Missing template marker: ${marker}`);
      }

      html = html.replace(marker, markdown.render(await read(path)).trim());
   }

   await writeFile(new URL("index.html", root), `${html.trimEnd()}\n`);
   console.log("Built index.html");
}

function startDevelopment() {
   let timer;
   const rebuild = () => {
      clearTimeout(timer);
      timer = setTimeout(() => build().catch(console.error), 50);
   };

   watch(new URL("index.template.html", root), rebuild);
   watch(new URL("pages/", root), { recursive: true }, rebuild);

   createServer(async (request, response) => {
      try {
         const url = new URL(request.url, "http://localhost");
         const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
         const filePath = resolve(rootPath, `.${pathname}`);

         if (!filePath.startsWith(`${rootPath}${sep}`)) {
            throw new Error("Invalid path");
         }

         const content = await readFile(filePath);
         response.setHeader("Content-Type", types[extname(filePath)] ?? "application/octet-stream");
         response.end(request.method === "HEAD" ? undefined : content);
      } catch (error) {
         response.statusCode = error.code === "ENOENT" ? 404 : 500;
         response.end(response.statusCode === 404 ? "Not found" : "Server error");
      }
   }).listen(8000, () => console.log("Serving http://localhost:8000"));
}

await build();

if (process.argv.includes("--dev")) {
   startDevelopment();
}
