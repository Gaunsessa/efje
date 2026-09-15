const LEFT_PROJECT_LIST = document.querySelector("#left-project-list");
const RIGHT_PROJECT_LIST = document.querySelector("#right-project-list");
const MAIN_COLUMN = document.querySelector("#container");
const SITE_LAYOUT = document.querySelector(".site-layout");
const COLUMN_START = 0.75;
const MOBILE_LAYOUT = window.matchMedia("(max-width: 800px)");

const CAT_IMAGES = [
   "hat.jpg",
   "lettis.jpg",
   "pizza.jpg",
   "poppy.jpg",
   "smeeeeg.jpg",
   "snap.jpg",
];

function swapCat(catImage) {
   const cat = CAT_IMAGES[Math.floor(Math.random() * CAT_IMAGES.length)];

   catImage.src = `img/cats/${cat}`;
}

function updatePhotographyOffset() {
   if (MOBILE_LAYOUT.matches) {
      LEFT_PROJECT_LIST.style.removeProperty("--left-project-offset");
      return;
   }

   const projectsColumn = RIGHT_PROJECT_LIST.querySelector(".project");

   if (!projectsColumn) return;

   const layoutTop = SITE_LAYOUT.getBoundingClientRect().top;
   const projectsTop = projectsColumn.getBoundingClientRect().top - layoutTop;
   const targetStart = projectsTop + projectsColumn.offsetHeight * COLUMN_START;
   const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
   const minimumGap = rootFontSize * 2;
   const offset = Math.max(minimumGap, targetStart - MAIN_COLUMN.offsetHeight);

   LEFT_PROJECT_LIST.style.setProperty("--left-project-offset", `${offset}px`);
}

const projectsColumn = RIGHT_PROJECT_LIST.querySelector(".project");

updatePhotographyOffset();

if (projectsColumn && "ResizeObserver" in window) {
   const resizeObserver = new ResizeObserver(updatePhotographyOffset);

   resizeObserver.observe(MAIN_COLUMN);
   resizeObserver.observe(projectsColumn);
}

window.addEventListener("resize", updatePhotographyOffset);

if (!("ontouchstart" in document.documentElement)) {
   new CommentSnake();
}
