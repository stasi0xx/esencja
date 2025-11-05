
export interface BlogPost {
  title: string;
  summary: string;
  slug: string;
  content?: string;
  imageUrl?: string;
  category: 'SEO' | 'Content Strategy' | 'Social Media' | string;
}