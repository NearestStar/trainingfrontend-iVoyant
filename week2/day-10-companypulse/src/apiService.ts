import type { Article, ArticleComment } from './types';
import { getAllArticles, saveNewArticle } from './articlesData';
import { getCommentsForArticle, addCommentToArticle } from './commentsData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

console.log(`[CompanyPulse] API Service configured with base URL: ${API_BASE}`);

export class ApiService {
  /**
   * Check if backend API is online
   */
  public static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Fetch all articles (with fallback to local storage)
   */
  public static async getArticles(category?: string, search?: string): Promise<Article[]> {
    try {
      const url = new URL(`${API_BASE}/api/articles`);
      if (category && category !== 'All') url.searchParams.set('category', category);
      if (search) url.searchParams.set('search', search);

      const res = await fetch(url.toString());
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[ApiService] Backend API unreachable. Using local storage fallback.', e);
    }

    // Fallback to local storage
    return getAllArticles().filter((article) => {
      const matchesCategory = !category || category === 'All' || article.category === category;
      const q = (search || '').trim().toLowerCase();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.intro.toLowerCase().includes(q) ||
        article.author.name.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }

  /**
   * Fetch single article by ID
   */
  public static async getArticleById(id: string): Promise<Article | null> {
    try {
      const res = await fetch(`${API_BASE}/api/articles/${encodeURIComponent(id)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const all = getAllArticles();
    return all.find((a) => a.id === id) || null;
  }

  /**
   * Publish a new article
   */
  public static async publishArticle(newArticle: Article): Promise<Article> {
    try {
      const res = await fetch(`${API_BASE}/api/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });

      if (res.ok) {
        const created = await res.json();
        saveNewArticle(created); // Sync locally too
        return created;
      }
    } catch (e) {
      console.warn('[ApiService] Server offline. Saved article locally.', e);
    }

    saveNewArticle(newArticle);
    return newArticle;
  }

  /**
   * Increment article heart appreciations
   */
  public static async sendHeart(articleId: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/api/articles/${encodeURIComponent(articleId)}/hearts`, {
        method: 'POST',
      });
    } catch {
      // Offline fallback: handled by local counter
    }
  }

  /**
   * Fetch comments for article
   */
  public static async getComments(articleId: string): Promise<ArticleComment[]> {
    try {
      const res = await fetch(`${API_BASE}/api/articles/${encodeURIComponent(articleId)}/comments`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return getCommentsForArticle(articleId);
  }

  /**
   * Post a new comment
   */
  public static async postComment(comment: ArticleComment): Promise<ArticleComment> {
    try {
      const res = await fetch(`${API_BASE}/api/articles/${encodeURIComponent(comment.articleId)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });

      if (res.ok) {
        const created = await res.json();
        addCommentToArticle(created); // Sync locally
        return created;
      }
    } catch (e) {
      console.warn('[ApiService] Server offline. Saved comment locally.', e);
    }

    addCommentToArticle(comment);
    return comment;
  }
}
