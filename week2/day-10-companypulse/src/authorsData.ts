import type { Author, Article } from './types';
import { getAllArticles } from './articlesData';

const SEED_AUTHORS: Record<string, Author> = {
  'Alex Kumar': {
    name: 'Alex Kumar',
    role: 'Senior Frontend Engineer',
    department: 'Web Platforms & Tooling',
    avatar: 'AK',
    bio: 'Passionate about TypeScript, design systems, performance, and developer tooling. Tech lead on CompanyPulse internal initiatives.',
    articlesCount: 24,
    followersCount: 312,
  },
  'Maya Patel': {
    name: 'Maya Patel',
    role: 'Staff Infrastructure Engineer',
    department: 'Cloud & Developer Experience',
    avatar: 'MP',
    bio: 'Focusing on distributed build systems, Vite tooling, container performance, and developer velocity.',
    articlesCount: 12,
    followersCount: 245,
  },
  'David Chen': {
    name: 'David Chen',
    role: 'Engineering Manager',
    department: 'Product Engineering',
    avatar: 'DC',
    bio: 'Former backend IC turned engineering manager. Passionate about mentorship, team clarity, and pragmatic architectural trade-offs.',
    articlesCount: 19,
    followersCount: 420,
  },
  'Sarah Jenkins': {
    name: 'Sarah Jenkins',
    role: 'Principal Architect',
    department: 'Enterprise Architecture',
    avatar: 'SJ',
    bio: 'Leading our RFC and technical decision frameworks. Helping teams debate trade-offs early and build resilient distributed systems.',
    articlesCount: 31,
    followersCount: 580,
  },
  'Elena Rostova': {
    name: 'Elena Rostova',
    role: 'People Operations & Culture Lead',
    department: 'People & Organization',
    avatar: 'ER',
    bio: 'Championing inclusive mentorship, cross-team onboarding, psychological safety, and growth culture across all engineering hubs.',
    articlesCount: 8,
    followersCount: 195,
  },
};

export function getAuthorDetails(name: string): Author {
  // Direct match
  if (SEED_AUTHORS[name]) {
    return SEED_AUTHORS[name];
  }

  // Case-insensitive match
  const found = Object.values(SEED_AUTHORS).find(
    (a) => a.name.toLowerCase() === name.toLowerCase(),
  );
  if (found) {
    return found;
  }

  // Fallback for new authors
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'CP';

  return {
    name,
    role: 'Employee & Contributor',
    department: 'Engineering',
    avatar: initials,
    bio: `Active contributor to CompanyPulse internal knowledge base. Sharing lessons learned and engineering insights.`,
    articlesCount: 1,
    followersCount: 10,
  };
}

export function getAuthorArticles(authorName: string): Article[] {
  const all = getAllArticles();
  return all.filter((a) => a.author.name.toLowerCase() === authorName.toLowerCase());
}

/* ==========================================================================
   Follow / Connect / Subscribe State Persistence
   ========================================================================== */

function getFollowKey(type: 'connect' | 'subscribe', authorName: string): string {
  return `companypulse_${type}_${authorName.toLowerCase().replace(/\s+/g, '_')}`;
}

export function isUserConnected(authorName: string): boolean {
  return localStorage.getItem(getFollowKey('connect', authorName)) === 'true';
}

export function toggleConnect(authorName: string): boolean {
  const key = getFollowKey('connect', authorName);
  const next = localStorage.getItem(key) !== 'true';
  localStorage.setItem(key, String(next));
  return next;
}

export function isUserSubscribed(authorName: string): boolean {
  return localStorage.getItem(getFollowKey('subscribe', authorName)) === 'true';
}

export function toggleSubscribe(authorName: string): boolean {
  const key = getFollowKey('subscribe', authorName);
  const next = localStorage.getItem(key) !== 'true';
  localStorage.setItem(key, String(next));
  return next;
}
