import { ApiService } from '../apiService';
import type { Article, Category } from '../types';
import { getAllArticles } from '../articlesData';

const CATEGORIES: Category[] = [
  'All',
  'Engineering',
  'Technology',
  'Leadership',
  'Productivity',
  'Career',
  'HR & Culture',
];

export class HomeView {
  private container: HTMLElement;
  private selectedCategory: Category = 'All';
  private searchQuery = '';

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(): void {
    this.container.innerHTML = `
      <section class="home-hero">
        <div class="container hero-container">
          <div class="hero-badge" id="api-status-badge">ðŸ”„ API: Connecting...</div>
          <h1 class="hero-title">Discover, learn, and grow with insights from coworkers.</h1>
          <p class="hero-subtitle">
            CompanyPulse connects our teams through technical lessons learned, architecture RFCs,
            leadership experiences, and engineering stories.
          </p>
        </div>
      </section>

      <section class="home-content">
        <div class="container">
          <!-- Toolbar: Search & Category Filter -->
          <div class="feed-toolbar">
            <div class="search-box">
              <span class="search-icon" aria-hidden="true">🔍</span>
              <input
                id="article-search-input"
                type="search"
                class="search-input"
                placeholder="Search articles by title, author, or tags..."
                value="${this.searchQuery}"
                aria-label="Search articles"
              />
              ${
                this.searchQuery
                  ? `<button id="clear-search-btn" class="clear-search-btn" type="button" aria-label="Clear search">✕</button>`
                  : ''
              }
            </div>

            <div class="category-filters" role="tablist" aria-label="Article categories">
              ${CATEGORIES.map(
                (cat) => `
                <button
                  type="button"
                  role="tab"
                  class="category-pill ${this.selectedCategory === cat ? 'is-active' : ''}"
                  data-category="${cat}"
                  aria-selected="${this.selectedCategory === cat}"
                >
                  ${cat}
                </button>
              `,
              ).join('')}
            </div>
          </div>

          <!-- Article Cards Grid -->
          <div id="articles-grid" class="articles-grid">
            ${this.renderCardsHtml(this.getFilteredArticles())}
          </div>
        </div>
      </section>
    `;

    this.bindEvents();
    ApiService.checkHealth().then((isOnline) => {
      const badge = this.container.querySelector<HTMLElement>('#api-status-badge');
      if (badge) {
        if (isOnline) {
          badge.textContent = 'ðŸŸ¢ API Connected (port 3001)';
          badge.classList.add('is-api-online');
        } else {
          badge.textContent = 'ðŸŸ¡ Offline Mode (Local Storage)';
        }
      }
    });
  }

  private getFilteredArticles(): Article[] {
    return getAllArticles().filter((article) => {
      // Category match
      const matchesCategory =
        this.selectedCategory === 'All' || article.category === this.selectedCategory;

      // Search match (title, intro, author name, or tags)
      const q = this.searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.intro.toLowerCase().includes(q) ||
        article.author.name.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }

  private renderCardsHtml(articles: Article[]): string {
    if (articles.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon" aria-hidden="true">🔎</div>
          <h2 class="empty-title">No articles found</h2>
          <p class="empty-desc">
            No knowledge posts match your current search or category filter.
          </p>
          <button id="reset-filters-btn" class="secondary-button" type="button">
            Reset Filters
          </button>
        </div>
      `;
    }

    return articles
      .map(
        (article) => `
        <article class="article-card">
          <a href="#article/${article.id}" class="card-clickable-area" aria-label="Read article: ${article.title}">
            <div class="card-meta">
              <span class="card-category">${article.category}</span>
              <span class="card-dot">•</span>
              <span class="card-read-time">${article.readTime}</span>
            </div>

            <h2 class="card-title">${article.title}</h2>
            <p class="card-intro">${article.intro}</p>
          </a>

          <div class="card-footer">
            <a href="#author/${encodeURIComponent(article.author.name)}" class="card-author-link" aria-label="View profile of ${article.author.name}">
              <div class="card-avatar" aria-hidden="true">${article.author.avatar}</div>
              <div class="card-author-info">
                <strong>${article.author.name}</strong>
                <span>${article.publishedDate}</span>
              </div>
            </a>

            <div class="card-reaction-preview" aria-label="${article.appreciations} appreciations">
              <span class="heart-mini-icon" aria-hidden="true">❤️</span>
              <span>${article.appreciations.toLocaleString()}</span>
            </div>
          </div>
        </article>
      `,
      )
      .join('');
  }

  private bindEvents(): void {
    const searchInput = this.container.querySelector<HTMLInputElement>('#article-search-input');
    const clearBtn = this.container.querySelector<HTMLButtonElement>('#clear-search-btn');
    const categoryContainer = this.container.querySelector<HTMLElement>('.category-filters');

    // Search input typing
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = (e.target as HTMLInputElement).value;
      this.updateGrid();
    });

    // Clear search
    clearBtn?.addEventListener('click', () => {
      this.searchQuery = '';
      if (searchInput) searchInput.value = '';
      this.updateGrid();
    });

    // Category pill selection
    categoryContainer?.addEventListener('click', (e) => {
      const button = (e.target as HTMLElement).closest<HTMLButtonElement>('.category-pill');
      if (!button) return;

      const category = button.dataset.category as Category;
      if (category && category !== this.selectedCategory) {
        this.selectedCategory = category;

        // Update active class
        this.container.querySelectorAll('.category-pill').forEach((pill) => {
          pill.classList.remove('is-active');
          pill.setAttribute('aria-selected', 'false');
        });
        button.classList.add('is-active');
        button.setAttribute('aria-selected', 'true');

        this.updateGrid();
      }
    });

    // Reset filters button in empty state
    this.container.addEventListener('click', (e) => {
      const resetBtn = (e.target as HTMLElement).closest('#reset-filters-btn');
      if (resetBtn) {
        this.selectedCategory = 'All';
        this.searchQuery = '';
        this.render(); // Re-render whole view to reset input and pills
      }
    });
  }

  private updateGrid(): void {
    const grid = this.container.querySelector<HTMLElement>('#articles-grid');
    if (grid) {
      grid.innerHTML = this.renderCardsHtml(this.getFilteredArticles());
    }
  }
}
