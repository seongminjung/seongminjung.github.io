class ArxivCard extends HTMLElement {
  constructor() {
    super();

    const wrapper = document.createElement('div');
    wrapper.className = 'arxiv-card';

    const title = this.getAttribute('title') || 'Paper Title';
    const authors = this.getAttribute('authors') || 'Authors';
    const link = this.getAttribute('link') || '#';

    wrapper.innerHTML = `
      <a href="${link}" target="_blank">
        <div class="logo-wrapper">
          <img src="/asset/arxiv-logo.svg" alt="ArXiv Logo" class="logo" />
        </div>
        <div class="detail">
          <strong>${title}</strong>
          <p>${authors}</p>
          <span>${link}</span>
        </div>
      </a>
    `;
    this.appendChild(wrapper);
  }
}
customElements.define('arxiv-card', ArxivCard);
