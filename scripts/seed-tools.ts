/**
 * Seed script: migrates 53 tools from the static site into Supabase.
 * Run after setting .env.local:
 *   npx tsx scripts/seed-tools.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Cat mapping from old site → new slug
const catMap: Record<string, string> = {
  chat: "chat",
  write: "writing",
  image: "image",
  video: "video",
  code: "code",
  audio: "audio",
  productivity: "productivity",
  seo: "search",
  design: "design",
  data: "data",
  edu: "education",
};

const tools = [
  // chat
  { name:"ChatGPT", cat:"chat", slug:"chatgpt", desc:"OpenAI开发的对话AI，月活用户3.7亿，支持文本生成、代码编写、数据分析，是目前全球使用最广泛的AI工具。", url:"https://chat.openai.com", free:false, freeTier:true, pricing:"免费 / $20/mo", rating:9.5, hot:true, tags:["对话AI","OpenAI"] },
  { name:"Claude", cat:"chat", slug:"claude", desc:"Anthropic出品，支持200K超长上下文，以严谨和安全著称。在写作和分析任务中性能优异，隐私保护更完善。", url:"https://claude.ai", free:false, freeTier:true, pricing:"免费 / $20/mo", rating:9.4, hot:true, tags:["对话AI","Anthropic"] },
  { name:"Gemini", cat:"chat", slug:"gemini", desc:"Google DeepMind开发，深度集成Google生态（Gmail、Docs、Search），支持多模态输入，1M上下文窗口。", url:"https://gemini.google.com", free:false, freeTier:true, pricing:"免费 / $20/mo", rating:9.0, hot:false, tags:["对话AI","Google"] },
  { name:"Perplexity AI", cat:"search", slug:"perplexity-ai", desc:"AI驱动的实时搜索引擎，联网回答并附带引用来源，月活用户超1500万，被誉为「Google最强挑战者」。", url:"https://perplexity.ai", free:false, freeTier:true, pricing:"免费 / $20/mo", rating:9.2, hot:true, tags:["AI搜索","联网"] },
  { name:"Grok", cat:"chat", slug:"grok", desc:"xAI（马斯克）开发，实时接入X平台数据，风格幽默，2025年推出Grok-3后性能大幅提升，基准测试超越GPT-4o。", url:"https://x.com/i/grok", free:false, freeTier:false, pricing:"$8/mo (X Premium)", rating:8.5, hot:false, tags:["对话AI","xAI"] },
  { name:"DeepSeek", cat:"chat", slug:"deepseek", desc:"中国DeepSeek出品，开源模型R1推理能力接近GPT-4o，以极低成本实现顶级性能，2025年初引发全球AI行业震动。", url:"https://chat.deepseek.com", free:true, freeTier:true, pricing:"免费 / API pay-as-go", rating:9.0, hot:true, tags:["对话AI","开源"] },
  { name:"Meta AI", cat:"chat", slug:"meta-ai", desc:"Meta推出的免费AI助手，深度集成WhatsApp、Instagram、Facebook，支持图像生成，完全免费无限制。", url:"https://meta.ai", free:true, freeTier:true, pricing:"完全免费", rating:8.2, hot:false, tags:["对话AI","Meta"] },
  { name:"Le Chat", cat:"chat", slug:"le-chat", desc:"Mistral AI出品的免费聊天工具，Mistral Large 2模型驱动，代码和数学推理能力突出，欧洲最强开源AI代表。", url:"https://chat.mistral.ai", free:true, freeTier:true, pricing:"完全免费", rating:8.3, hot:false, tags:["对话AI","Mistral"] },
  // writing
  { name:"Jasper AI", cat:"writing", slug:"jasper-ai", desc:"专业AI写作平台，服务10万+品牌客户，提供50+内容模板，支持SEO优化写作，内容质量高于通用AI助手。", url:"https://jasper.ai", free:false, freeTier:false, pricing:"$49/mo+", rating:8.8, hot:true, tags:["写作","营销"] },
  { name:"Copy.ai", cat:"writing", slug:"copy-ai", desc:"面向营销团队的AI写作工具，一键生成广告文案、邮件序列、社媒内容，已帮助1500万用户完成内容创作。", url:"https://copy.ai", free:false, freeTier:true, pricing:"免费 / $49/mo", rating:8.4, hot:false, tags:["写作","营销"] },
  { name:"Notion AI", cat:"productivity", slug:"notion-ai", desc:"嵌入Notion的AI助手，支持写作润色、内容摘要、翻译、头脑风暴，2024年新增AI数据库查询功能。", url:"https://notion.so", free:false, freeTier:false, pricing:"$10/mo (add-on)", rating:8.6, hot:true, tags:["写作","效率"] },
  { name:"Writesonic", cat:"writing", slug:"writesonic", desc:"多语言AI写作平台，支持25+语言，内置Surfer SEO集成，自动优化文章关键词密度，适合内容营销团队。", url:"https://writesonic.com", free:false, freeTier:true, pricing:"免费 / $16/mo", rating:8.3, hot:false, tags:["写作","SEO"] },
  // image
  { name:"Midjourney", cat:"image", slug:"midjourney", desc:"业界顶级AI绘画工具，月活超1600万，V6版本图像质量媲美专业摄影，是商业设计师首选AI图像工具。", url:"https://midjourney.com", free:false, freeTier:false, pricing:"$10/mo+", rating:9.4, hot:true, tags:["图像生成","艺术"] },
  { name:"DALL-E 3", cat:"image", slug:"dall-e-3", desc:"OpenAI最新图像模型，集成于ChatGPT Plus，对文字描述的理解准确度比DALL-E 2提升了3倍以上。", url:"https://openai.com/dall-e-3", free:false, freeTier:false, pricing:"Included in ChatGPT Plus", rating:9.0, hot:true, tags:["图像生成","OpenAI"] },
  { name:"Stable Diffusion", cat:"image", slug:"stable-diffusion", desc:"开源图像生成模型，全球下载量超1亿次，可本地运行保护隐私，拥有庞大的LoRA/ControlNet扩展生态。", url:"https://stability.ai", free:true, freeTier:true, pricing:"免费 (open source)", rating:8.8, hot:true, tags:["图像生成","开源"] },
  { name:"Adobe Firefly", cat:"image", slug:"adobe-firefly", desc:"Adobe出品，商用版权安全（训练数据来自授权图库），深度集成Photoshop和Illustrator，支持生成填充和文字效果。", url:"https://firefly.adobe.com", free:false, freeTier:true, pricing:"免费 / CC subscription", rating:8.7, hot:false, tags:["图像生成","Adobe"] },
  { name:"Ideogram 2.0", cat:"image", slug:"ideogram", desc:"擅长在图像中生成清晰准确文字，弥补了AI绘图最大短板，每天25张免费，适合海报、封面、Logo设计。", url:"https://ideogram.ai", free:false, freeTier:true, pricing:"免费 / $8/mo", rating:8.9, hot:false, tags:["图像生成","文字图像"] },
  { name:"Leonardo AI", cat:"image", slug:"leonardo-ai", desc:"游戏资产生成专家，支持角色一致性设计，每天150免费积分，拥有300万+注册用户，风格多样。", url:"https://leonardo.ai", free:false, freeTier:true, pricing:"免费 / $12/mo", rating:8.6, hot:false, tags:["图像生成","游戏"] },
  { name:"Bing Image Creator", cat:"image", slug:"bing-image-creator", desc:"微软出品，基于DALL-E 3，每天15次快速生成，无需订阅，通过微软账号即可免费使用。", url:"https://bing.com/images/create", free:true, freeTier:true, pricing:"免费 (Microsoft account)", rating:8.4, hot:false, tags:["图像生成","Microsoft"] },
  { name:"Playground AI", cat:"image", slug:"playground-ai", desc:"每天100张免费图片，支持多种风格混合（真实/动漫/艺术），界面适合新手，无需信用卡注册。", url:"https://playground.com", free:false, freeTier:true, pricing:"免费100张/day", rating:8.2, hot:false, tags:["图像生成","免费"] },
  // video
  { name:"Runway Gen-3", cat:"video", slug:"runway-gen3", desc:"AI视频生成标杆工具，Gen-3 Alpha质量大幅提升，好莱坞制作公司已开始将其用于特效制作。", url:"https://runwayml.com", free:false, freeTier:true, pricing:"$15/mo+", rating:9.2, hot:true, tags:["视频生成","好莱坞"] },
  { name:"HeyGen", cat:"video", slug:"heygen", desc:"AI数字人视频平台，支持100+语言配音和口型同步，企业级客户超5万家，估值已达4.4亿美元。", url:"https://heygen.com", free:false, freeTier:true, pricing:"$29/mo+", rating:9.0, hot:true, tags:["数字人","配音"] },
  { name:"Pika 2.0", cat:"video", slug:"pika", desc:"2024年融资8000万美元的AI视频新秀，Pika 2.0支持更流畅的动作和场景切换，操作简单直观。", url:"https://pika.art", free:false, freeTier:true, pricing:"免费 / $8/mo", rating:8.6, hot:false, tags:["视频生成"] },
  { name:"Sora", cat:"video", slug:"sora", desc:"OpenAI视频生成模型，可生成60秒高质量视频，物理引擎逼真，包含在ChatGPT Pro订阅中。", url:"https://openai.com/sora", free:false, freeTier:false, pricing:"Included in ChatGPT Pro", rating:9.1, hot:false, tags:["视频生成","OpenAI"] },
  { name:"CapCut AI", cat:"video", slug:"capcut", desc:"字节跳动旗下剪辑工具，AI功能包括自动字幕、背景移除、AI特效，月活超5亿，最流行的移动端视频工具。", url:"https://capcut.com", free:false, freeTier:true, pricing:"免费 / $10/mo", rating:9.0, hot:true, tags:["视频剪辑","字节跳动"] },
  { name:"Kling AI", cat:"video", slug:"kling-ai", desc:"快手旗下AI视频生成工具，每天66积分免费，在运动连贯性和物理效果上超越同价位竞品。", url:"https://klingai.com", free:false, freeTier:true, pricing:"免费66积分/day", rating:8.7, hot:false, tags:["视频生成","快手"] },
  { name:"Hailuo AI", cat:"video", slug:"hailuo-ai", desc:"MiniMax出品，每天3次免费5秒高清视频，画面质量和物理效果在免费工具中表现最佳。", url:"https://hailuoai.com", free:false, freeTier:true, pricing:"免费3次/day", rating:8.5, hot:false, tags:["视频生成","MiniMax"] },
  // code
  { name:"GitHub Copilot", cat:"code", slug:"github-copilot", desc:"GitHub与OpenAI联合开发，覆盖150万付费用户，研究表明使用Copilot的开发者编码速度提升55%。", url:"https://github.com/features/copilot", free:false, freeTier:true, pricing:"免费 / $10/mo", rating:9.2, hot:true, tags:["代码补全","GitHub"] },
  { name:"Cursor", cat:"code", slug:"cursor", desc:"AI代码编辑器，2024年年末获1亿美元融资，估值达26亿美元，全代码库理解能力远超普通AI补全工具。", url:"https://cursor.sh", free:false, freeTier:true, pricing:"免费 / $20/mo", rating:9.4, hot:true, tags:["AI IDE","代码"] },
  { name:"Windsurf", cat:"code", slug:"windsurf", desc:"Codeium出品的AI IDE，Cascade智能体可跨文件自主完成复杂任务，免费额度比Cursor更慷慨。", url:"https://codeium.com/windsurf", free:false, freeTier:true, pricing:"免费 / $15/mo", rating:9.0, hot:false, tags:["AI IDE","Agentic"] },
  { name:"Tabnine", cat:"code", slug:"tabnine", desc:"支持30+编程语言，可完全本地运行保护代码隐私，适合企业内网环境，有SOC 2 Type 2认证。", url:"https://tabnine.com", free:false, freeTier:true, pricing:"免费 / $12/mo", rating:8.5, hot:false, tags:["代码补全","隐私"] },
  { name:"Codeium", cat:"code", slug:"codeium", desc:"完全免费的AI代码补全工具，支持70+编程语言，兼容VSCode/JetBrains/Vim，无限次补全，个人永久免费。", url:"https://codeium.com", free:true, freeTier:true, pricing:"完全免费", rating:8.7, hot:false, tags:["代码补全","免费"] },
  { name:"Amazon Q", cat:"code", slug:"amazon-q", desc:"亚马逊AWS的AI编程助手，个人版完全免费无限制，深度集成AWS生态，支持代码安全漏洞扫描和自动修复。", url:"https://aws.amazon.com/q", free:true, freeTier:true, pricing:"免费 (individual)", rating:8.4, hot:false, tags:["代码","AWS"] },
  // audio
  { name:"ElevenLabs", cat:"audio", slug:"elevenlabs", desc:"AI语音合成顶级平台，支持32种语言，声音自然度接近真人，被《时代》评为2024年最佳AI公司之一。", url:"https://elevenlabs.io", free:false, freeTier:true, pricing:"免费 / $5/mo+", rating:9.5, hot:true, tags:["语音合成","TTS"] },
  { name:"Suno v4", cat:"audio", slug:"suno", desc:"AI音乐生成工具，v4版本质量大幅提升，输入歌词和风格描述即可生成完整歌曲，每天50首免费。", url:"https://suno.ai", free:false, freeTier:true, pricing:"免费 / $10/mo", rating:9.4, hot:true, tags:["AI音乐","生成"] },
  { name:"Udio", cat:"audio", slug:"udio", desc:"与Suno并列的顶级AI音乐平台，在Jazz和古典音乐生成质量上略优，支持长达12分钟的完整歌曲。", url:"https://udio.com", free:false, freeTier:true, pricing:"免费 / $10/mo", rating:9.1, hot:false, tags:["AI音乐"] },
  { name:"Whisper", cat:"audio", slug:"whisper", desc:"OpenAI开源语音识别模型，支持99种语言，词错率低至3%，下载量超2000万，可本地离线运行。", url:"https://openai.com/research/whisper", free:true, freeTier:true, pricing:"免费 (open source)", rating:9.0, hot:false, tags:["语音识别","开源"] },
  // productivity
  { name:"Gamma AI", cat:"productivity", slug:"gamma-ai", desc:"AI演示文稿工具，输入主题30秒生成精美PPT，月活用户超400万，支持自定义品牌主题和导出为PPT/PDF。", url:"https://gamma.app", free:false, freeTier:true, pricing:"免费 / $10/mo", rating:8.9, hot:true, tags:["PPT","演示"] },
  { name:"Otter.ai", cat:"productivity", slug:"otter-ai", desc:"AI会议记录工具，实时转录并生成摘要和行动项，支持Zoom/Teams/Meet集成，企业用户超100万。", url:"https://otter.ai", free:false, freeTier:true, pricing:"免费 / $10/mo", rating:8.7, hot:true, tags:["会议记录","转录"] },
  { name:"Zapier AI", cat:"productivity", slug:"zapier-ai", desc:"AI驱动自动化工具，连接7000+应用，用自然语言描述工作流即可自动搭建，无需代码，月活超200万。", url:"https://zapier.com", free:false, freeTier:true, pricing:"免费 / $20/mo", rating:8.8, hot:false, tags:["自动化","No-code"] },
  { name:"Fathom", cat:"productivity", slug:"fathom", desc:"Zoom会议AI记录工具，永久免费无时间限制，自动生成摘要和行动项，准确率94%，Otter.ai最强免费替代品。", url:"https://fathom.video", free:true, freeTier:true, pricing:"完全免费", rating:8.6, hot:false, tags:["会议记录","免费"] },
  // seo/search
  { name:"Surfer SEO", cat:"search", slug:"surfer-seo", desc:"AI内容SEO优化标杆工具，实时对比TOP20竞品，给出NLP关键词建议，使用后平均排名提升68%。", url:"https://surferseo.com", free:false, freeTier:false, pricing:"$89/mo+", rating:8.9, hot:true, tags:["SEO","内容优化"] },
  { name:"SEMrush AI", cat:"search", slug:"semrush", desc:"整合AI写作功能的综合SEO平台，拥有250亿+关键词数据库，服务1000万+营销专业人士。", url:"https://semrush.com", free:false, freeTier:true, pricing:"$130/mo+", rating:9.0, hot:true, tags:["SEO","关键词"] },
  { name:"Ahrefs WT", cat:"search", slug:"ahrefs-wt", desc:"Ahrefs Webmaster Tools免费版，支持网站健康检查、反向链接分析、关键词排名跟踪，无次数限制。", url:"https://ahrefs.com/webmaster-tools", free:true, freeTier:true, pricing:"免费 (webmaster)", rating:8.5, hot:false, tags:["SEO","外链"] },
  { name:"Google Search Console", cat:"search", slug:"google-search-console", desc:"Google官方免费SEO工具，提供搜索表现数据、索引状态报告、核心网页指标，数据最权威。", url:"https://search.google.com/search-console", free:true, freeTier:true, pricing:"完全免费", rating:9.2, hot:false, tags:["SEO","Google"] },
  // design
  { name:"Canva AI", cat:"design", slug:"canva-ai", desc:"全球最受欢迎的设计工具，月活1.7亿，AI功能包括文字生图、背景移除、魔法编辑、AI演示文稿。", url:"https://canva.com", free:false, freeTier:true, pricing:"免费 / $15/mo", rating:9.1, hot:true, tags:["设计","图形"] },
  { name:"Figma AI", cat:"design", slug:"figma-ai", desc:"Figma 2024年推出原生AI功能，支持自动布局建议、内容填充、原型测试，设计团队协作效率大幅提升。", url:"https://figma.com", free:false, freeTier:true, pricing:"Included in Figma plan", rating:9.0, hot:false, tags:["UI设计","原型"] },
  { name:"Adobe Express", cat:"design", slug:"adobe-express", desc:"Adobe专为非设计师推出，免费版含背景移除（无限次）、AI图像生成（商用安全）、2万+专业模板。", url:"https://express.adobe.com", free:false, freeTier:true, pricing:"免费 / CC subscription", rating:8.5, hot:false, tags:["设计","Adobe"] },
  { name:"Microsoft Designer", cat:"design", slug:"microsoft-designer", desc:"微软出品，由DALL-E 3驱动，输入文字即可生成完整设计作品，完全免费无明显次数限制。", url:"https://designer.microsoft.com", free:true, freeTier:true, pricing:"完全免费", rating:8.4, hot:false, tags:["设计","Microsoft"] },
  // data
  { name:"Julius AI", cat:"data", slug:"julius-ai", desc:"对话式数据分析工具，上传CSV/Excel/数据库，用自然语言提问即可生成图表和洞察，无需SQL知识。", url:"https://julius.ai", free:false, freeTier:true, pricing:"免费 / $20/mo", rating:8.8, hot:false, tags:["数据分析","可视化"] },
  { name:"Consensus", cat:"data", slug:"consensus", desc:"AI学术搜索引擎，从2亿+学术论文中提炼证据，用AI摘要替代繁琐阅读，科研人员和学生必备。", url:"https://consensus.app", free:false, freeTier:true, pricing:"免费 / $9/mo", rating:8.6, hot:false, tags:["学术搜索","研究"] },
  // edu
  { name:"Khan Academy AI", cat:"education", slug:"khan-academy-ai", desc:"Khan Academy AI辅导老师Khanmigo，个性化K-12辅导，被美国超2万所学校采用，完全免费。", url:"https://khanacademy.org", free:true, freeTier:true, pricing:"完全免费", rating:8.7, hot:false, tags:["教育","K-12"] },
  { name:"Duolingo Max", cat:"education", slug:"duolingo-max", desc:"集成GPT-4的语言学习功能，支持「角色扮演」对话练习，Duolingo Max用户语言测试通过率提升40%。", url:"https://duolingo.com", free:false, freeTier:true, pricing:"$14/mo", rating:8.8, hot:false, tags:["语言学习","教育"] },
];

// Featured tools (highest ratings)
const featuredSlugs = ["chatgpt","claude","midjourney","cursor","elevenlabs","suno","runway-gen3","canva-ai","perplexity-ai","github-copilot","deepseek","gemini"];

async function seed() {
  console.log("🌱 Seeding tools...");

  const rows = tools.map(t => ({
    slug: t.slug,
    name: t.name,
    category: catMap[t.cat] ?? t.cat,
    description: t.desc,
    website_url: t.url,
    is_free: t.free,
    has_free_tier: t.freeTier,
    pricing_note: t.pricing,
    rating: t.rating,
    tags: t.tags,
    featured: featuredSlugs.includes(t.slug),
    published: true,
  }));

  const { error } = await supabase.from("tools").upsert(rows, { onConflict: "slug" });
  if (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }

  console.log(`✅ Seeded ${rows.length} tools`);
}

seed();
