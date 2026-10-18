# 使用史复盘：2026-08-20 → 2026-10-16

> 课程展示节选，由 AI 辅助整理。以下为代表性协作记录；历史交付与验证结果未在本次重新运行，未完成事项仍按原记录说明。

> **这份文档怎么来的**
> 我（DSH 智能体）本身不保留跨会话记忆。这份复盘是从磁盘上真实的会话日志重建的：
> `C:\Users\19800\AppData\Roaming\dsh-desktop\harness\sessions\` 下 **49 份 `*.jsonl.zstd`**（多帧 zstd 流，逐帧切分解压），
> 抽取其中的 `user/message`（剔除 `runtime-context` / `system-reminder` 注入）、`session/title`、`tool/call`、
> `deliverables/presented`、`assistant/message`，再按时间重排。
> 复盘过程生成的临时文件已删除，未改动任何既有文件。
>
> **数据口径**：原始 `user/message` 记录 223 条；其中 `Review the inherited completed checkpoint now.`
> 是 DSH 断点续传时**系统注入**的，不是用户打的，剔除后约为 **190 次真实输入**。
> 49 个 session 文件因续传切片，去重后是 **37 段独立对话**。

---

## 一、总览：两个月、5 个工作区、10 条主线

| # | 时间 | 主线 | 我实际做了什么 | 留存的产物 |
|---|---|---|---|---|
| 1 | 08-20 | DSH 本体 + 桌宠 + 图标 | 讲清能力边界与插件机制；读桌宠配置；找 Codex/DeepSeek 官方图标、抠图适配深色模式 | [DeepSeek.ico](<C:/Users/19800/Desktop/小东西/图标2/DeepSeek.ico>)、[Codex.ico](<C:/Users/19800/Desktop/小东西/图标2/Codex.ico>) |
| 2 | 08-20~23 | 关于我自己的元问题 | skill 是什么、有无图片读写能力、本地大模型怎么装 | 纯问答 |
| 3 | 08-26 | **给 DSH 写 FastCtx 模式** | 读 DSH 源码定位 preset 扩展点 → 写用户级 preset + MCP 桥接 → 端到端验证 | `.agent-presets\fastctx\`（3 个文件） |
| 4 | 08-26~27 | 英语写作辅助 | generation gap 说明文：表达解释、逐句纠错、结构改写与评价建议 | 纯对话 |
| 5 | 08-28 | 即梦头像提示词 | 弈星 × 褚嬴"代打"梗头像，多轮提示词调优 | 纯提示词 |
| 6 | 09-17~21 | **Python 从零学** | 浮点坑、两份全注释可运行教学文件、持续语法问答 | [速查.py](<C:/Users/19800/Desktop/code/Python_新手常用语法速查.py>)、[手册.py](<C:/Users/19800/Desktop/code/Python全知识点学习手册.py>) |
| 7 | 09-21 | **鸿蒙拼豆 App** | 读安卓版 Kotlin 源码当规格 → ArkTS 重写鸿蒙 NEXT 工程 → 修编译错误 | `pindou-harmoynous\Pindou` |
| 8 | 09-25 | Claude Code 排障 | 劝阻第三方重打包版；诊断 `localStorage` / PTY 启动崩溃 | [pty-repro.cjs](pty-repro.cjs) |
| 9 | 10-15~16 | **5 篇 VLN 论文** | PDF 抽文本清洗 → 4 个子代理并行精读 → 汇总对照 + 通俗版 | [五篇论文概括.md](五篇论文概括.md) |
| 10 | 10-16 | 本次复盘 | 解压全部会话日志、重建使用史 | 本文档 |

**规模**：约 190 次真实输入、700+ 次工具调用。
**工作区**：`D:\DSH\测试`、`D:\DSH\测试gpt`、`桌面\code`、`桌面\pindou`、`桌面\pindou-harmoynous`。
**模型**：deepseek-v4-pro / deepseek-v4-flash / gpt-5.5 / gpt-5.6-sol / gpt-5.6-luna 都用过。
**模式（preset）**：standard 30 次、fastctx 15 次、cordis 4 次。

---

## 二、逐条细说

### 1. DSH 本体：先把"家底"摸清（08-20）

- 第一句就是「**你可以干什么，你是什么智能体**」，接着问「我怎么给你加插件，这些插件有什么用」。
- 我下潜到 `D:\DSH\DSH Desktop\resources\app`，读了 `dsh-desktop-market-installer` 的 `index.js` / `client.js`，
  又从 `dshmarket` 插件里找出市场接口 `/dsh-market/registry`，把插件清单落到本地看过一遍，给你推荐过搜索类插件。
- 同一晚你要 Codex 和 DeepSeek 的桌面图标。链路是：iconify / simple-icons → 本地渲染 → 打包到桌面。
  下载过程中遇到连接异常，排查了 DNS 与网络连通性。
- 九月你说「**为什么你的图标没了，这样子好畸变**」。真因不是程序图标丢了，而是
  **桌面快捷方式指向的 `.ico` 被你自己收进了 `小东西\图标2\`，Windows 找不到就退化成空白占位图再被拉伸绘制**。
  修法：把 `IconLocation` 改指实际存在的 `小东西\图标2\DeepSeek.ico`，再跑 `ie4uinit.exe -show` 刷图标缓存。
  顺便确认该文件是完整 7 尺寸 32 位 ICO（256/128/64/48/32/24/16），各场景都不会再变形。
- 相关旁证：`harness\pet.json` 里挂的宠物是 **chuying（褚嬴）**，来源是 `桌面\小东西\codex-pet-chuying`
  的"棋魂梗版" Codex 桌宠——和你 8 月底反复调的头像梗是同一个人物。

### 2. 关于我自己的元问题（08-20 ~ 08-23）

零散但真实：skill 是什么、有没有图片读取与生成能力、装什么生图插件、你是什么智能体 / API 地址是啥、
什么是本地大模型以及怎么装。这一段我基本只做解释，没产出文件——但也暴露过一次能力边界：
**当时 `modlens` 没配视觉模型、`deepseek-v4-flash` 不能读图，所以你发截图我是看不到内容的**，这一点我在图标排障时明确告诉过你。

### 3. FastCtx 模式：技术含量最高的一次（08-26）

你的原话：「我有安装 fastctx（github.com/yc-duan/fastctx），请你帮我做一个 fastctx 的模式」。

我的执行顺序（**先只出方案、不动文件**，你确认后才改）：

1. 读 DSH 0.6.2 的 preset 架构、`agent-presets` README、`dsh-mcp-client` 说明，确认扩展点；
2. 结论性设计：**做用户级 preset，副本式复制 `standard`，绝不改应用内置文件**；
   保留原生 `pwsh`、文件工具、搜索、jobs；把 FastCtx 作为**额外**工具源而非替换；
   **不启用 FastCtx 的 fastshell**（否则两套 Shell/后台任务、持久化与策略语义会打架）；
   启动用**直连 node 调用 `launcher.js serve`**，绕开 npm shim；**不在 preset 里写死 repo 级 cwd**
   （preset 是进程级共享挂载，写死会导致多会话目录串用）。
3. 落地文件：
   - `harness\.agent-presets\fastctx\agent.cordis.yml`
   - `harness\.agent-presets\fastctx\preset.yml`（显示名「FastCtx 模式」）
   - `harness\.agent-presets\fastctx\fastctx-guidance.mjs`
4. 验证结果：preset 被识别为健康、无 YAML/插件错误；MCP 桥成功注册 4 个工具
   （`mcp__fastctx__inspect_local_file` / `grep` / `glob` / `replace`）；
   实际跑通一次 FastCtx 文件读取；模式提示词能注入各会话工作目录；GUI 仍返回 HTTP 200。

**后续证据**：日志里 fastctx preset 被 15 个会话使用，说明你确实把它当成了常用模式。
（后来你还问过「什么是 fastctx」，我用"自带工具是普通扳手、FastCtx 是电动的"打的比方。）

### 4. 英语写作：表达纠错与结构调整（08-26 ~ 08-27）

起点是一道命题说明文：*My view on generation gap*，要求 thesis、topic sentence、illustration、restate。
过程从「各退一步怎么说地道」→ **meet each other halfway** 这类地道表达，滚成完整批改循环：

- 逐条改错：`generation gap.I` 缺空格、`the generation Z` 不加 the、`thier`→`their`、
  `make`→`makes`、`solve the generation gap`→`bridge the generation gap`、`diaglue`→`dialogue` 等；
- 依据写作要求，提供语言、衔接和段落组织方面的评价建议；AI 的估分仅为参考。
- 根据提供的课件要求，AI 对整篇文章进行了结构改写，包括例证段、解决方案段与结尾。
- 继续讨论主旨句、段落展开和表达的改进方式。AI 不仅检查语法，也参与了内容改写，不能将全部文本视为独立写作成果。

这段对话被 DSH 的断点续传连续 fork 了 6 次，所以日志里同一段内容反复出现——**不是我们聊了 6 遍**。

### 5. 即梦头像：一次典型的"AI 味"拉锯（08-28）

目标：《王者荣耀》**弈星** × 《棋魂》**褚嬴** 的"褚嬴帮弈星代打"二创头像。迭代路径很清楚：

普通摆拍 → 抽象梗 → 像素风 → 双人叠脸 → 你反馈"AI 感还是很重 / 脸越来越不像褚嬴和弈星" →
我把策略改成**局部重绘只修脸**，并明确一句关键约束：
**「当前成图只作构图参考，你发的两张参考图才是脸部身份的唯一依据」**，
同时给出成段的正负面提示词（禁通用 AI 男主脸、禁欧美深眼窝高鼻梁、禁交换两人发色与五官、
禁把某一方画成灰色影子、禁平均融合成第三张陌生脸）。

**注意：这一线我全程只调提示词，没有出过图**——当时我没有生图能力，
画面都是你在即梦那边生成后拿回来给我看的（我看不到图，只能靠你的文字描述判断）。

### 6. Python：从零基础起步（09-17 ~ 09-21）

起点很具体：「**为什么 0.1 加八次算出来是 0.**」——从浮点精度讲到 `repr` 与二进制表示。
接着你要「在这个文件夹里写一个 python 文件，包含所有新手会用到的代码，**每一行后面都要加注释**且最后能运行」。产出：

- `Python_新手常用语法速查.py`（[文件](<C:/Users/19800/Desktop/code/Python_新手常用语法速查.py>)，67 KB）
  — 787 行 / 24 节，**实跑退出码 0、无报错**，
  从变量类型、运算符、字符串、列表字典集合，到函数坑（可变默认参数）、异常、文件读写、类、装饰器、
  生成器、上下文管理器、日期与 JSON、collections，最后是词频统计综合例子。
  写文件那节会生成临时文件并在演示后 `os.remove` 删掉。
- `Python全知识点学习手册.py`（[文件](<C:/Users/19800/Desktop/code/Python全知识点学习手册.py>)，118 KB）
  — 1448 行 / 28 节（含类型注解、正则、线程与 async、
  综合实战：质数/二分/快排/词频/成绩册/计算器），跑完会在同目录生成 `学习输出\`
  （`demo.txt`、`students.csv`、`config.json`、`grades.json` 等真实读写产物）。
  设计上把 `main()` 放在末尾，注释掉某行 `demo_xx()` 就能跳过该节；`input()` 那节默认注释掉以免卡住。

之后是持续的语法问答：`print` 的 `sep/end` 规则、换行输出、`input()` 的四条硬规则
（永远返回 `str`、只去掉行尾换行、最多一个参数、提示语写 stdout）、
`a=True; print(1+a)` 为什么是整数、位运算、`isinstance`、变量的地址有什么用、列表与 map 的用法。

> ⚠️ **一处更正**：我在上一条对话回复里曾提到目录中有 `...-完成版.py` 两个文件，**这是记错了**。
> 已回查目录，`桌面\code` 下就是原始文件名 `Python_新手常用语法速查.py`（67 KB）与
> `Python全知识点学习手册.py`（118 KB），两个文件都在、内容完整，没有被改名、也没有"-完成版"副本。
>
> ⚠️ **另一处边界**：`桌面\code\练习` 与 `学习输出` 里 10-12 之后新增的一批 HTML 速查
> （`print输出格式大全.html`、`列表用法速查.html`、`洛谷入门解题手册.html`、
> `print输出专项练习.html`、`Python练习01_基础语法.html`）以及 `打鱼晒网-对拍脚本.py`，
> **在我 09-25 结束的 DSH 会话记录里没有对应来源**，可能来自你的其他工具，不是我做的。

### 7. 鸿蒙拼豆 App（09-21）

你的原话：「参考我桌面上的 pindou 文件夹，利用鸿蒙的开发软件 DevEcoStudio 制作一个适配鸿蒙系统的拼豆软件，要有项目工程文件。」

我的做法是**不凭空调侃、先读规格**：把 `桌面\pindou` 那份安卓版 Kotlin 工程读透
（`BeadModels.kt`、`PatternLimits.kt`、`PatternProcessor.kt`、`PatternExporter.kt`、
`PerlerViewModel.kt`、`PatternProjectStore.kt`、`PerlerApp.kt`、`AndroidManifest.xml`，
以及 `docs\PRODUCT_SPEC.md` / `PALETTES.md`），再按同样的产品语义用 **ArkTS 重写为鸿蒙 NEXT 工程**
`桌面\pindou-harmoynous\Pindou`（164 次工具调用，40 次写文件）——
工程根目录见 [pindou-harmoynous/Pindou](<C:/Users/19800/Desktop/pindou-harmoynous/Pindou>)。
过程中我查了一轮 HarmonyOS 的 API 资料（`OffscreenCanvas`、`image.Packer`、`photoAccessHelper`、
`cameraPicker`），并去你机器上找 DevEco 安装位置与 HarmonyOS SDK。

你那边 DevEco 在更新，让我等；更新完成后继续。之后你把报错贴回来，我逐条修：

1. `Can not find build config file build-profile.json5 at 'entry'`；
2. `arkts-no-any-unknown`（ArkTS 禁用 any/unknown，要显式类型）出现在 `PatternExporter.ets`；
3. `Property 'getPixelMap' does not exist on type 'OffscreenCanvas'`。

最后你问「想在华为手机上安装这个该怎么弄」「不能用 apk 装吗」。我的答复要点：
**HAP 与 APK 是两套东西**——纯血鸿蒙（HarmonyOS NEXT）只能装 HAP，安卓/老鸿蒙只能装 APK，
鸿蒙 NEXT 已去掉安卓兼容层、装不了 APK。而你桌面 `pindou\pindou.apk`、`pindou\软件\*.apk`
就是现成的安卓版，可以直接传手机安装。

### 8. Claude Code：安全劝阻 + 硬核排障（09-25）

你朋友分享了一个 GitHub release，你想下载。我先做了**风险劝阻**：那是别人重新打包的修改版，
不是官方原版，可能偷文件/账号、可能把 API Key 发到第三方、可能导致封号，建议先别下载别运行，
并追问你的真实目的（是想用工具 / 只是朋友让下 / 有具体项目要做）。

确认后转入排障：那东西启动即崩。我一路挖到 **Node 内置 `localStorage` 与 `--localstorage-file`
在不同 Node 版本下的行为差异**（对比了 nvm 的 node24 与 Program Files 下的 node26），
并写了 `pty-repro.cjs`——**在真实 TTY 下**用 node-pty 复现交互式启动路径，跑一个 Node 运行时/开关的矩阵。

**这条最后卡住了**：ConPTY 需要命名管道，被 DSH 沙箱拦下，我提出**一次性提权**跑那条精确命令，
日志截到这一句就结束了。所以这件事**没有收尾**。

### 9. 五篇 VLN 论文：最近的大活（10-15 ~ 10-16）

你 @ 了 5 份 PDF：LagMemo、UnitedVLN、VoLo、3D Gaussian Map with Open-Set Semantic Grouping for VLN、
TOWARDS PHYSICALLY EXECUTABLE 3D GAUSSIAN for embodied navigation。

我的流水线：

1. **自己写抽取脚本**（[extract_pdf.py](extract_pdf.py) → [extract_pdf2.py](extract_pdf2.py)），
   把 5 份 PDF 转成纯文本落到 `pdftext2\`；
   途中处理了 GBK 解码、图内二进制乱码、单词空格缺失、表格数字粘连等问题；
2. **开 4 个子代理并行精读**（UnitedVLN / VoLo / 3D Gaussian Map / 3D Gaussian for embodied navigation），
   每个都要求"用 offset/limit 分段覆盖全文"、"标注**原文提取不清**、**不许编造**"、
   按固定 7 段结构输出（标题作者 / 动机 / 方法 / 贡献 / 实验 / 局限 / 一句话点评）；
3. 我自己读 LagMemo，再汇总成横向对照表，输出
   [五篇论文概括.md](五篇论文概括.md)（约 28 KB），**每个数字都带【可信】/【存疑】/【推断】三级标注**——
   因为自动抽取的表格数字有粘连风险，我明确写"建议回看原 PDF 后再引用"。

你随后说「你概括的内容呢？」「用通俗一点的语言概括」，于是又出一版大白话：
把 3D Gaussian Splatting 讲成"用几十万个半透明彩色小雾团把房间糊出来"，
五篇的分工归为——两篇改地图（LagMemo、3D Gaussian Map）、一篇改未来观测的渲染（UnitedVLN）、
一篇改训练与评测底座（SAGE-3D）、一篇跳出导航去改策略之上的编排层（VoLo）。

### 10. 本次复盘（10-16）

你问「根据我和你的所有历史对话，详细概况我用你干了点什么」。
我解压了 49 份多帧 zstd 会话日志，重建了上面的全部内容，生成的临时目录已删除。

---

## 三、几个你可能忘了的事实

1. **断点续传会把一个会话切成多个文件**——49 个 session 文件其实只有 37 段独立对话，
   `Review the inherited completed checkpoint now.` 是系统注入的，不是你打的字。
2. **你换过模型也换过模式**：deepseek-v4-pro / v4-flash / gpt-5.5 / gpt-5.6-sol / luna；
   standard 30、fastctx 15、cordis 4。
3. **FastCtx 模式是我在你机器上留下的唯一"基础设施级"改动**，而且是可回滚的用户级 preset，
   没有碰 `D:\DSH\DSH Desktop\resources\app` 里的任何内置文件。
4. **两次我明确拒绝或劝阻过**：一次是劝你别下第三方重打包的 Claude Code；
   一次是鸿蒙那边告诉你 HAP 装不进安卓手机、别指望转成 APK。
5. **有一条能力边界当时就说明过**：我看不到你发的截图（视觉模型未配置 / 模型不支持读图），
   所以头像那条线只能靠你的文字描述来调提示词。

---

## 四、未收尾的事

| 事项 | 卡在哪 | 下一步 |
|---|---|---|
| Claude Code 启动崩溃 | ConPTY 需命名管道，被沙箱拦截，等一次提权 | 批准后重跑那条精确命令，或改 `stdio: 'inherit'` 结构绕开 |
| 鸿蒙拼豆装机 | 不知道你手机是纯血鸿蒙还是安卓 | 报「设置 → 关于手机」系统版本，我判断装 HAP 还是 APK，必要时调低 `compatibleSdkVersion` |
| 练习目录里的 HTML 速查 | 09-25 之后新增，非本会话产物 | 若需要我接手维护/续写，把目标告诉我 |

---

## 五、附：本次复盘用到的日志路径与提取方法

- 会话日志根目录：`C:\Users\19800\AppData\Roaming\dsh-desktop\harness\sessions\`
- 每个 session 是一个目录，内含 `session.jsonl.zstd` 或 `session.v4.jsonl.zstd`
- **这些文件是多帧 zstd 流**：`zlib.zstdDecompressSync()` 只返回第一帧（往往就一行 session 头），
  必须按魔数 `28 B5 2F FD` 切分成独立帧后逐帧解压，才能拿到完整记录
  （49 个文件切出 200~900 帧不等，全部解压零失败）
- 记录类型（v0 / v4 两代格式并存）：`session`、`user/message`、`assistant/message`、`tool/call`、
  `tool/result`、`session/title`、`deliverables/presented`、`goal/change`、`todo/write`、`turn/start` 等
- 注意两代格式的内容位置不同：v4 的文本在 `data.content`，v0 在 `data.message.content`

