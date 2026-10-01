import './style.css';
import { parseRoute, navigateTo } from './router';
import { HomeView } from './views/homeView';
import { ArticleView } from './views/articleView';
import { CreateArticleView } from './views/createArticleView';
import { AuthorProfileView } from './views/authorProfileView';
import { NotificationCenter } from './components/notificationCenter';

// Render the application shell
const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = `
    <header class="site-header">
      <div class="container header-content">
        <a href="#home" class="logo" aria-label="CompanyPulse Home">Company<span>Pulse</span></a>

        <nav class="main-nav" aria-label="Main navigation">
          <a href="#home" id="nav-home" class="nav-link">Home</a>
          <a href="#article/typescript-production" id="nav-featured" class="nav-link">Featured</a>
          <a href="#create" id="nav-write" class="nav-link">Write</a>
        </nav>

        <div class="header-actions">
          <a href="#create" class="header-write-btn" aria-label="Write an article">
            ✍️ Write
          </a>
          <button class="icon-button" type="button" id="header-search-btn" aria-label="Search articles">
            🔍
          </button>
          
          <!-- In-Browser Notification Center -->
          <div id="header-notif-container"></div>

          <a href="#author/Alex Kumar" class="profile-button-link" aria-label="Alex Kumar Profile">
            <span class="profile-button">AK</span>
          </a>
        </div>
      </div>
    </header>

    <main id="app-main"></main>
  `;

  // Mount Notification Center
  const notifContainer = document.querySelector<HTMLElement>('#header-notif-container');
  if (notifContainer) {
    new NotificationCenter(notifContainer);
  }
}

const mainContainer = document.querySelector<HTMLElement>('#app-main')!;
let currentArticleView: ArticleView | null = null;

function renderCurrentRoute(): void {
  // Clean up any ongoing timers from previous article view
  if (currentArticleView) {
    currentArticleView.destroy();
    currentArticleView = null;
  }

  const route = parseRoute();

  // Update navigation active states
  const navHome = document.querySelector('#nav-home');
  const navFeatured = document.querySelector('#nav-featured');
  const navWrite = document.querySelector('#nav-write');

  navHome?.classList.toggle('is-active', route.view === 'home');
  navFeatured?.classList.toggle(
    'is-active',
    route.view === 'article' && route.articleId === 'typescript-production',
  );
  navWrite?.classList.toggle('is-active', route.view === 'create');

  if (route.view === 'create') {
    const createView = new CreateArticleView(mainContainer);
    createView.render();
  } else if (route.view === 'author') {
    const authorView = new AuthorProfileView(mainContainer, route.authorName || 'Alex Kumar');
    authorView.render();
  } else if (route.view === 'article') {
    currentArticleView = new ArticleView(mainContainer, route.articleId);
    currentArticleView.render();
  } else {
    const homeView = new HomeView(mainContainer);
    homeView.render();
  }

  // Ensure scroll is at top upon view transition
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Global search button clicks navigate to home and focus the search box
document.querySelector('#header-search-btn')?.addEventListener('click', () => {
  navigateTo('#home');
  window.setTimeout(() => {
    const searchInput = document.querySelector<HTMLInputElement>('#article-search-input');
    searchInput?.focus();
  }, 100);
});

// Listen to browser navigation & initial load
window.addEventListener('hashchange', renderCurrentRoute);
renderCurrentRoute();
