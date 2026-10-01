/**
 * ReadingTracker
 * 
 * Tracks active reading time on an article page.
 * Distinguishes genuine reading from an inactive background tab
 * using the Page Visibility API (document.visibilityState).
 */

export interface ReadingTrackerConfig {
  thresholdSeconds: number;
  onThresholdReached: () => void;
  onTick?: (elapsedSeconds: number) => void;
}

export class ReadingTracker {
  private readonly thresholdSeconds: number;
  private readonly onThresholdReached: () => void;
  private readonly onTick?: (elapsedSeconds: number) => void;

  private elapsedSeconds = 0;
  private timerId: number | null = null;
  private isTriggered = false;

  constructor(config: ReadingTrackerConfig) {
    this.thresholdSeconds = config.thresholdSeconds;
    this.onThresholdReached = config.onThresholdReached;
    this.onTick = config.onTick;

    // Listen for tab switching to pause/resume tracking
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Start tracking active reading time
   */
  public start(): void {
    if (this.timerId !== null || this.isTriggered) {
      return;
    }

    this.timerId = window.setInterval(() => {
      // Only count active reading when tab is visible
      if (document.visibilityState === 'visible') {
        this.elapsedSeconds++;

        if (this.onTick) {
          this.onTick(this.elapsedSeconds);
        }

        if (this.elapsedSeconds >= this.thresholdSeconds) {
          this.isTriggered = true;
          this.stop();
          this.onThresholdReached();
        }
      }
    }, 1000);
  }

  /**
   * Pause or stop tracking
   */
  public stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Reset reading elapsed time
   */
  public reset(): void {
    this.stop();
    this.elapsedSeconds = 0;
    this.isTriggered = false;
  }

  /**
   * Cleanup event listeners when component unmounts
   */
  public destroy(): void {
    this.stop();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  public getElapsedSeconds(): number {
    return this.elapsedSeconds;
  }

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') {
      console.log('[ReadingTracker] Reader switched tabs - timer paused.');
    } else {
      console.log('[ReadingTracker] Reader returned - timer resumed.');
    }
  };
}
