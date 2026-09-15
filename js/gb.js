const PHOTO_WIDTH = 160;
const PHOTO_HEIGHT = 144;
const THUMBNAIL_INSET = 16;
const BACKDROP_FADE_DURATION = 600;

const PALETTES = [
   [[255, 255, 255], [166, 167, 166], [ 81,  81,  81], [  0,   0,   0]],
   [[255, 255, 255], [255, 134, 133], [149,  55,  55], [  0,   0,   0]],
   [[255, 255, 255], [255, 175,  99], [132,  45,   0], [  0,   0,   0]],
   [[255, 255, 255], [124, 255,  44], [  0,  99, 199], [  0,   0,   0]],
   [[255, 255, 255], [101, 166, 156], [  0,   0, 254], [  0,   0,   0]],
   [[255, 255, 255], [140, 141, 223], [ 82,  81, 141], [  0,   0,   0]],
   [[255, 255, 255], [255, 255,   0], [126,  71,   0], [  0,   0,   0]],
   [[255, 255, 255], [255, 255,   0], [254,   0,   0], [  0,   0,   0]],
   [[255, 255, 255], [ 80, 255,   0], [255,  64,   0], [  0,   0,   0]],
   [[255, 255, 166], [254, 149, 149], [148, 149, 254], [  0,   0,   0]],
   [[255, 232, 198], [207, 157, 134], [133, 107,  36], [ 91,  45,   2]],
   [[  0,   0,   0], [  0, 133, 135], [255, 223,   0], [255, 255, 255]],
];

const PHOTO_DIALOG = document.createElement("div");
const PHOTO_BACKDROP = document.createElement("div");

PHOTO_DIALOG.id = "gb-large";
PHOTO_DIALOG.tabIndex = -1;
PHOTO_DIALOG.setAttribute("role", "dialog");
PHOTO_DIALOG.setAttribute("aria-modal", "true");
PHOTO_DIALOG.setAttribute("aria-label", "Expanded photograph");
PHOTO_BACKDROP.id = "gb-backdrop";
PHOTO_BACKDROP.setAttribute("aria-hidden", "true");

let activePhoto = null;
let activePalette = 0;
let photoTransitionRunning = false;
let photoPlaceholder = null;

function drawExpandedPhoto(photo) {
   photo.canvas.width = PHOTO_WIDTH;
   photo.canvas.height = PHOTO_HEIGHT;
   const ctx = photo.canvas.getContext("2d");

   ctx.drawImage(photo.img, 0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);
}

function drawThumbnail(photo) {
   photo.canvas.width = PHOTO_WIDTH - THUMBNAIL_INSET * 2;
   photo.canvas.height = PHOTO_HEIGHT - THUMBNAIL_INSET * 2;
   const ctx = photo.canvas.getContext("2d");

   ctx.drawImage(
      photo.img,
      -THUMBNAIL_INSET,
      -THUMBNAIL_INSET,
      PHOTO_WIDTH,
      PHOTO_HEIGHT,
   );
}

async function transitionPhoto(update) {
   let updated = false;
   const applyUpdate = () => {
      if (updated) return;

      updated = true;
      update();
   };

   if (!document.startViewTransition) {
      applyUpdate();
      return;
   }

   activePhoto.style.viewTransitionName = "gb-photo";

   try {
      const transition = document.startViewTransition(applyUpdate);

      await transition.finished;
   } catch (error) {
      console.error("Photo transition failed:", error);
      applyUpdate();
   } finally {
      activePhoto?.style.removeProperty("view-transition-name");
   }
}

function waitForPaint() {
   return new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
   });
}

async function openPhoto(photo) {
   if (photoTransitionRunning || PHOTO_DIALOG.isConnected || !photo.img.complete) return;

   photoTransitionRunning = true;
   activePhoto = photo;
   activePalette = 0;
   photoPlaceholder = document.createElement("span");
   photoPlaceholder.className = "gb-photo-placeholder";
   photoPlaceholder.style.width = `${photo.offsetWidth}px`;
   photoPlaceholder.style.height = `${photo.offsetHeight}px`;

   document.body.append(PHOTO_BACKDROP, PHOTO_DIALOG);
   await waitForPaint();
   PHOTO_BACKDROP.classList.add("gb-backdrop--open");
   await waitForPaint();

   await transitionPhoto(() => {
      photo.before(photoPlaceholder);
      drawExpandedPhoto(photo);
      photo.classList.add("gb-photo--expanded");
      PHOTO_DIALOG.append(photo);
   });

   photoTransitionRunning = false;
   PHOTO_DIALOG.focus({ preventScroll: true });
}

async function closePhoto() {
   if (photoTransitionRunning || !PHOTO_DIALOG.isConnected) return;

   const source = activePhoto;
   photoTransitionRunning = true;

   PHOTO_BACKDROP.classList.remove("gb-backdrop--open");
   const backdropFade = new Promise(resolve => {
      window.setTimeout(resolve, BACKDROP_FADE_DURATION + 50);
   });
   await waitForPaint();

   await transitionPhoto(() => {
      source.classList.remove("gb-photo--expanded");
      drawThumbnail(source);
      photoPlaceholder.replaceWith(source);
   });

   await backdropFade;

   PHOTO_BACKDROP.remove();
   PHOTO_DIALOG.remove();
   photoPlaceholder = null;
   activePalette = 0;
   activePhoto = null;
   photoTransitionRunning = false;
   source?.focus({ preventScroll: true });
}

PHOTO_DIALOG.addEventListener("click", closePhoto);

function cyclePalette() {
   if (photoTransitionRunning || !activePhoto) return;

   const nextPalette = (activePalette + 1) % PALETTES.length;
   const ctx = activePhoto.canvas.getContext("2d");
   const data = ctx.getImageData(0, 0, PHOTO_WIDTH, PHOTO_HEIGHT);
   const pixels = data.data;

   for (let pixel = 0; pixel < pixels.length; pixel += 4) {
      for (let color = 0; color < 4; color++) {
         if (pixels[pixel + 0] === PALETTES[activePalette][color][0] &&
             pixels[pixel + 1] === PALETTES[activePalette][color][1] &&
             pixels[pixel + 2] === PALETTES[activePalette][color][2]) {
            pixels[pixel + 0] = PALETTES[nextPalette][color][0];
            pixels[pixel + 1] = PALETTES[nextPalette][color][1];
            pixels[pixel + 2] = PALETTES[nextPalette][color][2];
            break;
         }
      }
   }

   activePalette = nextPalette;
   ctx.putImageData(data, 0, 0);
}

document.addEventListener("keydown", event => {
   if (event.key === "Escape" && PHOTO_DIALOG.isConnected) {
      closePhoto();
   }
});

class GBPhoto extends HTMLElement {
   connectedCallback() {
      if (this.shadowRoot) return;

      const shadow = this.attachShadow({ mode: "open" });

      this.canvas = document.createElement("canvas");
      this.canvas.width = PHOTO_WIDTH - THUMBNAIL_INSET * 2;
      this.canvas.height = PHOTO_HEIGHT - THUMBNAIL_INSET * 2;

      this.img = new Image(PHOTO_WIDTH, PHOTO_HEIGHT);
      this.img.src = this.getAttribute("src");

      this.img.onload = () => {
         drawThumbnail(this);
      };

      const style = document.createElement("style");
      style.textContent = `
         :host {
            display: inline-block;
            line-height: 0;
         }

         canvas {
            display: block;
            image-rendering: pixelated;
            cursor: zoom-in;
         }

         :host(.gb-photo--expanded) canvas {
            width: min(80vw, 88.889vh);
            height: min(72vw, 80vh);
            cursor: pointer;
         }
      `;

      shadow.append(style, this.canvas);

      this.tabIndex = 0;
      this.setAttribute("role", "button");
      this.setAttribute("aria-label", "Expand photograph");

      this.addEventListener("click", event => {
         event.stopPropagation();

         if (this === activePhoto && PHOTO_DIALOG.isConnected) {
            cyclePalette();
         } else {
            openPhoto(this);
         }
      });

      this.addEventListener("keydown", event => {
         if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (this === activePhoto && PHOTO_DIALOG.isConnected) {
               cyclePalette();
            } else {
               openPhoto(this);
            }
         }
      });
   }
}

customElements.define("gb-photo", GBPhoto);
