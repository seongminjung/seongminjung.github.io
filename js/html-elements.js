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
      <a class="category-tag" href="/articles/${folder}.html"><i class="fa fa-book"></i> ${category}</a>
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

    const articlesPath = '/database/articles.csv';
    const categoriesPath = '/database/categories.csv';
    this.filterCategory = this.getAttribute('category');

    if (articlesPath && categoriesPath) {
      this.loadCSV(articlesPath, categoriesPath);
    } else {
      console.error('CSV file paths are required.');
    }
  }

  loadCSV(articlesPath, categoriesPath) {
    Promise.all([
      fetchCSV(articlesPath),
      fetchCSV(categoriesPath)
    ])
    .then(([articles, categories]) => {
      this.categoryMap = this.createCategoryMap(categories);

      if (this.filterCategory) {
        const categoryId = this.getCategoryId(this.filterCategory);
        if (categoryId) {
          const filteredArticles = articles.filter(article => article.category_id === categoryId);
          this.renderArticles(filteredArticles.reverse());
        } else {
          console.error(`Category "${this.filterCategory}" not found.`);
        }
      } else {
        this.renderArticles(articles.reverse());
      }
    })
    .catch(error => console.error('Error loading CSV files:', error));
  }

  createCategoryMap(categories) {
    const map = {};
    categories.forEach(category => {
      map[category.id] = {
        name: category.name,
        folder: category.folder
      };
    });
    return map;
  }

  getCategoryId(categoryName) {
    for (const [id, info] of Object.entries(this.categoryMap)) {
      if (info.name === categoryName) {
        return id;
      }
    }
    return null;
  }

  renderArticles(articles) {
    articles.forEach(article => {
      const category = this.categoryMap[article.category_id];

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
