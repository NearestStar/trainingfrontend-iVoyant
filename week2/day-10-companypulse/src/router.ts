export interface Route {
  view: 'home' | 'article' | 'create' | 'author';
  articleId?: string;
  authorName?: string;
}

export function parseRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '').trim() || 'home';

  if (hash === 'create') {
    return { view: 'create' };
  }

  if (hash.startsWith('author')) {
    const parts = hash.split('/');
    const name = parts.slice(1).join('/');
    return {
      view: 'author',
      authorName: decodeURIComponent(name) || 'Alex Kumar',
    };
  }

  if (hash.startsWith('article')) {
    const parts = hash.split('/');
    return {
      view: 'article',
      articleId: parts[1] || undefined,
    };
  }

  return { view: 'home' };
}

export function navigateTo(hash: string): void {
  window.location.hash = hash;
}
