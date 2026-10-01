import type { AppNotification } from './types';

const STORAGE_KEY = 'companypulse_notifications';

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'comment',
    title: 'New comment on your article',
    message: 'Maya Patel commented: "Great write-up, Alex! Our infra team noticed a dramatic drop in runtime null-pointer exceptions..."',
    timestamp: '15m ago',
    isRead: false,
    linkHash: '#article/typescript-production',
    actorAvatar: 'MP',
  },
  {
    id: 'notif-2',
    type: 'heart',
    title: 'Article Appreciation',
    message: 'David Chen sent 5 hearts on "What I Learned Building Our First Production-Ready TypeScript Application"',
    timestamp: '1h ago',
    isRead: false,
    linkHash: '#article/typescript-production',
    actorAvatar: 'DC',
  },
  {
    id: 'notif-3',
    type: 'subscribe',
    title: 'New Subscriber',
    message: 'Elena Rostova subscribed to your publications and lessons.',
    timestamp: '3h ago',
    isRead: false,
    linkHash: '#author/Elena Rostova',
    actorAvatar: 'ER',
  },
];

export function getNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read notifications from localStorage', e);
  }
  return SEED_NOTIFICATIONS;
}

export function saveNotifications(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications to localStorage', e);
  }
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.isRead).length;
}

export function markAllAsRead(): AppNotification[] {
  const updated = getNotifications().map((n) => ({ ...n, isRead: true }));
  saveNotifications(updated);
  return updated;
}

export function markAsRead(id: string): AppNotification[] {
  const updated = getNotifications().map((n) =>
    n.id === id ? { ...n, isRead: true } : n,
  );
  saveNotifications(updated);
  return updated;
}

export function addNotification(notification: AppNotification): AppNotification[] {
  const existing = getNotifications();
  const updated = [notification, ...existing];
  saveNotifications(updated);
  return updated;
}
