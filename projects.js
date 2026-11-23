// 首页项目清单：新增项目时只需修改这个文件；封面图片另行上传。
// category: "course"（课程作业）或 "toys"（我的小玩意）。
// href 填已发布的网站地址，不是 GitHub 仓库的代码页面。
// cover 可填 "agent" / "mlp"（已有封面），或省略并填写 image 图片路径。
// 新项目示例（复制进数组，替换为真实信息后再公开）：
// { id: "my-game", category: "toys", title: "我的小游戏",
//   description: "一句话介绍玩法", label: "小游戏", kind: "在线体验",
//   href: "https://你的用户名.github.io/你的仓库名/", image: "covers/my-game.webp" }
window.LIUYU_PROJECTS = [
  {
    id: "agent", category: "course", cover: "agent",
    title: "我的 Agent 使用实践",
    description: "记录我怎样使用 AI Agent，以及使用过程中的尝试与体会。",
    label: "第一次作业", kind: "实践记录", href: "homework-01.html",
    action: "查看第一次作业"
  },
  {
    id: "mlp", category: "course", cover: "mlp",
    title: "影之刃零 AI 行为演示",
    description: "在简单的武侠对决中，观察 MLP 参数学习与神经网络的行为变化。",
    label: "第二次作业", kind: "交互实验",
    href: "https://mufu520.github.io/ai_homework/#home", action: "查看第二次作业"
  },
  {
    id: "count-money", category: "toys", title: "记账",
    description: "一款离线安卓账本，支持手动记账和本机账单截图识别，核对后即可按日、按月查看收支。",
    label: "安卓应用", kind: "生活工具", image: "covers/count-money.jpg",
    href: "https://github.com/mufu520/count-money-android/releases/latest", action: "下载安卓版"
  },
  {
    id: "pindou", category: "toys", title: "拼豆图纸",
    description: "在 Android 手机上离线把图片转换成可编辑的拼豆图纸，支持品牌色卡、用量统计和 PNG／PDF 导出。",
    label: "安卓应用", kind: "创作工具", image: "covers/pindou.png",
    href: "https://github.com/mufu520/pindou-android/releases/latest", action: "下载安卓版"
  }
];
