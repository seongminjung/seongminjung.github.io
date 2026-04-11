import { loadCSV } from "./csv-reader.js";
import { parseURL } from "./utils.js";

const MAIN_PAGE_META = {
  index: {
    title: "Seongmin Jung",
    description:
      "Seongmin Jung is a master's student at Seoul National University, researching 3D Vision and Robotics.",
  },
  publications: {
    title: "Seongmin Jung | Publications",
    description: "Publications by Seongmin Jung — 3D Vision and Robotics researcher at Seoul National University.",
  },
  projects: {
    title: "Seongmin Jung | Projects",
    description: "Projects by Seongmin Jung — 3D Vision and Robotics.",
  },
  study: {
    title: "Seongmin Jung | Study",
    description:
      "Study notes and paper summaries by Seongmin Jung on topics including deep learning, SLAM, and robotics.",
  },
};

export class WebHead extends HTMLElement {
  constructor() {
    super();

    const head = document.head;
    const firstLinkOrScript = head.querySelector("link, script");
    const fragment = document.createDocumentFragment();

    this.titleElement = document.createElement("title");
    fragment.appendChild(this.titleElement);

    this.descriptionElement = document.createElement("meta");
    this.descriptionElement.setAttribute("name", "description");
    this.descriptionElement.setAttribute("content", "Seongmin Jung's personal website");

    const otherMetaTags = [
      { charset: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "keywords", content: "Seongmin Jung, Robotics" },
      { name: "author", content: "Seongmin Jung" },
      { name: "language", content: "English" },
    ];
    fragment.appendChild(this.descriptionElement);
    otherMetaTags.forEach((metaData) => {
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
      {
        tag: "link",
        rel: "stylesheet",
        href: "https://unpkg.com/academicons@1.9.1/css/academicons.min.css",
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
          src: "//mapmyvisitors.com/map.js?d=lhkwnS8G_vrjHqH6j4zkkmHDJU0apnxe7kZ3wjeFSNc&cl=ffffff&w=a",
        }
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

    this.setMeta();
  }

  setMeta() {
    const { pagename, category, filename } = parseURL();

    if (pagename === "projects") {
      this.titleElement.textContent = MAIN_PAGE_META.projects.title;
      this.descriptionElement.setAttribute("content", MAIN_PAGE_META.projects.description);
      return;
    }

    if (!category && MAIN_PAGE_META[pagename]) {
      this.titleElement.textContent = MAIN_PAGE_META[pagename].title;
      this.descriptionElement.setAttribute("content", MAIN_PAGE_META[pagename].description);
      return;
    }

    this.filename = filename;
    loadCSV(category, this.setMetaCallback.bind(this));
  }

  setMetaCallback(articles, categoryMap) {
    if (this.filename) {
      // Individual post page
      const article = articles.find((a) => a.filename === this.filename);
      const categoryInfo = categoryMap[article.category_id];
      const type = categoryInfo?.type;

      this.titleElement.textContent = article.title;
      this.descriptionElement.setAttribute("content", this.buildPostDescription(article, categoryInfo, type));
    } else {
      // Category index page
      const categoryInfo = categoryMap[articles[0].category_id];
      this.titleElement.textContent = categoryInfo.name;
      this.descriptionElement.setAttribute(
        "content",
        `${categoryInfo.name} — study notes by Seongmin Jung.`
      );
    }
  }

  buildPostDescription(article, categoryInfo, type) {
    const date = new Date(article.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (type === "paper") {
      return `Paper summary of "${article.title}". Presented at ${article.detail}. Posted on ${date}.`;
    } else if (type === "lecture") {
      return `Lecture notes on ${article.detail} from ${categoryInfo.name} course. Posted on ${date}.`;
    } else {
      return `${article.title} — ${article.detail}. Posted on ${date}.`;
    }
  }
}
customElements.define("web-head", WebHead);
