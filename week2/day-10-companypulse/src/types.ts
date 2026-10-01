export type Category =
  | 'All'
  | 'Engineering'
  | 'Technology'
  | 'Leadership'
  | 'Productivity'
  | 'Career'
  | 'HR & Culture';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  department?: string;
  articlesCount?: number;
  followersCount?: number;
}

export interface Article {
  id: string;
  title: string;
  intro: string;
  contentHtml: string;
  category: Category;
  tags: string[];
  readTime: string;
  author: Author;
  publishedDate: string;
  appreciations: number;
}

export interface ArticleComment {
  id: string;
  articleId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  likedByMe?: boolean;
  replyToAuthor?: string;
}

export interface AppNotification {
  id: string;
  type: 'comment' | 'heart' | 'subscribe';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkHash: string;
  actorAvatar: string;
}
