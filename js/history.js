class HistoryEntry extends HTMLElement {
   connectedCallback() {
      if (this.shadowRoot) return;

      const article = document.createElement("article");
      const image = document.createElement("img");
      const content = document.createElement("div");
      const heading = document.createElement("h3");
      const description = document.createElement("p");
      const dates = document.createElement("p");
      const style = document.createElement("style");

      image.src = this.getAttribute("src") ?? "";
      image.alt = this.getAttribute("alt") ?? "";
      heading.textContent = this.getAttribute("heading") ?? "";
      description.textContent = this.getAttribute("description") ?? "";
      dates.textContent = this.getAttribute("dates") ?? "";

      content.className = "content";
      dates.className = "dates";
      content.append(heading, description, dates);
      article.append(image, content);

      style.textContent = `
         :host {
            display: block;
         }

         article {
            display: grid;
            grid-template-columns: 4.5rem minmax(0, 1fr);
            align-items: start;
            gap: 0.75rem;
         }

         img {
            display: block;
            width: 4.5rem;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 4px;
         }

         .content > * {
            margin: 0;
         }

         .content > * + * {
            margin-top: 0.15rem;
         }

         h3 {
            font: inherit;
            font-weight: bold;
         }

         .dates {
            color: #666;
         }
      `;

      this.attachShadow({ mode: "open" }).append(style, article);
   }
}

customElements.define("history-entry", HistoryEntry);
