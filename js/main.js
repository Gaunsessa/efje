const ASCII_FACE  = document.querySelector("#face");
const PROFILE     = document.querySelector("#profile");
const PROFILE_CAT = document.querySelector("#profile_img");
const SCROLL_BTN  = document.querySelector("#scroll");

function swapCat() {
   const cats = [
      "hat.jpg",
      "lettis.jpg",
      "pizza.jpg",
      "poppy.jpg",
      "smeeeeg.jpg",
      "snap.jpg",
   ];

   PROFILE_CAT.src = `img/cats/${cats[Math.floor(Math.random() * cats.length)]}`;
}

function swapFace() {
   const faces = [
      "*-*", 
      ";-;", 
      "0-0", 
      "p-p", 
      "^-^", 
      "+-+", 
      "\"-\"", 
      "·-·",
      "×-×",
      "'-'", 
      "o-o", 
      "u-u",
   ];

   const face = faces[Math.floor(Math.random() * faces.length)];

   ASCII_FACE.innerText = face;
   document.title       = face;
}

function getScrollPos() {
   return document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight);
}

function scrollButton() {
   const sp = getScrollPos();

   window.scrollTo({
      top: sp >= 0.5 ? 0 : (document.documentElement.scrollHeight - window.innerHeight),
      behavior: "smooth"
   });
}

function updateScrollButton() {
   const sp = getScrollPos();

   if (sp >= 0.5) SCROLL_BTN.style.transform = "translateX(-50%) rotateX(180deg)";
   else SCROLL_BTN.style.transform = "translateX(-50%)";
}

(function init() {
   document.documentElement.scrollTop = 0;

   swapText("MAIN");
   swapFace();

   if (!('ontouchstart' in document.documentElement)) new CommentSnake();

   let scrollTimout = null;
   document.addEventListener("scroll", event => {
      updateScrollButton();

      const sp = getScrollPos();

      ASCII_FACE.style.zIndex  = 1 - sp;
      ASCII_FACE.style.opacity = 1 - sp;

      ASCII_FACE.style.display = ASCII_FACE.style.opacity <= 0.05 ? "none" : "block";
      
      PROFILE.style.zIndex  = sp;
      PROFILE.style.opacity = sp;

      PROFILE.style.display = PROFILE.style.opacity <= 0.05 ? "none" : "flex";

      if (scrollTimout != null) clearTimeout(scrollTimout);
      scrollTimout = setTimeout(() => {
         window.scrollTo({
            top: sp >= 0.5 ? document.documentElement.scrollHeight - window.innerHeight : 0,
            behavior: "smooth"
         });
      }, 222);
   });
})();