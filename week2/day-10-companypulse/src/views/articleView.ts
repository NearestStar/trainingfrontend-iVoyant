import { ApiService } from '../apiService';
import { isUserConnected, isUserSubscribed, toggleConnect, toggleSubscribe } from '../authorsData';
import { CommentsSection } from './commentsSection';
import type { Article } from '../types';
import { getAllArticles } from '../articlesData';
import { ReadingTracker } from '../readingTracker';
import { EngagementCharacter } from '../engagementCharacter';

export class ArticleView {
  private container: HTMLElement;
  private article: Article;
  private tracker: ReadingTracker | null = null;
  private character: EngagementCharacter | null = null;

  // Heart state
  private heartsGiven = 0;
  private readonly MAX_HEARTS = 10;
  private currentAppreciations: number;

  constructor(container: HTMLElement, articleId?: string) {
    this.container = container;
    // Find article or fallback to first
    const all = getAllArticles();
    const found = all.find((a) => a.id === articleId);
    this.article = found || all[0];
    this.currentAppreciations = this.article.appreciations;
  }

  public render(): void {
    this.container.innerHTML = `
      <article class="article-page">
        <div class="container article-container">

          <div class="article-navigation">
            <a href="#home" class="back-nav-link" aria-label="Back to all articles">
              ← Back to articles
            </a>
          </div>

          <div class="article-meta">
            <span class="category">${this.article.category}</span>
            <span>•</span>
            <span>${this.article.readTime}</span>
          </div>

          <h1>${this.article.title}</h1>

          <p class="article-intro">${this.article.intro}</p>

          <div class="author">
            <a href="#author/${encodeURIComponent(this.article.author.name)}" class="author-header-link" aria-label="View profile of ${this.article.author.name}">
              <div class="author-avatar" aria-hidden="true">${this.article.author.avatar}</div>

              <div class="author-info">
                <strong>${this.article.author.name}</strong>
                <span>${this.article.author.role}</span>
              </div>
            </a>

            <button class="connect-button" type="button" id="author-quick-connect">
              Connect
            </button>
          </div>

          <div class="article-divider"></div>

          <div class="article-content">
            ${this.article.contentHtml}
          </div>

          <!-- Progressive Heart Reaction Section -->
          <section class="article-reaction" aria-label="Article appreciation">
            <p class="reaction-label">
              Did this article help you?
            </p>

            <button
              id="heart-button"
              class="heart-button"
              type="button"
              aria-label="Appreciate this article with hearts"
            >
              <span class="sr-only">Send heart</span>
            </button>

            <p class="heart-count">
              <strong id="heart-count">${this.currentAppreciations.toLocaleString()}</strong>
              appreciations
            </p>

            <p id="heart-progress" class="heart-progress">
              Send some appreciation (0 / ${this.MAX_HEARTS})
            </p>
          </section>

          <!-- Author Bio & Actions Footer -->
          <section class="author-footer">
            <div class="author-avatar large" aria-hidden="true">${this.article.author.avatar}</div>

            <div>
              <p class="written-by">Written by</p>
              <h2>${this.article.author.name}</h2>
              <p>
                ${this.article.author.role} • ${this.article.author.articlesCount || 10} articles
              </p>
            </div>

            <div class="author-actions">
              <button class="secondary-button" type="button" id="author-footer-connect">
                Connect
              </button>

              <button class="primary-button" type="button" id="author-footer-subscribe">
                Subscribe
              </button>
            </div>
          </section>

          <!-- Interactive Comments & Discussion Section -->
          <div id="article-comments-container"></div>

        </div>
      </article>

      <!-- Container for polite engagement character -->
      <div id="engagement-character-container"></div>
    `;

    this.bindHeartEvents();
    this.bindAuthorActions();
    this.initEngagement();

    const commentsContainer = this.container.querySelector<HTMLElement>('#article-comments-container');
    if (commentsContainer) {
      const commentsSection = new CommentsSection(commentsContainer, this.article.id);
      commentsSection.render();
    }
  }

  
  private bindAuthorActions(): void {
    const quickConnect = this.container.querySelector<HTMLButtonElement>('#author-quick-connect');
    const footerConnect = this.container.querySelector<HTMLButtonElement>('#author-footer-connect');
    const footerSubscribe = this.container.querySelector<HTMLButtonElement>('#author-footer-subscribe');

    const updateStates = () => {
      const isConnected = isUserConnected(this.article.author.name);
      const isSubscribed = isUserSubscribed(this.article.author.name);

      if (quickConnect) {
        quickConnect.textContent = isConnected ? 'âœ“ Connected' : '+ Connect';
        quickConnect.classList.toggle('is-active', isConnected);
      }
      if (footerConnect) {
        footerConnect.textContent = isConnected ? 'âœ“ Connected' : 'Connect';
        footerConnect.classList.toggle('is-active', isConnected);
      }
      if (footerSubscribe) {
        footerSubscribe.textContent = isSubscribed ? 'âœ“ Subscribed' : 'Subscribe';
        footerSubscribe.classList.toggle('is-active', isSubscribed);
      }
    };

    updateStates();

    const handleConnectClick = () => {
      toggleConnect(this.article.author.name);
      updateStates();
    };

    quickConnect?.addEventListener('click', handleConnectClick);
    footerConnect?.addEventListener('click', handleConnectClick);

    footerSubscribe?.addEventListener('click', () => {
      toggleSubscribe(this.article.author.name);
      updateStates();
    });
  }

  private bindHeartEvents(): void {
    const heartButton = this.container.querySelector<HTMLButtonElement>('#heart-button');
    const heartCount = this.container.querySelector<HTMLElement>('#heart-count');
    const heartProgress = this.container.querySelector<HTMLElement>('#heart-progress');

    heartButton?.addEventListener('click', () => {
      if (this.heartsGiven >= this.MAX_HEARTS) {
        return;
      }

      this.heartsGiven++;
      ApiService.sendHeart(this.article.id);

      const fillPercentage = (this.heartsGiven / this.MAX_HEARTS) * 100;
      heartButton.style.setProperty('--heart-fill', `${fillPercentage}%`);

      // Reflow for CSS animation
      heartButton.classList.remove('heart-pulse');
      void heartButton.offsetWidth;
      heartButton.classList.add('heart-pulse');

      if (heartCount) {
        heartCount.textContent = (this.currentAppreciations + this.heartsGiven).toLocaleString();
      }

      if (heartProgress) {
        if (this.heartsGiven === this.MAX_HEARTS) {
          heartProgress.textContent = `You filled the heart! ❤️ (${this.MAX_HEARTS}/${this.MAX_HEARTS})`;
        } else {
          heartProgress.textContent = `${this.heartsGiven} / ${this.MAX_HEARTS} hearts sent ❤️`;
        }
      }
    });
  }

  private initEngagement(): void {
    const engagementContainer = this.container.querySelector<HTMLElement>(
      '#engagement-character-container',
    );
    if (!engagementContainer) return;

    // Configurable threshold via Vite environment variable
    const envSeconds = Number(import.meta.env.VITE_READING_THRESHOLD_SECONDS);
    const thresholdSeconds = !isNaN(envSeconds) && envSeconds > 0 ? envSeconds : 10;

    // Initialize polite engagement character
    this.character = new EngagementCharacter({
      container: engagementContainer,
      authorName: this.article.author.name,
      onConnect: () => {
        console.log(`[CompanyPulse] Connected with ${this.article.author.name}`);
      },
      onSubscribe: () => {
        console.log(`[CompanyPulse] Subscribed to ${this.article.author.name}`);
      },
    });

    // Initialize reading tracker
    this.tracker = new ReadingTracker({
      thresholdSeconds,
      onTick: (elapsed) => {
        console.log(`[CompanyPulse] Reading time for "${this.article.id}": ${elapsed}s / ${thresholdSeconds}s`);
      },
      onThresholdReached: () => {
        console.log(`[CompanyPulse] Reading threshold reached for "${this.article.id}"! Peeking character...`);
        this.character?.peek();
      },
    });

    this.tracker.start();
  }

  /**
   * Cleanup timer and listeners when navigating away
   */
  public destroy(): void {
    if (this.tracker) {
      this.tracker.destroy();
      this.tracker = null;
    }
  }
}
