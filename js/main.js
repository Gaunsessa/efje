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

async function swapText(path, push = true) {
   TEXT.innerText = "";

   const res = await fetch("pages/" + path + ".md");
   const md  = await res.text();

   const html = (new showdown.Converter()).makeHtml(md);

   TEXT.innerHTML = html;

   if (push)
      history.pushState(path, "", "#" + path);
   else
      history.replaceState({}, "Title", "#" + path);
}

window.addEventListener("popstate", (event) => {
   if (event.state)
      swapText(event.state);
});

if (window.location.hash !== "") {
   swapText(window.location.hash.slice(1));
} else {
   swapText("main", false);
}

if (!('ontouchstart' in document.documentElement)) new CommentSnake();
