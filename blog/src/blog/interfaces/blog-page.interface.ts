import { BlogInterface } from './blog.interface';

export interface BlogPageInterface {
  author: string;
  body: string;
  blog: BlogInterface | string;
  caption: string;
  date: Date;
  description: string;
  image: string;
  pageId: string;
  subtitle: string;
  title: string;
}

