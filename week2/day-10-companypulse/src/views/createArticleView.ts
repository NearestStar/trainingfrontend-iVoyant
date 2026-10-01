import { ApiService } from '../apiService';
import type { Article, Category } from '../types';
import { saveNewArticle, refreshArticles } from '../articlesData';
import { navigateTo } from '../router';

const DRAFT_STORAGE_KEY = 'companypulse_article_draft';

const CATEGORIES: Category[] = [
  'Engineering',
  'Technology',
  'Leadership',
  'Productivity',
  'Career',
  'HR & Culture',
];

export class CreateArticleView {
  private container: HTMLElement;
  private isPreviewMode = false;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(): void {
    const savedDraft = this.getSavedDraft();

    this.container.innerHTML = `
      <section class="create-article-page">
        <div class="container create-container">
          
          <div class="article-navigation">
            <a href="#home" class="back-nav-link" aria-label="Back to all articles">
              ← Cancel and back to articles
            </a>
          </div>

          <div class="create-header">
            <span class="create-badge">New Publication</span>
            <h1 class="create-title">Publish Knowledge & Lessons</h1>
            <p class="create-subtitle">
              Share an engineering breakdown, architectural decision, lesson learned, or team story with coworkers.
            </p>
          </div>

          <form id="create-article-form" class="create-form" novalidate>
            
            <!-- Title Field -->
            <div class="form-group">
              <label for="form-title" class="form-label">
                Article Title <span class="required-star">*</span>
              </label>
              <input
                type="text"
                id="form-title"
                name="title"
                class="form-input form-input-title"
                placeholder="e.g. Scaling Our WebSocket Architecture for 50,000 Concurrent Users"
                value="${savedDraft.title || ''}"
                required
              />
              <span id="title-error" class="field-error" role="alert"></span>
            </div>

            <!-- Category & Read Time Row -->
            <div class="form-row">
              <div class="form-group flex-1">
                <label for="form-category" class="form-label">
                  Category <span class="required-star">*</span>
                </label>
                <select id="form-category" name="category" class="form-select">
                  ${CATEGORIES.map(
                    (cat) => `
                    <option value="${cat}" ${savedDraft.category === cat ? 'selected' : ''}>
                      ${cat}
                    </option>
                  `,
                  ).join('')}
                </select>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">
                  Estimated Read Time
                </label>
                <div id="read-time-indicator" class="read-time-pill" aria-live="polite">
                  ⏱️ 1 min read (0 words)
                </div>
              </div>
            </div>

            <!-- Tags Field -->
            <div class="form-group">
              <label for="form-tags" class="form-label">
                Tags <span class="form-hint">(comma separated)</span>
              </label>
              <input
                type="text"
                id="form-tags"
                name="tags"
                class="form-input"
                placeholder="e.g. WebSockets, Architecture, Node.js"
                value="${savedDraft.tags || ''}"
              />
              <div id="tags-preview" class="tags-preview-list"></div>
            </div>

            <!-- Intro / Excerpt -->
            <div class="form-group">
              <label for="form-intro" class="form-label">
                Short Intro / Overview <span class="required-star">*</span>
                <span class="form-hint">(appears on cards and article top)</span>
              </label>
              <textarea
                id="form-intro"
                name="intro"
                class="form-textarea form-textarea-intro"
                rows="2"
                placeholder="A concise 1-2 sentence preview to help teammates discover your post..."
                required
              >${savedDraft.intro || ''}</textarea>
              <span id="intro-error" class="field-error" role="alert"></span>
            </div>

            <!-- Content Area with Edit / Preview Tabs -->
            <div class="form-group">
              <div class="editor-header">
                <label for="form-content" class="form-label" style="margin: 0;">
                  Article Content <span class="required-star">*</span>
                </label>
                
                <div class="editor-tabs" role="tablist">
                  <button
                    type="button"
                    id="tab-edit"
                    class="editor-tab ${!this.isPreviewMode ? 'is-active' : ''}"
                    role="tab"
                    aria-selected="${!this.isPreviewMode}"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    id="tab-preview"
                    class="editor-tab ${this.isPreviewMode ? 'is-active' : ''}"
                    role="tab"
                    aria-selected="${this.isPreviewMode}"
                  >
                    👁️ Preview
                  </button>
                </div>
              </div>

              <div id="editor-edit-pane" class="${this.isPreviewMode ? 'is-hidden' : ''}">
                <textarea
                  id="form-content"
                  name="content"
                  class="form-textarea form-textarea-body"
                  rows="12"
                  placeholder="Share your technical insights, lessons learned, and examples here. Separate paragraphs with a blank line. You can use ## for section headings and > for quotes."
                  required
                >${savedDraft.content || ''}</textarea>
              </div>

              <div id="editor-preview-pane" class="editor-preview-box ${!this.isPreviewMode ? 'is-hidden' : ''}">
                <!-- Rendered preview will appear here -->
              </div>

              <span id="content-error" class="field-error" role="alert"></span>
            </div>

            <!-- Form Actions -->
            <div class="form-actions-bar">
              <button type="button" id="btn-save-draft" class="secondary-button">
                💾 Save Draft
              </button>

              <div class="actions-right">
                <a href="#home" class="cancel-link">Cancel</a>
                <button type="submit" id="btn-publish" class="primary-button publish-btn">
                  🚀 Publish Article
                </button>
              </div>
            </div>

            <div id="form-toast" class="form-toast" role="status" aria-live="polite"></div>

          </form>

        </div>
      </section>
    `;

    this.bindEvents();
    this.updateReadTime();
    this.updateTagsPreview();
  }

  private bindEvents(): void {
    const form = this.container.querySelector<HTMLFormElement>('#create-article-form');
    const contentTextarea = this.container.querySelector<HTMLTextAreaElement>('#form-content');
    const tagsInput = this.container.querySelector<HTMLInputElement>('#form-tags');
    const tabEdit = this.container.querySelector<HTMLButtonElement>('#tab-edit');
    const tabPreview = this.container.querySelector<HTMLButtonElement>('#tab-preview');
    const btnDraft = this.container.querySelector<HTMLButtonElement>('#btn-save-draft');

    // Read time calculator on content typing
    contentTextarea?.addEventListener('input', () => {
      this.updateReadTime();
    });

    // Dynamic tags preview on tags typing
    tagsInput?.addEventListener('input', () => {
      this.updateTagsPreview();
    });

    // Edit tab
    tabEdit?.addEventListener('click', () => {
      this.isPreviewMode = false;
      this.toggleEditorPanes();
    });

    // Preview tab
    tabPreview?.addEventListener('click', () => {
      this.isPreviewMode = true;
      this.toggleEditorPanes();
      this.renderPreviewContent();
    });

    // Save draft
    btnDraft?.addEventListener('click', () => {
      this.saveDraftToStorage();
      this.showToast('Draft saved locally! 💾');
    });

    // Form submission / publishing
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePublish();
    });
  }

  private toggleEditorPanes(): void {
    const editPane = this.container.querySelector('#editor-edit-pane');
    const previewPane = this.container.querySelector('#editor-preview-pane');
    const tabEdit = this.container.querySelector('#tab-edit');
    const tabPreview = this.container.querySelector('#tab-preview');

    if (this.isPreviewMode) {
      editPane?.classList.add('is-hidden');
      previewPane?.classList.remove('is-hidden');
      tabEdit?.classList.remove('is-active');
      tabPreview?.classList.add('is-active');
    } else {
      editPane?.classList.remove('is-hidden');
      previewPane?.classList.add('is-hidden');
      tabEdit?.classList.add('is-active');
      tabPreview?.classList.remove('is-active');
    }
  }

  private renderPreviewContent(): void {
    const contentTextarea = this.container.querySelector<HTMLTextAreaElement>('#form-content');
    const previewPane = this.container.querySelector('#editor-preview-pane');
    if (!previewPane) return;

    const raw = contentTextarea?.value.trim() || '';
    if (!raw) {
      previewPane.innerHTML = `<p class="preview-empty">Start typing your content in the Edit tab to see a live preview here...</p>`;
      return;
    }

    // Convert simple text format to HTML
    previewPane.innerHTML = this.formatContentToHtml(raw);
  }

  private formatContentToHtml(raw: string): string {
    const paragraphs = raw.split(/\n\s*\n/);
    return paragraphs
      .map((para) => {
        const trimmed = para.trim();
        if (trimmed.startsWith('## ')) {
          return `<h2>${this.escapeHtml(trimmed.slice(3))}</h2>`;
        }
        if (trimmed.startsWith('> ')) {
          return `<blockquote>${this.escapeHtml(trimmed.slice(2))}</blockquote>`;
        }
        return `<p>${this.escapeHtml(trimmed).replace(/\n/g, '<br/>')}</p>`;
      })
      .join('\n');
  }

  private updateReadTime(): void {
    const content = this.container.querySelector<HTMLTextAreaElement>('#form-content')?.value || '';
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    const indicator = this.container.querySelector('#read-time-indicator');
    if (indicator) {
      indicator.textContent = `⏱️ ${minutes} min read (${words} words)`;
    }
  }

  private updateTagsPreview(): void {
    const tagsInput = this.container.querySelector<HTMLInputElement>('#form-tags');
    const previewList = this.container.querySelector('#tags-preview');
    if (!tagsInput || !previewList) return;

    const tags = tagsInput.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (tags.length === 0) {
      previewList.innerHTML = '';
      return;
    }

    previewList.innerHTML = tags
      .map((tag) => `<span class="tag-badge">#${this.escapeHtml(tag)}</span>`)
      .join(' ');
  }

  private handlePublish(): void {
    const titleInput = this.container.querySelector<HTMLInputElement>('#form-title');
    const categorySelect = this.container.querySelector<HTMLSelectElement>('#form-category');
    const tagsInput = this.container.querySelector<HTMLInputElement>('#form-tags');
    const introTextarea = this.container.querySelector<HTMLTextAreaElement>('#form-intro');
    const contentTextarea = this.container.querySelector<HTMLTextAreaElement>('#form-content');

    const title = titleInput?.value.trim() || '';
    const category = (categorySelect?.value as Category) || 'Engineering';
    const intro = introTextarea?.value.trim() || '';
    const content = contentTextarea?.value.trim() || '';
    const rawTags = tagsInput?.value || '';

    // Validation
    let hasError = false;

    if (!title) {
      this.setError('#title-error', 'Please enter a title for your article.');
      hasError = true;
    } else {
      this.clearError('#title-error');
    }

    if (!intro) {
      this.setError('#intro-error', 'Please provide a short 1-2 sentence overview.');
      hasError = true;
    } else {
      this.clearError('#intro-error');
    }

    if (!content) {
      this.setError('#content-error', 'Please provide content for your article.');
      hasError = true;
    } else {
      this.clearError('#content-error');
    }

    if (hasError) {
      return;
    }

    // Calculate reading time
    const words = content.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    const readTime = `${minutes} min read`;

    // Process tags
    const tags = rawTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Generate slug ID
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `article-${Date.now()}`;

    const newArticle: Article = {
      id: slug,
      title,
      intro,
      category,
      tags: tags.length > 0 ? tags : ['Engineering', 'Insights'],
      readTime,
      publishedDate: 'Just now',
      appreciations: 0,
      author: {
        name: 'Alex Kumar',
        role: 'Senior Frontend Engineer',
        avatar: 'AK',
        articlesCount: 25,
      },
      contentHtml: this.formatContentToHtml(content),
    };

    // Save and refresh global articles
    saveNewArticle(newArticle);
    ApiService.publishArticle(newArticle);
    refreshArticles();

    // Clear draft
    localStorage.removeItem(DRAFT_STORAGE_KEY);

    this.showToast('Article published successfully! 🎉 Redirecting...');

    // Navigate to new article after brief confirmation
    window.setTimeout(() => {
      navigateTo(`#article/${newArticle.id}`);
    }, 700);
  }

  private setError(selector: string, message: string): void {
    const el = this.container.querySelector(selector);
    if (el) el.textContent = message;
  }

  private clearError(selector: string): void {
    const el = this.container.querySelector(selector);
    if (el) el.textContent = '';
  }

  private showToast(message: string): void {
    const toast = this.container.querySelector<HTMLElement>('#form-toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('is-visible');
      window.setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 3000);
    }
  }

  private saveDraftToStorage(): void {
    const title = this.container.querySelector<HTMLInputElement>('#form-title')?.value || '';
    const category = this.container.querySelector<HTMLSelectElement>('#form-category')?.value || 'Engineering';
    const tags = this.container.querySelector<HTMLInputElement>('#form-tags')?.value || '';
    const intro = this.container.querySelector<HTMLTextAreaElement>('#form-intro')?.value || '';
    const content = this.container.querySelector<HTMLTextAreaElement>('#form-content')?.value || '';

    const draft = { title, category, tags, intro, content };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }

  private getSavedDraft(): { title?: string; category?: string; tags?: string; intro?: string; content?: string } {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return {};
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
