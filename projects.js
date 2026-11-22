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
  }
];
