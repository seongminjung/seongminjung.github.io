import { loadCSV } from "./csv-reader.js";
import { parseURL } from "./utils.js";

export class WebHead extends HTMLElement {
  constructor() {
    super();

    const head = document.head;
    this.titleElement = document.createElement("title");
    this.setTitle();
    head.appendChild(this.titleElement);

    const metaTags = [
      { charset: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "description", content: "Seongmin Jung's personal website" },
      { name: "keywords", content: "Seongmin Jung, Robotics" },
      { name: "author", content: "Seongmin Jung" },
      { name: "language", content: "English" },
    ];
    metaTags.forEach((metaData) => {
      const meta = document.createElement("meta");
      Object.entries(metaData).forEach(([key, value]) => meta.setAttribute(key, value));
      head.appendChild(meta);
    });

    const favicon = document.createElement("link");
    favicon.rel = "shortcut icon";
    favicon.href = "/favicon.png";
    head.appendChild(favicon);

    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-LL44K1WZ0G";
    head.appendChild(gtagScript);

    const gtagInlineScript = document.createElement("script");
    gtagInlineScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", "G-LL44K1WZ0G");
    `;
    head.appendChild(gtagInlineScript);

    const mathjaxConfig = document.createElement("script");
    mathjaxConfig.type = "text/x-mathjax-config";
    mathjaxConfig.textContent = `
      MathJax.Hub.Config({
        tex2jax: {inlineMath: [['$', '$'], ['\\\\(', '\\\\)']]}
      });
    `;
    head.appendChild(mathjaxConfig);

    const mathjaxScript = document.createElement("script");
    mathjaxScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML";
    mathjaxScript.async = true;
    head.appendChild(mathjaxScript);

    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    head.appendChild(fontAwesome);

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "/css/index.css";
    head.appendChild(css);

    const mainJs = document.createElement("script");
    mainJs.type = "module";
    mainJs.src = "/js/main.js";
    mainJs.defer = true;
    head.appendChild(mainJs);
  }

  setTitle() {
    const { pagename, category, filename } = parseURL();

    const mainPages = {
      index: "Seongmin Jung",
      publications: "Seongmin Jung | Publications",
      projects: "Seongmin Jung | Projects",
      articles: "Seongmin Jung | Articles",
    };

    if (!category && mainPages[pagename]) {
      this.titleElement.textContent = mainPages[pagename];
      return;
    }

    this.filename = filename;
    loadCSV(category, this.setTitleCallback.bind(this));
  }

  setTitleCallback(articles, categoryMap) {
    if (this.filename) {
      const article = articles.find((article) => article.filename === this.filename);
      this.titleElement.textContent = article.title;
    } else {
      const categoryInfo = categoryMap[articles[0].category_id];
      this.titleElement.textContent = categoryInfo.name;
    }
  }
}
customElements.define("web-head", WebHead);
