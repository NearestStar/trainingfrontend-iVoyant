/**
 * EngagementCharacter
 * 
 * Manages the polite, two-stage peeking character.
 * Follows the core UX principle:
 * Ask -> respect the answer -> continue only with explicit permission.
 */

export type EngagementState =
  | 'hidden'
  | 'asking'
  | 'accepted'
  | 'declined'
  | 'dismissed';

export interface EngagementCharacterOptions {
  container: HTMLElement;
  authorName?: string;
  onConnect?: () => void;
  onSubscribe?: () => void;
}

export class EngagementCharacter {
  private container: HTMLElement;
  private authorName: string;
  private state: EngagementState = 'hidden';
  private onConnect?: () => void;
  private onSubscribe?: () => void;

  constructor(options: EngagementCharacterOptions) {
    this.container = options.container;
    this.authorName = options.authorName || 'Alex';
    this.onConnect = options.onConnect;
    this.onSubscribe = options.onSubscribe;

    this.render();
    this.bindEvents();
  }

  /**
   * Initial trigger: Character gently peeks from the screen edge
   */
  public peek(): void {
    if (this.state !== 'hidden') {
      return;
    }

    this.setState('asking');
  }

  /**
   * Dismiss the character completely
   */
  public dismiss(): void {
    this.setState('dismissed');
  }

  public getState(): EngagementState {
    return this.state;
  }

  private setState(newState: EngagementState): void {
    this.state = newState;
    this.updateUI();
  }

  private render(): void {
    this.container.className = 'engagement-character is-hidden';
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Reading engagement assistant');

    this.container.innerHTML = `
      <div class="character-avatar" aria-hidden="true">
        <div class="character-body">
          <div class="character-eyes">
            <span class="eye left-eye"></span>
            <span class="eye right-eye"></span>
          </div>
          <div class="character-smile"></div>
          <div class="character-hand">👋</div>
        </div>
      </div>

      <div class="speech-bubble" id="engagement-bubble">
        <button
          id="close-bubble"
          class="close-bubble-button"
          type="button"
          aria-label="Close message"
        >
          ✕
        </button>

        <div class="bubble-content" id="bubble-content">
          <!-- Dynamic content based on current stage -->
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    // Event delegation on the container
    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      // Close (X) button
      if (target.closest('#close-bubble')) {
        this.dismiss();
        return;
      }

      // Stage 1: "Sure" -> accepted
      if (target.closest('#btn-ask-sure')) {
        this.setState('accepted');
        return;
      }

      // Stage 1: "Not now" -> polite decline
      if (target.closest('#btn-ask-decline')) {
        this.setState('declined');
        return;
      }

      // Stage 2: "Connect"
      if (target.closest('#btn-connect-author')) {
        this.handleConnect();
        return;
      }

      // Stage 2: "Subscribe"
      if (target.closest('#btn-subscribe-author')) {
        this.handleSubscribe();
        return;
      }
    });
  }

  private updateUI(): void {
    const bubbleContent = this.container.querySelector<HTMLElement>('#bubble-content');
    if (!bubbleContent) return;

    // Reset base state classes
    this.container.classList.remove('is-hidden', 'is-peeking', 'is-expanded', 'is-exiting');

    switch (this.state) {
      case 'hidden':
        this.container.classList.add('is-hidden');
        break;

      case 'asking':
        // Stage 1: Gentle peek from side
        this.container.classList.add('is-peeking');
        bubbleContent.innerHTML = `
          <p class="bubble-title">Hey! 👋</p>
          <p class="bubble-text">Can I have a moment?</p>
          <div class="bubble-actions">
            <button id="btn-ask-sure" class="bubble-btn primary-bubble-btn" type="button">
              Sure
            </button>
            <button id="btn-ask-decline" class="bubble-btn secondary-bubble-btn" type="button">
              Not now
            </button>
          </div>
        `;
        break;

      case 'accepted':
        // Stage 2: Slides in slightly more, asks about connecting
        this.container.classList.add('is-expanded');
        bubbleContent.innerHTML = `
          <p class="bubble-title">Thank you! 😊</p>
          <p class="bubble-text">Would you like to stay connected with ${this.authorName}?</p>
          <div class="bubble-actions">
            <button id="btn-connect-author" class="bubble-btn secondary-bubble-btn" type="button">
              Connect with ${this.authorName}
            </button>
            <button id="btn-subscribe-author" class="bubble-btn primary-bubble-btn" type="button">
              Subscribe
            </button>
          </div>
        `;
        break;

      case 'declined':
        // Polite exit message
        this.container.classList.add('is-peeking');
        bubbleContent.innerHTML = `
          <p class="bubble-title">Of course! 😊</p>
          <p class="bubble-text">Enjoy the rest of the article!</p>
        `;

        // Automatically slide away gracefully after 2.5 seconds
        window.setTimeout(() => {
          this.dismiss();
        }, 2500);
        break;

      case 'dismissed':
        // Smooth slide-out
        this.container.classList.add('is-exiting');
        window.setTimeout(() => {
          this.container.classList.add('is-hidden');
          this.container.classList.remove('is-exiting');
        }, 600);
        break;
    }
  }

  private handleConnect(): void {
    const bubbleContent = this.container.querySelector<HTMLElement>('#bubble-content');
    if (bubbleContent) {
      bubbleContent.innerHTML = `
        <p class="bubble-title">Connected! 🎉</p>
        <p class="bubble-text">You are now connected with ${this.authorName}.</p>
      `;
    }

    if (this.onConnect) {
      this.onConnect();
    }

    window.setTimeout(() => this.dismiss(), 2000);
  }

  private handleSubscribe(): void {
    const bubbleContent = this.container.querySelector<HTMLElement>('#bubble-content');
    if (bubbleContent) {
      bubbleContent.innerHTML = `
        <p class="bubble-title">Subscribed! 📬</p>
        <p class="bubble-text">You will receive new articles from ${this.authorName}.</p>
      `;
    }

    if (this.onSubscribe) {
      this.onSubscribe();
    }

    window.setTimeout(() => this.dismiss(), 2000);
  }
}
