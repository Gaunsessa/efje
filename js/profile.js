const PROFILE_TEXT = document.querySelector("#profile_text");

const TEXT = {
   "MAIN": [
      [ "p", "Hello, I am Gus." ],
      [ "p", "I do some things." ],
      [ "br" ],
      [ "p", "Projects:" ],
      [ "p", " - ", [ "w.a", "Dino VS", "javascript:swapText('DINOVS')" ] ],
      [ "p", " - ", [ "w.a", "Word Garden", "javascript:swapText('WORDGARDEN')" ] ],
      [ "p", " - ", [ "w.a", "Haskell Learning", "javascript:swapText('HASKELL')" ] ],
      [ "p", " - ", [ "w.a", "PH Compiler", "javascript:swapText('PH')" ] ],
      [ "p", " - ", [ "w.a", "Odin Errors", "javascript:swapText('ODINERRORS')" ] ],
      [ "p", " - ", [ "w.a", "Notes", "javascript:swapText('NOTES')" ] ],
      [ "p", " - ", [ "w.a", "Game Jams", "javascript:swapText('GAMEJAMS')" ] ],
      [ "p", " - ", [ "w.a", "Others..", "javascript:swapText('OTHERS')" ] ]
   ],
   "DINOVS": [
      [ "a", "../", "javascript:swapText('MAIN')" ],
      [ "p", "PROJECT: Dino VS" ],
      [ "br" ],
      [ "w.p", "Dino VS is an online multiplayer 1v1 site for the chromium dinosaur game." ],
      [ "br" ],
      [ "p", "Hosted Version: ", [ "w.a", "dino.ef.je", "https://dino.ef.je" ] ],
      [ "p", "Github: ", [ "w.a", "Gaunsessa/dinovs", "https://github.com/Gaunsessa/dinovs" ] ]
   ],
   "WORDGARDEN": [
      [ "a", "../", "javascript:swapText('MAIN')" ],
      [ "p", "PROJECT: Word Garden" ],
      [ "br" ],
      [ "w.p", "Word Garden is a communal typing website where anything you type is shown to everyone else but will slowly fade away." ],
      [ "br" ],
      [ "p", "Hosted Version: ", [ "w.a", "ga.ef.je", "https://ga.ef.je" ] ],
      [ "p", "Github: ", [ "w.a", "Gaunsessa/WordGarden", "https://github.com/Gaunsessa/WordGarden" ] ]
   ],
   "HASKELL": [
      [ "a", "../", "javascript:swapText('MAIN')" ],
      [ "p", "PROJECT: Haskell Learning" ],
      [ "br" ],
      [ "w.p", "Small projects to used to learn Haskell." ],
      [ "br" ],
      [ "p", "visnek: ", [ "w.a", "Gaunsessa/visnek", "https://github.com/Gaunsessa/visnek" ] ],
      [ "p", "img2ascii: ", [ "w.a", "Gaunsessa/img2ascii", "https://github.com/Gaunsessa/img2ascii" ] ]
   ],
   "PH": [
      [ "a", "../", "javascript:swapText('MAIN')" ],
      [ "p", "PROJECT: PH Compiler" ],
      [ "br" ],
      [ "w.p", "A work in progress langauge and compiler. Currently not public." ]
   ],
   "ODINERRORS": [
      [ "a", "../", "javascript:swapText('MAIN')" ],
      [ "p", "PROJECT: Odin Errors" ],
      [ "br" ],
      [ "w.p", "Small Sublime Text package to show OdinLang erorrs." ],
      [ "br" ],
      [ "p", "Github: ", [ "w.a", "Gaunsessa/OdinErrors", "https://github.com/Gaunsessa/OdinErrors" ] ]
   ],
   "NOTES": [
      [ "a", "../", "javascript:swapText('MAIN')" ],
      [ "p", "PROJECT: Notes" ],
      [ "br" ],
      [ "w.p", "Simple pastebin like notes site." ],
      [ "br" ],
      [ "p", "Hosted Version: ", [ "w.a", "no.ef.je", "https://no.ef.je" ] ],
      [ "p", "Github: ", [ "w.a", "Gaunsessa/notes", "https://github.com/Gaunsessa/notes" ] ]
   ],
   "GAMEJAMS": [
      [ "a", "../", "javascript:swapText('MAIN')" ],
      [ "p", "PROJECT: Game Jams" ],
      [ "br" ],
      [ "w.p", "Some game jams I have completed in the past with a mate." ],
      [ "br" ],
      [ "p", "Climb Lord: ", [ "w.a", "itch.io/climblord", "https://j3llybee.itch.io/climblord" ] ],
      [ "p", "Keyboard Salad: ", [ "w.a", "itch.io/keyboard-salad", "https://j3llybee.itch.io/keyboard-salad" ] ]
   ],
   "OTHERS": [
      [ "a", "../", "javascript:swapText('MAIN')" ],
      [ "p", "OTHER PROJECTS:" ],
      [ "br" ],
      [ "p", " - MCSeeker, Minecraft server scraper." ],
      [ "p", " - C-Lettuce, Small C util headers." ],
      [ "p", " - Comment Snake, Check out the dev-tools ;)." ],
      [ "p", " - And many many more." ],
   ]
};

function createElm(inp) {
   let tagSplit = inp[0].split(".");

   let elmName = tagSplit.length == 1 ? tagSplit[0] : tagSplit[1];
   let wrap    = tagSplit.length > 1 && tagSplit[0] == "w";

   let elm = document.createElement(elmName);

   let taken = 0;
   switch (elmName) {
      case "br": break;
      case "p":
         elm.innerText = inp[1];

         taken = 1;
         break;
      case "a":
         elm.innerText = inp[1];
         elm.href      = inp[2];

         taken = 2;
         break;
   }

   for (let i = taken + 1; i < inp.length; i++)
      elm.appendChild(createElm(inp[i]));

   if (!wrap) {
      let ret = document.createElement("pre");
      ret.appendChild(elm);

      return ret;
   } else return elm;
}

function swapText(path) {
   PROFILE_TEXT.innerText = "";

   for (let i in TEXT[path]) {
      let inp = TEXT[path][i];

      PROFILE_TEXT.appendChild(createElm(inp));
   }
}