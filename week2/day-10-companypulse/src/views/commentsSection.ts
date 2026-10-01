import type { ArticleComment } from '../types';
import { getCommentsForArticle, addCommentToArticle, toggleCommentLike } from '../commentsData';

export class CommentsSection {
  private container: HTMLElement;
  private articleId: string;
  private comments: ArticleComment[] = [];
  private replyTargetAuthor: string | null = null;

  constructor(container: HTMLElement, articleId: string) {
    this.container = container;
    this.articleId = articleId;
    this.comments = getCommentsForArticle(articleId);
  }

  public render(): void {
    this.container.className = 'comments-section';
    this.container.setAttribute('aria-label', 'Article discussion');

    this.container.innerHTML = `
      <div class="comments-container">
        
        <!-- Header -->
        <div class="comments-header">
          <h2 class="comments-title">
            <span class="comments-icon" aria-hidden="true">💬</span>
            Discussion
            <span class="comments-count-badge" id="comments-count">${this.comments.length}</span>
          </h2>
          <p class="comments-subtitle">
            Share context, ask technical questions, or give feedback to the author.
          </p>
        </div>

        <!-- Post Comment Form -->
        <form id="comment-form" class="comment-form" novalidate>
          <div class="comment-form-avatar" aria-hidden="true">AK</div>

          <div class="comment-form-body">
            ${
              this.replyTargetAuthor
                ? `
              <div class="reply-target-banner">
                <span>Replying to <strong>@${this.escapeHtml(this.replyTargetAuthor)}</strong></span>
                <button type="button" id="cancel-reply-btn" class="cancel-reply-btn" aria-label="Cancel reply">✕</button>
              </div>
            `
                : ''
            }

            <textarea
              id="comment-input"
              class="comment-textarea"
              rows="3"
              placeholder="What are your thoughts or questions on this article? Markdown or plain text..."
              required
              aria-label="Add a comment to the discussion"
            ></textarea>

            <div class="comment-form-actions">
              <span id="comment-error" class="comment-error-msg" role="alert"></span>
              <button type="submit" id="btn-post-comment" class="primary-button post-comment-btn">
                Post Comment
              </button>
            </div>
          </div>
        </form>

        <!-- Comments List -->
        <div id="comments-list" class="comments-list" role="feed" aria-label="Comments">
          ${this.renderCommentsListHtml()}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  private renderCommentsListHtml(): string {
    if (this.comments.length === 0) {
      return `
        <div class="comments-empty">
          <div class="empty-icon" aria-hidden="true">💭</div>
          <p class="empty-title">No comments yet</p>
          <p class="empty-desc">Be the first to start the discussion on this article!</p>
        </div>
      `;
    }

    return this.comments
      .map(
        (comment) => `
        <article class="comment-card" id="comment-${comment.id}" aria-label="Comment by ${this.escapeHtml(comment.authorName)}">
          <div class="comment-avatar" aria-hidden="true">${comment.authorAvatar}</div>

          <div class="comment-main">
            <div class="comment-header-row">
              <div class="comment-author-meta">
                <strong class="comment-author-name">${this.escapeHtml(comment.authorName)}</strong>
                <span class="comment-author-role">${this.escapeHtml(comment.authorRole)}</span>
              </div>
              <time class="comment-timestamp">${comment.timestamp}</time>
            </div>

            ${
              comment.replyToAuthor
                ? `
              <div class="comment-reply-indicator">
                ↳ In reply to <strong>@${this.escapeHtml(comment.replyToAuthor)}</strong>
              </div>
            `
                : ''
            }

            <p class="comment-content">${this.escapeHtml(comment.content).replace(/\n/g, '<br/>')}</p>

            <div class="comment-actions-row">
              <button
                type="button"
                class="comment-action-btn like-btn ${comment.likedByMe ? 'is-liked' : ''}"
                data-comment-id="${comment.id}"
                aria-label="${comment.likedByMe ? 'Unlike comment' : 'Like comment'}"
              >
                <span class="like-icon" aria-hidden="true">${comment.likedByMe ? '❤️' : '🤍'}</span>
                <span class="like-count">${comment.likes}</span>
              </button>

              <button
                type="button"
                class="comment-action-btn reply-btn"
                data-author="${this.escapeHtml(comment.authorName)}"
                aria-label="Reply to ${this.escapeHtml(comment.authorName)}"
              >
                ↩️ Reply
              </button>
            </div>
          </div>
        </article>
      `,
      )
      .join('');
  }

  private bindEvents(): void {
    const form = this.container.querySelector<HTMLFormElement>('#comment-form');
    const textarea = this.container.querySelector<HTMLTextAreaElement>('#comment-input');
    const cancelReplyBtn = this.container.querySelector<HTMLButtonElement>('#cancel-reply-btn');
    const listContainer = this.container.querySelector<HTMLElement>('#comments-list');

    // Cancel reply target
    cancelReplyBtn?.addEventListener('click', () => {
      this.replyTargetAuthor = null;
      this.render();
    });

    // Form submit
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const content = textarea?.value.trim() || '';
      const errorMsg = this.container.querySelector<HTMLElement>('#comment-error');

      if (!content) {
        if (errorMsg) errorMsg.textContent = 'Please enter a message before posting.';
        textarea?.focus();
        return;
      }

      if (errorMsg) errorMsg.textContent = '';

      const newComment: ArticleComment = {
        id: `comment-${Date.now()}`,
        articleId: this.articleId,
        authorName: 'Alex Kumar',
        authorRole: 'Senior Frontend Engineer',
        authorAvatar: 'AK',
        content,
        timestamp: 'Just now',
        likes: 0,
        likedByMe: false,
        replyToAuthor: this.replyTargetAuthor || undefined,
      };

      addCommentToArticle(newComment);
      this.comments = getCommentsForArticle(this.articleId);
      this.replyTargetAuthor = null;

      // Re-render
      this.render();
    });

    // Comments list event delegation (likes & replies)
    listContainer?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // Like button
      const likeBtn = target.closest<HTMLButtonElement>('.like-btn');
      if (likeBtn) {
        const commentId = likeBtn.dataset.commentId;
        if (commentId) {
          this.comments = toggleCommentLike(this.articleId, commentId);
          this.updateCommentsList();
        }
        return;
      }

      // Reply button
      const replyBtn = target.closest<HTMLButtonElement>('.reply-btn');
      if (replyBtn) {
        const author = replyBtn.dataset.author;
        if (author) {
          this.replyTargetAuthor = author;
          this.render();
          const input = this.container.querySelector<HTMLTextAreaElement>('#comment-input');
          input?.focus();
          input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  private updateCommentsList(): void {
    const list = this.container.querySelector<HTMLElement>('#comments-list');
    const badge = this.container.querySelector<HTMLElement>('#comments-count');
    if (list) {
      list.innerHTML = this.renderCommentsListHtml();
    }
    if (badge) {
      badge.textContent = `${this.comments.length}`;
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
