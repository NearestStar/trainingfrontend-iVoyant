import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from '../notificationsData';
import { navigateTo } from '../router';

export class NotificationCenter {
  private container: HTMLElement;
  private isOpen = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.bindEvents();
  }

  public render(): void {
    const unreadCount = getUnreadCount();

    this.container.className = 'notification-center-wrapper';
    this.container.innerHTML = `
      <button
        id="notif-toggle-btn"
        class="icon-button notif-bell-btn ${unreadCount > 0 ? 'has-unread' : ''}"
        type="button"
        aria-label="View notifications (${unreadCount} unread)"
        aria-expanded="${this.isOpen}"
        aria-haspopup="true"
      >
        <span class="bell-icon" aria-hidden="true">🔔</span>
        ${
          unreadCount > 0
            ? `<span id="notif-badge" class="notif-badge">${unreadCount}</span>`
            : ''
        }
      </button>

      <div
        id="notif-popover"
        class="notif-popover ${this.isOpen ? 'is-open' : ''}"
        role="region"
        aria-label="Notifications list"
      >
        <div class="notif-header">
          <div class="notif-title-row">
            <strong>Notifications</strong>
            ${
              unreadCount > 0
                ? `<span class="notif-unread-chip">${unreadCount} new</span>`
                : ''
            }
          </div>

          <button type="button" id="notif-mark-all-read" class="notif-text-btn">
            Mark all as read
          </button>
        </div>

        <div class="notif-list" id="notif-list-items" role="feed">
          ${this.renderListItemsHtml()}
        </div>
      </div>
    `;
  }

  private renderListItemsHtml(): string {
    const notifications = getNotifications();

    if (notifications.length === 0) {
      return `
        <div class="notif-empty">
          <p class="notif-empty-text">No notifications yet 🔕</p>
        </div>
      `;
    }

    return notifications
      .map(
        (notif) => `
        <div
          class="notif-item ${!notif.isRead ? 'is-unread' : ''}"
          data-id="${notif.id}"
          data-link="${notif.linkHash}"
          role="button"
          tabindex="0"
          aria-label="${notif.title}"
        >
          <div class="notif-item-avatar" aria-hidden="true">${notif.actorAvatar}</div>

          <div class="notif-item-content">
            <div class="notif-item-meta">
              <span class="notif-item-title">${this.escapeHtml(notif.title)}</span>
              <time class="notif-item-time">${notif.timestamp}</time>
            </div>
            <p class="notif-item-msg">${this.escapeHtml(notif.message)}</p>
          </div>

          ${!notif.isRead ? '<span class="notif-unread-dot" aria-hidden="true"></span>' : ''}
        </div>
      `,
      )
      .join('');
  }

  private bindEvents(): void {
    // Toggle popover button
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // Bell toggle
      if (target.closest('#notif-toggle-btn')) {
        this.isOpen = !this.isOpen;
        this.updatePopoverState();
        return;
      }

      // Mark all as read
      if (target.closest('#notif-mark-all-read')) {
        markAllAsRead();
        this.render();
        this.isOpen = true; // keep open to view cleared state
        this.updatePopoverState();
        return;
      }

      // Click on notification item
      const item = target.closest<HTMLElement>('.notif-item');
      if (item) {
        const id = item.dataset.id;
        const link = item.dataset.link;
        if (id) {
          markAsRead(id);
        }
        this.isOpen = false;
        this.updatePopoverState();
        if (link) {
          navigateTo(link);
        }
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.container.contains(e.target as Node)) {
        this.isOpen = false;
        this.updatePopoverState();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.isOpen = false;
        this.updatePopoverState();
        const toggleBtn = this.container.querySelector<HTMLButtonElement>('#notif-toggle-btn');
        toggleBtn?.focus();
      }
    });
  }

  private updatePopoverState(): void {
    const popover = this.container.querySelector<HTMLElement>('#notif-popover');
    const toggleBtn = this.container.querySelector<HTMLButtonElement>('#notif-toggle-btn');

    if (popover && toggleBtn) {
      popover.classList.toggle('is-open', this.isOpen);
      toggleBtn.setAttribute('aria-expanded', String(this.isOpen));
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
