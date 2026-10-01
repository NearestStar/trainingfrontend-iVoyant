import type { Author, Article } from '../types';
import {
  getAuthorDetails,
  getAuthorArticles,
  isUserConnected,
  isUserSubscribed,
  toggleConnect,
  toggleSubscribe,
} from '../authorsData';

export class AuthorProfileView {
  private container: HTMLElement;
  private author: Author;
  private articles: Article[];

  constructor(container: HTMLElement, authorName: string) {
    this.container = container;
    this.author = getAuthorDetails(authorName);
    this.articles = getAuthorArticles(authorName);
  }

  public render(): void {
    const isConnected = isUserConnected(this.author.name);
    const isSubscribed = isUserSubscribed(this.author.name);

    // Calculate total appreciations received across their articles
    const totalAppreciations = this.articles.reduce(
      (sum, a) => sum + (a.appreciations || 0),
      0,
    );

    const followers =
      (this.author.followersCount || 150) + (isSubscribed ? 1 : 0);

    this.container.innerHTML = `
      <section class="author-profile-page">
        <div class="container profile-container">

          <div class="article-navigation">
            <a href="#home" class="back-nav-link" aria-label="Back to all articles">
              ← Back to all articles
            </a>
          </div>

          <!-- Profile Card -->
          <div class="profile-card">
            <div class="profile-header-top">
              <div class="profile-avatar" aria-hidden="true">${this.author.avatar}</div>

              <div class="profile-header-info">
                <div class="profile-name-row">
                  <h1 class="profile-name">${this.escapeHtml(this.author.name)}</h1>
                  <span class="profile-dept-badge">${this.escapeHtml(this.author.department || 'Engineering')}</span>
                </div>

                <p class="profile-role">${this.escapeHtml(this.author.role)}</p>
                <p class="profile-bio">${this.escapeHtml(this.author.bio || '')}</p>
              </div>
            </div>

            <!-- Profile Stats Row -->
            <div class="profile-stats-row">
              <div class="stat-box">
                <span class="stat-number">${this.articles.length}</span>
                <span class="stat-label">Articles Published</span>
              </div>

              <div class="stat-box">
                <span class="stat-number">${totalAppreciations.toLocaleString()}</span>
                <span class="stat-label">Total Hearts Received ❤️</span>
              </div>

              <div class="stat-box">
                <span class="stat-number" id="followers-count">${followers.toLocaleString()}</span>
                <span class="stat-label">Subscribers 👥</span>
              </div>

              <div class="profile-actions-inline">
                <button
                  type="button"
                  id="profile-connect-btn"
                  class="secondary-button connect-toggle-btn ${isConnected ? 'is-active' : ''}"
                >
                  ${isConnected ? '✓ Connected' : '+ Connect'}
                </button>

                <button
                  type="button"
                  id="profile-subscribe-btn"
                  class="primary-button subscribe-toggle-btn ${isSubscribed ? 'is-active' : ''}"
                >
                  ${isSubscribed ? '✓ Subscribed' : 'Subscribe'}
                </button>
              </div>
            </div>

          </div>

          <!-- Author's Published Articles -->
          <div class="author-articles-section">
            <div class="section-title-row">
              <h2 class="section-title">
                Articles by ${this.escapeHtml(this.author.name)}
                <span class="section-badge">${this.articles.length}</span>
              </h2>
            </div>

            <div class="articles-grid">
              ${this.renderAuthorArticlesHtml()}
            </div>
          </div>

        </div>
      </section>
    `;

    this.bindEvents();
  }

  private renderAuthorArticlesHtml(): string {
    if (this.articles.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon" aria-hidden="true">📝</div>
          <h3 class="empty-title">No articles yet</h3>
          <p class="empty-desc">${this.escapeHtml(this.author.name)} hasn't published any articles yet.</p>
        </div>
      `;
    }

    return this.articles
      .map(
        (article) => `
        <article class="article-card">
          <a href="#article/${article.id}" class="card-clickable-area" aria-label="Read article: ${this.escapeHtml(article.title)}">
            <div class="card-meta">
              <span class="card-category">${article.category}</span>
              <span class="card-dot">•</span>
              <span class="card-read-time">${article.readTime}</span>
            </div>

            <h3 class="card-title">${this.escapeHtml(article.title)}</h3>
            <p class="card-intro">${this.escapeHtml(article.intro)}</p>
          </a>

          <div class="card-footer">
            <div class="card-author">
              <div class="card-avatar" aria-hidden="true">${article.author.avatar}</div>
              <div class="card-author-info">
                <strong>${this.escapeHtml(article.author.name)}</strong>
                <span>${article.publishedDate}</span>
              </div>
            </div>

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
    const connectBtn = this.container.querySelector<HTMLButtonElement>('#profile-connect-btn');
    const subscribeBtn = this.container.querySelector<HTMLButtonElement>('#profile-subscribe-btn');
    const followersEl = this.container.querySelector<HTMLElement>('#followers-count');

    connectBtn?.addEventListener('click', () => {
      const active = toggleConnect(this.author.name);
      connectBtn.classList.toggle('is-active', active);
      connectBtn.textContent = active ? '✓ Connected' : '+ Connect';
    });

    subscribeBtn?.addEventListener('click', () => {
      const active = toggleSubscribe(this.author.name);
      subscribeBtn.classList.toggle('is-active', active);
      subscribeBtn.textContent = active ? '✓ Subscribed' : 'Subscribe';

      if (followersEl) {
        const base = this.author.followersCount || 150;
        followersEl.textContent = (base + (active ? 1 : 0)).toLocaleString();
      }
    });
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
