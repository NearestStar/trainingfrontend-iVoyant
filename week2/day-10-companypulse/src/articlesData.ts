import type { Article } from './types';

const STORAGE_KEY = 'companypulse_custom_articles';

export const SEED_ARTICLES: Article[] = [
  {
    id: 'typescript-production',
    title: 'What I Learned Building Our First Production-Ready TypeScript Application',
    intro: 'A practical look at the lessons, mistakes, and decisions that helped our team build better frontend applications.',
    category: 'Engineering',
    tags: ['TypeScript', 'Architecture', 'Best Practices'],
    readTime: '10 min read',
    publishedDate: 'Sep 28, 2026',
    appreciations: 1248,
    author: {
      name: 'Alex Kumar',
      role: 'Senior Frontend Engineer',
      avatar: 'AK',
      articlesCount: 24,
    },
    contentHtml: `
      <p>
        Building software inside a company is rarely just about writing
        code. Every project brings decisions about architecture,
        collaboration, maintainability, and the experience we create
        for the people who use our products.
      </p>
      <p>
        When our team started working on a larger TypeScript project,
        we quickly discovered that writing code was only one part of
        the challenge. We also needed a consistent development
        environment and clear conventions.
      </p>
      <h2>Why TypeScript changed our workflow</h2>
      <p>
        TypeScript gave us a way to catch many problems before our
        application reached the browser. More importantly, it helped
        developers understand the shape of data while working on
        different parts of the application.
      </p>
      <blockquote>
        Good development practices are not about writing more code.
        They are about making the right code easier to understand.
      </blockquote>
      <p>
        The biggest improvement was not a single feature. It was the
        confidence the team gained from having better tooling,
        predictable project structure, and clearer communication.
      </p>
      <h2>What I would do differently</h2>
      <p>
        Looking back, we spent too much time trying to solve problems
        before they actually existed. A simpler starting point would
        have allowed us to learn faster and adapt our architecture
        as the product grew.
      </p>
      <p>
        That experience changed how I approach new projects today.
        Start simple, measure what matters, and improve the system
        when there is a real reason to do so.
      </p>
    `,
  },
  {
    id: 'vite-build-performance',
    title: 'How We Reduced Frontend Build Times by 64% with Vite',
    intro: 'A deep dive into our build tooling migration, caching strategies, and how we streamlined our local developer experience.',
    category: 'Technology',
    tags: ['Vite', 'Build Tools', 'Performance'],
    readTime: '6 min read',
    publishedDate: 'Sep 25, 2026',
    appreciations: 892,
    author: {
      name: 'Maya Patel',
      role: 'Staff Infrastructure Engineer',
      avatar: 'MP',
      articlesCount: 12,
    },
    contentHtml: `
      <p>
        Developer feedback loops directly dictate engineering velocity.
        When our team survey revealed that engineers waited up to 45 seconds
        for cold server starts, we knew our bundler setup needed attention.
      </p>
      <h2>The Shift to Native ES Modules</h2>
      <p>
        By leveraging native browser ES modules during development, Vite avoids
        bundling the entire application on every change. Only modified modules
        are invalidated and transformed.
      </p>
      <blockquote>
        Fast local tooling transforms daily engineering momentum. Minutes saved
        on rebuilds compound across thousands of developer hours annually.
      </blockquote>
      <h2>Measurable Wins</h2>
      <p>
        Our cold start dropped from 38 seconds to under 400 milliseconds. Hot module
        replacement is now nearly instantaneous, keeping developers in a continuous flow state.
      </p>
    `,
  },
  {
    id: 'ic-to-tech-lead',
    title: 'Transitioning from Individual Contributor to Tech Lead: 5 Lessons',
    intro: 'Key mental shifts required when your primary metric moves from code output to team enablement and system stability.',
    category: 'Career',
    tags: ['Leadership', 'Mentorship', 'Career Growth'],
    readTime: '8 min read',
    publishedDate: 'Sep 21, 2026',
    appreciations: 1420,
    author: {
      name: 'David Chen',
      role: 'Engineering Manager',
      avatar: 'DC',
      articlesCount: 19,
    },
    contentHtml: `
      <p>
        The hardest part of stepping into a lead role is overcoming the instinct
        that productivity means writing pull requests. In reality, leadership
        is about creating clarity and removing roadblocks for others.
      </p>
      <h2>Lesson 1: Clarity Trumps Speed</h2>
      <p>
        Unclear requirements cause tenfold more wasted effort than slow typing.
        Spending 30 minutes aligning on acceptance criteria saves entire sprint cycles.
      </p>
      <h2>Lesson 2: Delegate with Context, Not Prescriptions</h2>
      <p>
        Explain the 'why' and constraints clearly, then empower engineers to design
        the solution. Ownership fosters growth and accountability across the team.
      </p>
    `,
  },
  {
    id: 'effective-rfc-process',
    title: 'The Art of Writing Technical RFCs That Actually Get Read',
    intro: 'How structured Requests for Comments help distributed engineering teams debate trade-offs and reach durable architectural consensus.',
    category: 'Productivity',
    tags: ['RFC', 'Communication', 'Architecture'],
    readTime: '7 min read',
    publishedDate: 'Sep 17, 2026',
    appreciations: 756,
    author: {
      name: 'Sarah Jenkins',
      role: 'Principal Architect',
      avatar: 'SJ',
      articlesCount: 31,
    },
    contentHtml: `
      <p>
        As engineering organizations scale, architectural alignment cannot happen
        in impromptu hallway chats. RFCs (Requests for Comments) create a transparent
        historical record of design decisions and rejected alternatives.
      </p>
      <h2>Focus on Non-Goals Early</h2>
      <p>
        Explicitly stating what the proposal will NOT solve prevents endless scope creep
        and helps reviewers evaluate whether the trade-offs are sound.
      </p>
      <blockquote>
        A great design document invites constructive disagreement early when changes are cheap,
        rather than during deployment when changes are catastrophic.
      </blockquote>
    `,
  },
  {
    id: 'distributed-cache-postmortem',
    title: 'Post-Mortem: What a Cache Invalidation Bug Taught Us',
    intro: 'An honest breakdown of a production incident, the subtle race condition behind it, and how we hardened our telemetry.',
    category: 'Engineering',
    tags: ['PostMortem', 'Reliability', 'Caching'],
    readTime: '9 min read',
    publishedDate: 'Sep 12, 2026',
    appreciations: 1105,
    author: {
      name: 'Alex Kumar',
      role: 'Senior Frontend Engineer',
      avatar: 'AK',
      articlesCount: 24,
    },
    contentHtml: `
      <p>
        Phil Karlton famously observed that cache invalidation is one of the two
        hard things in computer science. Last Tuesday, our frontend team was reminded
        why in vivid detail.
      </p>
      <h2>The Incident</h2>
      <p>
        Users were intermittently receiving stale profile permissions after role updates.
        The issue stemmed from an optimistic cache write that completed after a slow background
        revalidation request had already initiated with stale data.
      </p>
      <h2>Guardrails Implemented</h2>
      <p>
        We added monotonic version timestamps to all cached payload keys, ensuring that
        out-of-order asynchronous responses are safely discarded.
      </p>
    `,
  },
  {
    id: 'inclusive-mentorship-pilot',
    title: 'Building Inclusive Engineering Teams: Lessons from Our Mentorship Pilot',
    intro: 'How pairing junior engineers with cross-functional mentors accelerated onboarding and fostered psychological safety.',
    category: 'HR & Culture',
    tags: ['Culture', 'Onboarding', 'Mentorship'],
    readTime: '5 min read',
    publishedDate: 'Sep 08, 2026',
    appreciations: 630,
    author: {
      name: 'Elena Rostova',
      role: 'People Operations & Culture Lead',
      avatar: 'ER',
      articlesCount: 8,
    },
    contentHtml: `
      <p>
        Hiring diverse talent is only half the journey. Creating an environment where
        everyone feels empowered to ask questions and take initiative is what determines
        long-term retention and team innovation.
      </p>
      <h2>Cross-Team Pairing</h2>
      <p>
        Rather than assigning mentors from the same immediate squad, we paired new hires
        with leads in adjacent domains. This gave newcomers a safe space to ask fundamental
        questions without fear of judgment.
      </p>
    `,
  },
];

export function getCustomArticles(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read custom articles from localStorage', e);
  }
  return [];
}

export function getAllArticles(): Article[] {
  const custom = getCustomArticles();
  return [...custom, ...SEED_ARTICLES];
}

export function saveNewArticle(article: Article): void {
  const custom = getCustomArticles();
  const updated = [article, ...custom];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save article to localStorage', e);
  }
}

// Global active articles list
export let ARTICLES: Article[] = getAllArticles();

export function refreshArticles(): void {
  ARTICLES = getAllArticles();
}
