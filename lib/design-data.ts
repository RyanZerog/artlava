export type NavKey = "home" | "profile" | "create" | "bell" | "message";

export type WorkspaceTabKey = "art" | "boards" | "collages";

export type WorkspacePanelKey =
  | "none"
  | "create"
  | "notifications"
  | "messages"
  | "settings";

export type DesignItem = {
  id: number;
  slug: string;
  title: string;
  source: string;
  imagePath: string;
  imageHeight: number;
  summary: string;
  description: string;
  category: string;
  board: string;
  author: string;
  tags: string[];
};

export type BoardGroup = {
  name: string;
  count: string;
  imageRefs: [string, string, string];
};

export type CollageProject = {
  id: number;
  title: string;
  mood: string;
  imageRef: string;
  published: boolean;
};

export type NotificationItem = {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
};

export type Contact = {
  id: number;
  name: string;
  role: string;
  preview: string;
  messages: { id: number; from: "them" | "me"; text: string }[];
};

export type SettingSection = {
  key: "profile" | "preferences" | "support";
  title: string;
  desc: string;
};

export type CreateType = {
  key: "art" | "board" | "collage";
  title: string;
  desc: string;
  actionLabel: string;
};

export const ASSET_BASE = "/figma/assets";

export const iconRefs = {
  logo: "123fd2380f0328de07868ce003385c3aa97f07c3",
  search: "43aa8b89e47eeb0941b08f16ced3f4823ce30c27",
  home: "22b6ad98d8bba275305659484350beb720094bc7",
  profile: "2e098abb6149eca05e8e6e53d4cabbdb1c78fcbe",
  create: "31fa61240d2c7350b9822316ca3ca67c7664090e",
  bell: "ba5cfe3423688b18f07f499492e5fb051f427716",
  message: "98cb6426a212ef72d65ec499021cd8cf35d51c06",
};

export const navItems: { key: NavKey; label: string; ref: string }[] = [
  { key: "home", label: "首页", ref: iconRefs.home },
  { key: "profile", label: "工作台", ref: iconRefs.profile },
  { key: "create", label: "上传设计方案", ref: iconRefs.create },
  { key: "bell", label: "更新通知", ref: iconRefs.bell },
  { key: "message", label: "聊天信息", ref: iconRefs.message },
];

export const designItems: DesignItem[] = [
  {
    id: 1,
    slug: "ebike-concept",
    title: "电瓶车设计",
    source: "ArtLava",
    imagePath: "/figma/home/4-6.png",
    imageHeight: 262,
    summary: "都市通勤电瓶车外观方案",
    description: "强调轻量化造型与通勤实用性，适合城市短途代步产品的早期概念展示。",
    category: "交通工具",
    board: "工业设计",
    author: "Lina",
    tags: ["交通", "通勤", "工业设计"],
  },
  {
    id: 2,
    slug: "wood-boat-study",
    title: "木船设计",
    source: "Vecteezy",
    imagePath: "/figma/home/4-16.png",
    imageHeight: 226,
    summary: "传统木船结构与材质研究",
    description: "以木质材料纹理和船体比例为重点，适合做文旅、展陈或模型参考。",
    category: "交通工具",
    board: "工业设计",
    author: "Mori",
    tags: ["船体", "木作", "结构"],
  },
  {
    id: 3,
    slug: "backpack-render",
    title: "背包设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-29.png",
    imageHeight: 237,
    summary: "功能型双肩包效果图",
    description: "针对年轻人出行场景的背包方案，突出模块分区与耐磨材质搭配。",
    category: "时尚周边",
    board: "品牌包装",
    author: "Aiden",
    tags: ["背包", "材质", "时尚"],
  },
  {
    id: 4,
    slug: "animation-styleframe",
    title: "动画设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-47.png",
    imageHeight: 451,
    summary: "角色动画分镜风格帧",
    description: "展示动画镜头氛围与角色姿态，适合在前期提案和视觉统一中使用。",
    category: "动画",
    board: "动画设计",
    author: "Noah",
    tags: ["动画", "分镜", "角色"],
  },
  {
    id: 5,
    slug: "tile-pattern",
    title: "地砖设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-57.png",
    imageHeight: 451,
    summary: "商业空间地砖纹样方案",
    description: "聚焦连续图案与表面肌理，用于商场与公共空间的室内材料参考。",
    category: "室内空间",
    board: "室内设计",
    author: "Yao",
    tags: ["地砖", "空间", "纹样"],
  },
  {
    id: 6,
    slug: "chair-exploration",
    title: "椅子设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-67.png",
    imageHeight: 401,
    summary: "现代家居椅外观探索",
    description: "强调骨架比例与坐感印象，适合家具产品提案和材质延展讨论。",
    category: "家具",
    board: "家具设计",
    author: "Ava",
    tags: ["家具", "椅子", "家居"],
  },
  {
    id: 7,
    slug: "ceiling-lighting",
    title: "吊顶设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-78.png",
    imageHeight: 339,
    summary: "商业空间吊顶照明方案",
    description: "把吊顶结构与灯光层级结合，适合餐饮和零售空间的前期方案讨论。",
    category: "室内空间",
    board: "室内设计",
    author: "Tina",
    tags: ["吊顶", "照明", "空间"],
  },
  {
    id: 8,
    slug: "wood-sculpture",
    title: "木雕设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-88.png",
    imageHeight: 367,
    summary: "木雕工艺造型研究",
    description: "从体块和雕刻层次切入，适合工艺品、展陈或家居装饰方向参考。",
    category: "艺术装置",
    board: "艺术装置",
    author: "Mia",
    tags: ["木雕", "工艺", "雕刻"],
  },
  {
    id: 9,
    slug: "bookshelf-system",
    title: "书架设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-98.png",
    imageHeight: 440,
    summary: "模块化书架系统方案",
    description: "通过收纳模组与层板节奏组合，营造灵活可扩展的家居书架体验。",
    category: "家具",
    board: "家具设计",
    author: "Kai",
    tags: ["书架", "模块化", "收纳"],
  },
  {
    id: 10,
    slug: "motion-graphic-frame",
    title: "动画设计",
    source: "ArtLava",
    imagePath: "/figma/home/4-108.png",
    imageHeight: 169,
    summary: "动态图形视觉片段",
    description: "适合品牌短片或活动传播素材，强调鲜明节奏与图形碰撞效果。",
    category: "动画",
    board: "动画设计",
    author: "Mila",
    tags: ["动态图形", "品牌", "视觉"],
  },
  {
    id: 11,
    slug: "icon-family-a",
    title: "图标设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-120.png",
    imageHeight: 401,
    summary: "一套科技感系统图标",
    description: "统一笔触和倒角语言，适合 App、后台系统和终端界面的视觉搭配。",
    category: "UI 图标",
    board: "图标系统",
    author: "June",
    tags: ["图标", "系统", "UI"],
  },
  {
    id: 12,
    slug: "icon-family-b",
    title: "图标设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-130.png",
    imageHeight: 434,
    summary: "圆角几何风图标集",
    description: "在统一网格中强化识别度，适合与插画和大色块风格搭配使用。",
    category: "UI 图标",
    board: "图标系统",
    author: "June",
    tags: ["图标", "几何", "视觉系统"],
  },
  {
    id: 13,
    slug: "interior-moodboard",
    title: "室内设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-140.png",
    imageHeight: 226,
    summary: "家居空间氛围提案",
    description: "通过材质板与光影组合表达室内氛围，适合作为软装前期概念稿。",
    category: "室内空间",
    board: "室内设计",
    author: "Ellie",
    tags: ["室内", "氛围", "软装"],
  },
  {
    id: 14,
    slug: "botanical-study",
    title: "植物设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-150.png",
    imageHeight: 401,
    summary: "植物元素造型方案",
    description: "适合做包装插画、空间装置或纹样延展，突出自然生长感与层次。",
    category: "自然主题",
    board: "植物设计",
    author: "Leo",
    tags: ["植物", "自然", "插画"],
  },
  {
    id: 15,
    slug: "artifact-showcase",
    title: "艺术品设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-160.png",
    imageHeight: 402,
    summary: "陈列艺术作品展示稿",
    description: "从作品尺度、质感与展示方式出发，适合展馆和商业展示项目参考。",
    category: "艺术装置",
    board: "艺术装置",
    author: "Sora",
    tags: ["艺术品", "展陈", "空间"],
  },
  {
    id: 16,
    slug: "sofa-concept",
    title: "沙发设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-171.png",
    imageHeight: 301,
    summary: "柔性家居沙发方案",
    description: "关注人体工学与包裹感，适合作为现代家居产品系列的起始方案。",
    category: "家具",
    board: "家具设计",
    author: "Ava",
    tags: ["沙发", "家居", "产品"],
  },
  {
    id: 17,
    slug: "cup-shape-study",
    title: "杯子设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-180.png",
    imageHeight: 280,
    summary: "饮具外观与握持体验研究",
    description: "围绕杯身比例和把手结构做变化，适合生活方式品牌的新品方向探索。",
    category: "生活用品",
    board: "品牌包装",
    author: "Liam",
    tags: ["杯子", "生活", "器物"],
  },
  {
    id: 18,
    slug: "texture-board",
    title: "纹理设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-190.png",
    imageHeight: 428,
    summary: "材质纹理与表面处理样本",
    description: "适合作为包装、空间与平面设计的质感参考，用于快速统一视觉基调。",
    category: "自然主题",
    board: "纹理设计",
    author: "Nina",
    tags: ["纹理", "材质", "表面"],
  },
  {
    id: 19,
    slug: "garden-landscape",
    title: "园林设计图",
    source: "ArtLava",
    imagePath: "/figma/home/4-200.png",
    imageHeight: 531,
    summary: "园林景观规划效果图",
    description: "从动线、植物层次和景观节点组织出发，适用于园林与社区更新场景。",
    category: "自然主题",
    board: "植物设计",
    author: "Zoe",
    tags: ["园林", "景观", "植物"],
  },
];

export const boardGroups: BoardGroup[] = [
  {
    name: "动画设计",
    count: "10 份方案",
    imageRefs: [
      "b134f096e092b7e73f9b0986b92365aac1eb718a",
      "babdb8df9b95577178eea74e7fe38d26a0729a56",
      "9e6e441b2e32841414e86942fce9cc40eb797c02",
    ],
  },
  {
    name: "植物设计",
    count: "8 份方案",
    imageRefs: [
      "7cf293613b0712332499c72f042b278df4cd8b6f",
      "55c60c688ef9400a68ebc622f65700c83918e282",
      "d8b0f1dc4bf9cba464d972b0ccb202ed41f91e68",
    ],
  },
  {
    name: "图标系统",
    count: "6 份方案",
    imageRefs: [
      "00d975cafd9054da61cb53db190ec14d2a23c013",
      "5834f8a2d490ee156b12863301b099daae5c3f6d",
      "3043a62f66f05a71b491c73c95f6f38c7fa02f41",
    ],
  },
  {
    name: "纹理设计",
    count: "4 份方案",
    imageRefs: [
      "e205a80024c2746469b9d7faccc4f73f4926961c",
      "05a94270c3729c4898ebe7a6afbc3ae0512ecb0a",
      "80113469eff209fe5b12e0943db35174694c2c46",
    ],
  },
];

export const collageProjects: CollageProject[] = [
  {
    id: 1,
    title: "未来通勤拼贴",
    mood: "交通 / 科技 / 轻量感",
    imageRef: "b3d7187289051f03b92d55f350dcbb2247b6495e",
    published: false,
  },
  {
    id: 2,
    title: "暖木家居拼贴",
    mood: "家具 / 木作 / 居家",
    imageRef: "64c16ce140b11873131d6603cb927b064134aff4",
    published: true,
  },
  {
    id: 3,
    title: "植物与展陈拼贴",
    mood: "自然 / 展览 / 空间",
    imageRef: "39b8807ba8d4fb5d0d0ea9c9d59c0365bc98dcea",
    published: false,
  },
];

export const notificationItems: NotificationItem[] = [
  {
    id: 1,
    title: "最新发布：园林设计图",
    subtitle: "查看新的景观方案和植物分层做法",
    slug: "garden-landscape",
  },
  {
    id: 2,
    title: "最新发布：图标设计图",
    subtitle: "一组新的图标系统设计已上线",
    slug: "icon-family-a",
  },
  {
    id: 3,
    title: "最新发布：沙发设计图",
    subtitle: "看看新的家具产品方向与材质搭配",
    slug: "sofa-concept",
  },
];

export const contacts: Contact[] = [
  {
    id: 1,
    name: "Lina",
    role: "工业设计师",
    preview: "我把电瓶车那套方案补了两个方向。",
    messages: [
      { id: 1, from: "them", text: "我把电瓶车那套方案补了两个方向。" },
      { id: 2, from: "me", text: "收到，我先看通勤款，再看运动款。" },
      { id: 3, from: "them", text: "可以，右上角那版更适合做首页展示。" },
    ],
  },
  {
    id: 2,
    name: "June",
    role: "视觉设计师",
    preview: "图标系统已经整理成两个分类。",
    messages: [
      { id: 1, from: "them", text: "图标系统已经整理成两个分类。" },
      { id: 2, from: "me", text: "好的，我放到图板里统一归类。" },
    ],
  },
  {
    id: 3,
    name: "Ava",
    role: "家具设计师",
    preview: "沙发方案今晚可以直接发布。",
    messages: [
      { id: 1, from: "them", text: "沙发方案今晚可以直接发布。" },
      { id: 2, from: "me", text: "我会先做详情页，再挂到推荐流里。" },
    ],
  },
];

export const settingSections: SettingSection[] = [
  { key: "profile", title: "账户资料", desc: "修改昵称、邮箱和简介" },
  { key: "preferences", title: "偏好设置", desc: "管理分类、通知和展示偏好" },
  { key: "support", title: "设置与支持", desc: "查看帮助、反馈和常见问题" },
];

export const createTypes: CreateType[] = [
  {
    key: "art",
    title: "Art 图",
    desc: "发布你的设计作品，并附上说明和标签",
    actionLabel: "上传 Art 图",
  },
  {
    key: "board",
    title: "图板",
    desc: "创建新的收藏分类，整理喜欢的设计方案",
    actionLabel: "新建图板",
  },
  {
    key: "collage",
    title: "拼贴",
    desc: "创建属于你的设计方案，并准备发布",
    actionLabel: "创建拼贴",
  },
];

export const workspaceTabs: { key: WorkspaceTabKey; label: string; subtitle: string }[] = [
  { key: "art", label: "Art 图", subtitle: "查看你收藏的设计方案以及分类" },
  { key: "boards", label: "图版", subtitle: "可以创建新的收藏分类" },
  { key: "collages", label: "拼贴", subtitle: "创建属于你的设计方案并且可以发布" },
];

export const settingsDefaultProfile = {
  nickname: "ArtLava 用户",
  email: "user@artlava.com",
  bio: "正在整理喜欢的设计方案和创作灵感。",
};

export function getDesignBySlug(slug: string) {
  return designItems.find((item) => item.slug === slug);
}
