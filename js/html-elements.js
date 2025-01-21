import { loadCSV } from './csv-reader.js';

function parseURL() {
  try {
    const url = window.location.href;
    const pathParts = new URL(url).pathname.split('/').filter(part => part);

    const category = pathParts.length > 1 ? pathParts[1].replace('.html', '') : null;
    const filename = pathParts.length > 2 ? pathParts[2].replace('.html', '') : null;

    return { category, filename };
  } catch (error) {
    console.error('Error parsing blog URL:', error);
    return { category: null, filename: null };
  }
}

function formatDate(date) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

class ArticleItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const wrapper = document.createElement('div');
    wrapper.className = 'item';

    const title = this.getAttribute('title') || 'Article Title';
    const date = this.getAttribute('date') || 'Posted Date';
    const category = this.getAttribute('category') || 'Category';
    const folder = this.getAttribute('folder') || 'Folder';
    const filename = this.getAttribute('filename') || 'Example';
    const detail = this.getAttribute('detail') || 'Detail Text';

    wrapper.innerHTML = `
      <a class="category-tag" href="/articles/${folder}.html"><i class="fa fa-book"></i> ${category}</a>
      <a class="grid" href="/articles/${folder}/${filename}.html">
        <h2>${title}</h2>
        <p class="date">Posted on <time datetime="${date}">${formatDate(date)}</time></p>
        <img class="preview" src="/articles/${folder}/${filename}/img1.png" alt="preview" />
        <p class="detail">${detail}</p>
      </a>
    `;
    this.appendChild(wrapper);
  }
}
customElements.define('article-item', ArticleItem);

export class ArticleItemList extends HTMLElement {
  constructor() {
    super();
    const { category } = parseURL();
    loadCSV(category, this.renderArticles.bind(this));
  }

  renderArticles(articles, categoryMap) {
    articles.reverse().forEach(article => {
      const category = categoryMap[article.category_id];

      if (category) {
        const item = document.createElement('article-item');
        item.setAttribute('title', article.title);
        item.setAttribute('date', article.date);
        item.setAttribute('category', category.name);
        item.setAttribute('folder', category.folder);
        item.setAttribute('filename', article.filename);
        item.setAttribute('detail', article.detail);
        this.appendChild(item);
      } else {
        console.error(`Category ID "${article.category_id}" not found in categories.`);
      }
    });
  }
}
customElements.define('article-item-list', ArticleItemList);

export class ArxivCard extends HTMLElement {
  constructor() {
    super();

    const wrapper = document.createElement('div');
    wrapper.className = 'arxiv-card';

    const title = this.getAttribute('title') || 'Paper Title';
    const venue = this.getAttribute('venue') || 'Venue';
    const authors = this.getAttribute('authors') || 'Authors';
    const link = this.getAttribute('link') || '#';

    wrapper.innerHTML = `
      <a href="${link}" target="_blank">
        <div class="logo-wrapper">
          <img src="/asset/arxiv-logo.svg" alt="ArXiv Logo" class="logo" />
        </div>
        <div class="detail">
          <strong>${title}</strong>
          <p class="venue">${venue}</p>
          <p class="authors">${authors}</p>
          <span>${link}</span>
        </div>
      </a>
    `;
    this.appendChild(wrapper);
  }
}
customElements.define('arxiv-card', ArxivCard);

export class PostFooter extends HTMLElement {
  constructor() {
    super();
    const { category, filename } = parseURL();
    this.category = category;
    this.filename = filename;
    loadCSV(this.category, this.renderPostFooter.bind(this));
  }

  renderPostFooter(articles, categoryMap) {
    const index = articles.findIndex(article => article.filename === this.filename);

    let visibleArticles;
    if (articles.length <= 5) {
      visibleArticles = articles;
    } else {
      if (index <= 1) {
        visibleArticles = articles.slice(0, 5);
      }
      else if (index >= articles.length - 2) {
        visibleArticles = articles.slice(articles.length - 5);
      }
      else {
        visibleArticles = articles.slice(index - 2, index + 3);
      }
    }
    visibleArticles.reverse();

    const categoryInfo = categoryMap[articles[index]?.category_id];
    const categoryName = categoryInfo?.name || '';
    const folder = categoryInfo?.folder || '';

    const profileHTML = `
      <div class="post-footer-profile">
        <img src="/asset/cover.jpg" alt="Seongmin Jung" />
        <h1>Seongmin Jung</h1>
      </div>
      <h2>Other posts in <a href="/articles/${folder}.html">${categoryName}</a> category</h2>
    `;

    const listHTML = visibleArticles
      .map(article => {
        const isCurrent = article.filename === this.filename;
        return `
          <li>
            <a href="/articles/${folder}/${article.filename}.html">
              <span>${isCurrent ? `<b>${article.title}</b>` : article.title}</span>
              <time datetime="${article.date}">${formatDate(article.date)}</time>
            </a>
          </li>
        `;
      })
      .join('');

    this.innerHTML = `
      <div class="post-footer">
        ${profileHTML}
        <ul>
          ${listHTML}
        </ul>
      </div>
    `;
  }
}
customElements.define('post-footer', PostFooter);
