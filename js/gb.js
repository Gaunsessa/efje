// Array of GBC palettes
const palettes = [
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

// Array of all photos
let GB_PHOTOS = [];

// Full screen view
const GB_LARGE = document.createElement("div");

GB_LARGE.id = "gb-large"
GB_LARGE.idx = 0;
GB_LARGE.palette = 0;
GB_LARGE.innerHTML = `
   <button>〈</button>
   <canvas width='160' height='144'></canvas>
   <button>〉</button>
   <style>
      #gb-large {
         display: flex;
         position: fixed;

         top: 0;
         left: 0;

         width: 100vw;
         height: 100vh;

         justify-content: center;
         align-items: center;

         gap: 2em;

         backdrop-filter: blur(10px);
      }

      canvas {
         display: inline-block;

         width: 75vmin;
         height: 75vmin;

         image-rendering: pixelated;

         cursor: pointer;
      }

      button {
         font-size: 8em;
         font-weight: lighter;

         color: #0F0F0FF0;

         background-color: #00000000;

         cursor: pointer;
         user-select: none;
      }

      @media (max-width:900px) {
         #gb-large {
            flex-direction: column;
         }

         button {
            transform: rotate(90deg);
         }
      }
   </style>
`;

// TODO: on mobile make the arrows on the top and bottom

// background-color: #0A0A0ACC;

// Background
GB_LARGE.addEventListener("click", event => {
   GB_LARGE.palette = 0;
   GB_LARGE.remove();
});

// Image
GB_LARGE.children[1].addEventListener("click", event => {
   event.stopPropagation();

   const next_palette = (GB_LARGE.palette + 1) % palettes.length;

   const ctx = GB_LARGE.children[1].getContext("2d");

   let data   = ctx.getImageData(0, 0, 160, 144);
   let pixels = data.data;

   for (let p = 0; p < pixels.length; p += 4)
      for (let i = 0; i < 4; i++)
         if (pixels[p + 0] == palettes[GB_LARGE.palette][i][0] && 
             pixels[p + 1] == palettes[GB_LARGE.palette][i][1] &&
             pixels[p + 2] == palettes[GB_LARGE.palette][i][2]) {
            pixels[p + 0] = palettes[next_palette][i][0];
            pixels[p + 1] = palettes[next_palette][i][1];
            pixels[p + 2] = palettes[next_palette][i][2];

            break;
         }

   GB_LARGE.palette = next_palette;

   ctx.putImageData(data, 0, 0);
});

// Left
GB_LARGE.children[0].addEventListener("click", event => {
   event.stopPropagation();

   GB_LARGE.palette = 0;
   GB_LARGE.idx = Math.min(GB_PHOTOS.length - 1, Math.max(0, GB_LARGE.idx - 1));

   GB_LARGE.children[1].getContext("2d").drawImage(GB_PHOTOS[GB_LARGE.idx].img, 0, 0);
});

// Right
GB_LARGE.children[2].addEventListener("click", event => {
   event.stopPropagation();

   GB_LARGE.palette = 0;
   GB_LARGE.idx = Math.min(GB_PHOTOS.length - 1, Math.max(0, GB_LARGE.idx + 1));

   GB_LARGE.children[1].getContext("2d").drawImage(GB_PHOTOS[GB_LARGE.idx].img, 0, 0);
});

// GBphoto
class GBPhoto extends HTMLElement {
   constructor() {
      super();
   }

   connectedCallback() {
      const shadow = this.attachShadow({ mode: "open" });

      this.canvas = document.createElement("canvas");
      this.canvas.width = 160 - 32;
      this.canvas.height = 144 - 32;     

      this.img = new Image(160, 144);
      this.img.src = this.getAttribute("src");

      this.img.onload = () => {
         let ctx = this.canvas.getContext("2d");

         ctx.drawImage(this.img, -16, -16, 160, 144);
      } 

      const style = document.createElement("style");
      style.textContent = `
         canvas {
            image-rendering: pixelated;

            cursor: pointer;
         }
      `;

      shadow.appendChild(this.canvas);
      shadow.appendChild(style);

      // Callbacks
      this.addEventListener("click", this.click);

      // Register this as an element
      GB_PHOTOS.push(this);
   }

   disconnectedCallback() {
      GB_PHOTOS.splice(GB_PHOTOS.indexOf(this), 1);
   }

   click(event) {
      event.stopPropagation();

      GB_LARGE.idx = GB_PHOTOS.indexOf(this);
      GB_LARGE.children[1].getContext("2d").drawImage(this.img, 0, 0);
      document.body.appendChild(GB_LARGE);
   }
}

// Bind gbphoto
customElements.define("gb-photo", GBPhoto);