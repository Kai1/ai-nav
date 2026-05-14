const zh = {
  // Nav
  nav_home: "首页",
  nav_tools: "工具库",
  nav_articles: "评测文章",
  nav_submit: "提交工具",
  nav_login: "登录",
  nav_dashboard: "我的收藏",
  nav_admin: "管理后台",
  nav_logout: "退出",

  // Homepage
  hero_title: "发现最好的 AI 工具",
  hero_subtitle: "110+ 篇深度评测 · 50+ 款精选工具 · 每周持续更新",
  hero_search_placeholder: "搜索 AI 工具或评测...",
  hero_cta_tools: "浏览工具库",
  hero_cta_articles: "查看评测",

  // Sections
  section_featured_tools: "精选工具",
  section_latest_articles: "最新评测",
  section_categories: "工具分类",
  section_all_tools: "全部工具",
  section_stats: "平台数据",

  // Tools
  tool_free: "免费",
  tool_paid: "付费",
  tool_freemium: "免费+",
  tool_bookmark: "收藏",
  tool_bookmarked: "已收藏",
  tool_visit: "访问官网",
  tool_read_review: "查看评测",
  tool_rating: "评分",
  tool_filter_all: "全部",

  // Categories
  cat_writing: "AI 写作",
  cat_code: "AI 编程",
  cat_image: "图像生成",
  cat_video: "视频创作",
  cat_audio: "音频语音",
  cat_chat: "AI 对话",
  cat_search: "AI 搜索",
  cat_productivity: "效率工具",
  cat_data: "数据分析",
  cat_education: "教育学习",
  cat_design: "UI 设计",
  cat_other: "其他工具",

  // Auth
  auth_login_title: "登录 AI Nav",
  auth_login_subtitle: "收藏工具、管理书签",
  auth_email_label: "邮箱地址",
  auth_email_placeholder: "your@email.com",
  auth_send_link: "发送登录链接",
  auth_check_email: "请检查你的邮箱",
  auth_check_email_desc: "我们已发送登录链接到你的邮箱，点击链接即可登录。",
  auth_login_with_google: "使用 Google 登录",

  // Dashboard
  dashboard_title: "我的收藏",
  dashboard_empty: "还没有收藏任何工具",
  dashboard_empty_cta: "去发现工具",

  // Admin
  admin_title: "管理后台",
  admin_tools: "工具管理",
  admin_articles: "文章管理",
  admin_submissions: "提交审核",
  admin_stats: "数据概览",
  admin_total_tools: "工具总数",
  admin_total_articles: "文章总数",
  admin_pending: "待审核",
  admin_views_7d: "7日浏览量",
  admin_publish: "发布",
  admin_unpublish: "下架",
  admin_approve: "通过",
  admin_reject: "拒绝",
  admin_edit: "编辑",
  admin_delete: "删除",
  admin_new_tool: "新增工具",
  admin_new_article: "新增文章",
  admin_save: "保存",
  admin_cancel: "取消",

  // Submit
  submit_title: "推荐 AI 工具",
  submit_subtitle: "发现一款好工具？告诉我们！",
  submit_tool_name: "工具名称",
  submit_website: "官网地址",
  submit_description: "简短描述",
  submit_email: "你的邮箱（可选）",
  submit_btn: "提交推荐",
  submit_success: "提交成功！我们会在 3 个工作日内审核。",
  submit_error: "提交失败，请稍后重试。",

  // Search
  search_title: "搜索结果",
  search_results_for: "关于",
  search_results_count: "条结果",
  search_no_results: "没有找到相关内容",
  search_no_results_tip: "试试其他关键词",

  // Footer
  footer_about: "关于我们",
  footer_contact: "联系我们",
  footer_privacy: "隐私政策",
  footer_terms: "服务条款",
  footer_cookie_settings: "Cookie 设置",
  footer_copy: "© 2026 AI Nav · 独立AI工具评测与导航",

  // Cookie banner
  cookie_msg: "我们使用 Cookie 改善体验并展示相关广告。",
  cookie_essential: "仅必要",
  cookie_accept_all: "接受全部",
  cookie_learn_more: "了解更多",

  // Misc
  loading: "加载中...",
  error_generic: "出错了，请稍后重试",
  views: "次浏览",
  read_more: "阅读全文",
  back_home: "返回首页",
  last_updated: "更新于",
};

export default zh;
export type TranslationKey = keyof typeof zh;
