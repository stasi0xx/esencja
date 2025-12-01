
export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  slug: string;
  content?: string;
  img_url?: string;
  order?: number;
  category: 'SEO' | 'Content Strategy' | 'Social Media' | string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CardItem {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  icon?: string | null;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  highlight_start?: number | null;
  highlight_end?: number | null;

}

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  subtitle?: string | null;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}