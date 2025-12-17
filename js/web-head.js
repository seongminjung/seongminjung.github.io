import { loadCSV } from "./csv-reader.js";
import { parseURL } from "./utils.js";

export class WebHead extends HTMLElement {
  constructor() {
    super();

    const head = document.head;
    const firstLinkOrScript = head.querySelector("link, script");
    const fragment = document.createDocumentFragment();

    this.titleElement = document.createElement("title");
    this.setTitle();
    fragment.appendChild(this.titleElement);

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
      fragment.appendChild(meta);
    });

    const resources = [
      { tag: "link", rel: "shortcut icon", href: "/favicon.png" },
      {
        tag: "script",
        type: "text/x-mathjax-config",
        textContent: `
MathJax.Hub.Config({
  tex2jax: {inlineMath: [['$', '$'], ['\\\\(', '\\\\)']]}
});
      `,
      },
      {
        tag: "script",
        async: true,
        src: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML",
      },
      {
        tag: "link",
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
      },
    ];

    if (location.hostname.endsWith(".github.io")) {
      resources.push(
        { tag: "script", async: true, src: "https://www.googletagmanager.com/gtag/js?id=G-LL44K1WZ0G" },
        {
          tag: "script",
          textContent: `
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", "G-LL44K1WZ0G");
        `,
        },
        {
          tag: "script",
          id: "mapmyvisitors",
          type: "text/javascript",
          src: "//mapmyvisitors.com/map.js?d=lhkwnS8G_vrjHqH6j4zkkmHDJU0apnxe7kZ3wjeFSNc&cl=ffffff&w=a"
        },
      );

      // hide mapmyvisitors widget
      const observer = new MutationObserver(() => {
        const els = document.querySelectorAll(
          "#mapmyvisitors, .mapmyvisitors, .mv-container, img[alt='mapmyvisitors']"
        );
        els.forEach((el) => el.remove());
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    resources.forEach((res) => {
      const element = document.createElement(res.tag);
      Object.entries(res).forEach(([key, value]) => {
        if (key !== "tag" && key !== "textContent") element.setAttribute(key, value);
      });
      if (res.textContent) element.textContent = res.textContent;
      fragment.appendChild(element);
    });

    head.insertBefore(fragment, firstLinkOrScript);
  }

  setTitle() {
    const { pagename, category, filename } = parseURL();

    const mainPages = {
      index: "Seongmin Jung",
      publications: "Seongmin Jung | Publications",
      projects: "Seongmin Jung | Projects",
      study: "Seongmin Jung | Study",
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
