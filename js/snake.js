function replaceTextFrom(src, rep, start) {
   return src.substr(0, start) + rep + src.substr(start + rep.length);
}

class CommentSnake {
   constructor() {
      Array.from(document.documentElement.childNodes).filter(n => n.nodeValue === "Check Out Dev Tools")[0].nodeValue = "~~~~SNAKE~~~~";
      this.nodes = Array.from(document.documentElement.childNodes).filter(n => n.nodeValue === "SNAKE");
      
      this.dir = 0;
      this.body = [[6, 5], [6, 4], [6, 3]];
      this.apple = [1, 1];
      this.higscore = 0;
      this.state = 0;
      this.score = 0;
      this.mqueue = [];

      document.body.addEventListener("keydown", event => {
         if (event.key == "Enter" && !this.state) this.startGame();
         if (this.mqueue.length < 4) {
            switch (event.key) {
               case "ArrowUp":
               case "w":
                  if (this.dir != 1) this.setDir(0);
                  break;
               case "ArrowDown":
               case "w":
                  if (this.dir != 0) this.setDir(1);
                  break;
               case "ArrowLeft":
               case "w":
                  if (this.dir != 3) this.setDir(2);
                  break;
               case "ArrowRight":
               case "w":
                  if (this.dir != 2) this.setDir(3);
                  break;
            }
         }
      });

      setInterval(() => {
         if (!this.state) this.renderHome();
         else {
            this.move();
            this.renderGame();
         }
      }, 500);
   }

   startGame = () => {
      this.newApple();

      this.mqueue = [];
      this.dir = 0;
      this.body = [[6, 5], [6, 4], [6, 3]];
      this.score = 0;
      this.state = 1;
   }

   setDir = dir => {
      this.dir = dir;
      this.mqueue.push(dir);
   }

   kill = () => {
      this.state = 0;
      if (this.score > this.higscore) this.higscore = this.score;
   }

   newApple = () => {
      this.apple = [Math.floor(Math.random() * 13), Math.floor(Math.random() * 7)];
      if (this.body.some(b => b[0] == this.apple[0] && b[1] == this.apple[1])) this.newApple();
   }

   move = () => {
      if (this.mqueue.length > 0) this.dir = this.mqueue.shift();

      let nh = Array.from(this.body[this.body.length - 1]);
      nh[this.dir == 0 | this.dir == 1 ? 1 : 0] += this.dir == 0 | this.dir == 2 ? -1 : 1;

      if (this.body.some(b => b[0] == nh[0] && b[1] == nh[1]) || nh[0] < 0 || nh[0] > 12 || nh[1] < 0 || nh[1] > 7)  return this.kill();
      
      this.body.push(nh);

      if (nh[0] == this.apple[0] && nh[1] == this.apple[1]) {
         this.score++;
         this.newApple();
      } else {
         this.body.shift();
      }
   }

   renderGame = () => {
      this.nodes.forEach(n => n.nodeValue = ".............");
      this.body.forEach(b => this.nodes[b[1]].nodeValue = replaceTextFrom(this.nodes[b[1]].nodeValue, "◼", b[0]));
      this.nodes[this.apple[1]].nodeValue = replaceTextFrom(this.nodes[this.apple[1]].nodeValue, "@", this.apple[0]);
   }

   renderHome = () => {
      for (let y = 0; y < 7; y++) {
         let r = "";
   
         for (let x = 0; x < 13; x++) {
            r += Math.floor(Math.random() * 5) ? "·" : "•";
         }
   
         this.nodes[y].nodeValue = r;
      }

      this.nodes[1].nodeValue = replaceTextFrom(this.nodes[1].nodeValue, "HIGHSCORE", 2);
      this.nodes[2].nodeValue = replaceTextFrom(this.nodes[2].nodeValue, this.higscore.toString(), 6 - Math.floor(this.higscore.toString().length / 2));
      this.nodes[4].nodeValue = replaceTextFrom(this.nodes[4].nodeValue, "PRESS", 4);
      this.nodes[5].nodeValue = replaceTextFrom(this.nodes[5].nodeValue, "ENTER", 4);
   }
}
