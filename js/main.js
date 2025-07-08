const TEXT = document.querySelector("#text");
const CAT  = document.querySelector("#cat");

function swapCat() {
   const cats = [
      "hat.jpg",
      "lettis.jpg",
      "pizza.jpg",
      "poppy.jpg",
      "smeeeeg.jpg",
      "snap.jpg",
   ];

   CAT.src = `img/cats/${cats[Math.floor(Math.random() * cats.length)]}`;
}

async function swapText(path, updateHash = true) {
   TEXT.innerText = "";

   try {
      const res = await fetch("pages/" + path + ".md");
      const md  = await res.text();

      const html = (new showdown.Converter()).makeHtml(md);

      TEXT.innerHTML = html;

      if (updateHash && window.location.hash !== "#" + path) {
         window.location.hash = path;
      }
   } catch (error) {
      console.error("Failed to load page:", path, error);
      TEXT.innerHTML = "<h1>Page not found</h1><p>The requested page could not be loaded.</p>";
   }
}

function handleRoute() {
   const hash = window.location.hash.slice(1);
   const path = hash || "main";
   swapText(path, false);
}

window.addEventListener("popstate", (event) => {
   handleRoute();
});

window.addEventListener("hashchange", (event) => {
   handleRoute();
});

handleRoute();

if (!('ontouchstart' in document.documentElement)) new CommentSnake();
