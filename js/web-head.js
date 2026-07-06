import { loadCSV } from "./csv-reader.js";
import { parseURL } from "./utils.js";

const BASE_URL = "https://seongminjung.github.io";
const DEFAULT_OG_IMAGE = `${BASE_URL}/asset/profile.jpg`;

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

    // Open Graph tags
    this.ogTags = {};
    [
      ["og:type", "website"],
      ["og:site_name", "Seongmin Jung"],
      ["og:url", window.location.href],
      ["og:title", "Seongmin Jung"],
      ["og:description", "Seongmin Jung's personal website"],
      ["og:image", DEFAULT_OG_IMAGE],
      ["twitter:card", "summary_large_image"],
      ["twitter:title", "Seongmin Jung"],
      ["twitter:description", "Seongmin Jung's personal website"],
      ["twitter:image", DEFAULT_OG_IMAGE],
    ].forEach(([property, content]) => {
      const meta = document.createElement("meta");
      const attr = property.startsWith("twitter:") ? "name" : "property";
      meta.setAttribute(attr, property);
      meta.setAttribute("content", content);
      this.ogTags[property] = meta;
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
        },
        // Hide the mapmyvisitors widget while keeping visitor tracking alive.
        // map.js bundles jquery.inview and only counts a visit once the widget
        // enters the viewport, so we must NOT use display:none or move it
        // off-screen (either makes it "never in view" and breaks the count).
        // Instead pin it inside the viewport but make it fully transparent and
        // non-interactive. position:fixed keeps it out of document flow so no
        // gap or horizontal scroll appears below the footer.
        {
          tag: "style",
          textContent: `
    #mapmyvisitors-widget,
    .mapmyvisitors-map-control,
    #clustrmaps-widget,
    #clstr_globe {
      position: fixed !important;
      right: 0 !important;
      bottom: 0 !important;
      /* 1px (NOT 0) — a zero-size element is never "in view", which breaks
         the inview-gated visit counting. 1px keeps inview firing. */
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      z-index: -2147483647 !important;
    }
    .jvectormap-tip {
      display: none !important;
    }
          `,
        },
      );
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

  setOgTags(title, description, image = DEFAULT_OG_IMAGE) {
    this.ogTags["og:title"].setAttribute("content", title);
    this.ogTags["og:description"].setAttribute("content", description);
    this.ogTags["og:image"].setAttribute("content", image);
    this.ogTags["twitter:title"].setAttribute("content", title);
    this.ogTags["twitter:description"].setAttribute("content", description);
    this.ogTags["twitter:image"].setAttribute("content", image);
  }

  setMeta() {
    const { pagename, category, filename } = parseURL();

    if (pagename === "projects") {
      const { title, description } = MAIN_PAGE_META.projects;
      this.titleElement.textContent = title;
      this.descriptionElement.setAttribute("content", description);
      this.setOgTags(title, description);
      return;
    }

    if (!category && MAIN_PAGE_META[pagename]) {
      const { title, description } = MAIN_PAGE_META[pagename];
      this.titleElement.textContent = title;
      this.descriptionElement.setAttribute("content", description);
      this.setOgTags(title, description);
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
      const description = this.buildPostDescription(article, categoryInfo, type);
      const image = `${BASE_URL}/study/${categoryInfo.folder}/${article.filename}/img1.png`;

      this.titleElement.textContent = article.title;
      this.descriptionElement.setAttribute("content", description);
      this.setOgTags(article.title, description, image);
    } else {
      // Category index page
      const categoryInfo = categoryMap[articles[0].category_id];
      const title = categoryInfo.name;
      const description = `${categoryInfo.name} — study notes by Seongmin Jung.`;

      this.titleElement.textContent = title;
      this.descriptionElement.setAttribute("content", description);
      this.setOgTags(title, description);
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
