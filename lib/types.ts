export interface Tool {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  rating?: number;
  is_free: boolean;
  has_free_tier: boolean;
  pricing_note?: string;
  tags?: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category?: string;
  lang: string;
  content_type: "static" | "db";
  static_file?: string;
  html_content?: string;
  cover_image?: string;
  published: boolean;
  featured: boolean;
  view_count: number;
  published_at: string;
  updated_at: string;
}

export interface ToolSubmission {
  id: string;
  tool_name: string;
  website_url: string;
  description?: string;
  submitter_email?: string;
  status: "pending" | "approved" | "rejected";
  admin_note?: string;
  created_at: string;
}

export interface UserBookmark {
  id: string;
  user_id: string;
  tool_id: string;
  created_at: string;
  tool?: Tool;
}

export const CATEGORIES = [
  { key: "writing",      icon: "✍️",  label_zh: "AI 写作",   label_en: "AI Writing" },
  { key: "code",         icon: "💻",  label_zh: "AI 编程",   label_en: "AI Coding" },
  { key: "image",        icon: "🎨",  label_zh: "图像生成",  label_en: "Image Gen" },
  { key: "video",        icon: "🎬",  label_zh: "视频创作",  label_en: "Video" },
  { key: "audio",        icon: "🎵",  label_zh: "音频语音",  label_en: "Audio & Voice" },
  { key: "chat",         icon: "💬",  label_zh: "AI 对话",   label_en: "AI Chat" },
  { key: "search",       icon: "🔍",  label_zh: "AI 搜索",   label_en: "AI Search" },
  { key: "productivity", icon: "⚡",  label_zh: "效率工具",  label_en: "Productivity" },
  { key: "data",         icon: "📊",  label_zh: "数据分析",  label_en: "Data Analysis" },
  { key: "education",    icon: "📚",  label_zh: "教育学习",  label_en: "Education" },
  { key: "design",       icon: "🎯",  label_zh: "UI 设计",   label_en: "UI Design" },
  { key: "other",        icon: "🔧",  label_zh: "其他工具",  label_en: "Other" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];
