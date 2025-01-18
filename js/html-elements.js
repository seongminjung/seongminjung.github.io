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

    // Format date string
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    wrapper.innerHTML = `
      <a id="category-tag" href="/articles/${folder}.html"><i class="fa fa-book"></i> ${category}</a>
      <a class="grid" href="/articles/${folder}/${filename}.html">
        <h2>${title}</h2>
        <p class="date">Posted on <time datetime="${date}">${formattedDate}</time></p>
        <img class="preview" src="/articles/${folder}/${filename}/img1.png" alt="preview" />
        <p class="detail">${detail}</p>
      </a>
    `;
    this.appendChild(wrapper);
  }
}
customElements.define('article-item', ArticleItem);

class ArticleItemList extends HTMLElement {
  constructor() {
    super();

    const csvPath = this.getAttribute('src');
    const filterCategory = this.getAttribute('category');

    if (csvPath) {
      this.loadCSV(csvPath, filterCategory);
    } else {
      console.error('CSV file path is required.');
    }
  }

  loadCSV(filePath, filterCategory) {
    fetchCSV(filePath, (articles) => {
      if (filterCategory) {
        articles = articles.filter(article =>
          article.category === filterCategory
        );
      }
      this.renderArticles(articles);
    });
  }

  renderArticles(articles) {
    articles.forEach(article => {
      const item = document.createElement('article-item');
      item.setAttribute('title', article.title);
      item.setAttribute('date', article.date);
      item.setAttribute('category', article.category);
      item.setAttribute('folder', article.folder);
      item.setAttribute('filename', article.filename);
      item.setAttribute('detail', article.detail);
      this.appendChild(item);
    });
  }
}
customElements.define('article-item-list', ArticleItemList);

class ArxivCard extends HTMLElement {
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
