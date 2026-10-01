import type { ArticleComment } from './types';

const SEED_COMMENTS: Record<string, ArticleComment[]> = {
  'typescript-production': [
    {
      id: 'comment-1',
      articleId: 'typescript-production',
      authorName: 'Maya Patel',
      authorRole: 'Staff Infrastructure Engineer',
      authorAvatar: 'MP',
      timestamp: '2 hours ago',
      content:
        'Great write-up, Alex! Our infra team noticed a dramatic drop in runtime null-pointer exceptions after your team mandated strict null checks across the shared contracts.',
      likes: 8,
      likedByMe: false,
    },
    {
      id: 'comment-2',
      articleId: 'typescript-production',
      authorName: 'David Chen',
      authorRole: 'Engineering Manager',
      authorAvatar: 'DC',
      timestamp: '4 hours ago',
      content:
        'The point about not over-engineering early architecture is gold. Too many teams try to anticipate microservice boundaries before they even understand user workflows.',
      likes: 14,
      likedByMe: false,
    },
    {
      id: 'comment-3',
      articleId: 'typescript-production',
      authorName: 'Elena Rostova',
      authorRole: 'People Operations & Culture Lead',
      authorAvatar: 'ER',
      timestamp: 'Yesterday',
      content:
        'Sharing lessons learned like this publicly internally is exactly what makes our engineering culture transparent and safe for junior hires to ask questions.',
      likes: 5,
      likedByMe: false,
    },
  ],
  'vite-build-performance': [
    {
      id: 'comment-vite-1',
      articleId: 'vite-build-performance',
      authorName: 'Alex Kumar',
      authorRole: 'Senior Frontend Engineer',
      authorAvatar: 'AK',
      timestamp: '1 day ago',
      content:
        'Can confirm the cold-start improvement transformed our morning local dev routines. No more starting dev servers and walking away to grab coffee!',
      likes: 6,
      likedByMe: false,
    },
  ],
};

function getStorageKey(articleId: string): string {
  return `companypulse_comments_${articleId}`;
}

export function getCommentsForArticle(articleId: string): ArticleComment[] {
  try {
    const raw = localStorage.getItem(getStorageKey(articleId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read comments from localStorage', e);
  }

  // Fallback to seed comments if available
  return SEED_COMMENTS[articleId] || [];
}

export function addCommentToArticle(comment: ArticleComment): void {
  const existing = getCommentsForArticle(comment.articleId);
  const updated = [comment, ...existing];
  try {
    localStorage.setItem(getStorageKey(comment.articleId), JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save comment to localStorage', e);
  }
}

export function toggleCommentLike(articleId: string, commentId: string): ArticleComment[] {
  const existing = getCommentsForArticle(articleId);
  const updated = existing.map((c) => {
    if (c.id === commentId) {
      const isLiked = !c.likedByMe;
      return {
        ...c,
        likedByMe: isLiked,
        likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
      };
    }
    return c;
  });

  try {
    localStorage.setItem(getStorageKey(articleId), JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update comment like in localStorage', e);
  }

  return updated;
}
