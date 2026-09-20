---
name: facebetter-customer-docs
description: >-
  Writes and reviews Facebetter SDK developer docs for external customers.
  Use when creating, updating, rewriting, or auditing Mintlify pages in fb-docs
  (*.mdx), platform guides, API reference, intro/license/overview/pricing,
  or when the user mentions 文档, docs, Mintlify, or customer-facing SDK documentation.
---

# Facebetter 对外客户文档

文档仓库：本仓（Mintlify）。英文在仓库根，其他语言在 `zh/`、`ja/`、`ko/`、`es/`、`pt-BR/`，树结构一致。


聊天用中文回复用户；文档正文按页面语言写。未要求时不要 commit。

## 读者

外部接入客户。写「怎么用公开 API」，不写「引擎内部怎么做」。

## 工作流

1. 以各平台**公开绑定层**为准（ObjC / Java / JS `facebetter` / Dart / C++ `BeautyEffectEngine`），不要把 C/JNI/WASM 实现写进客户文案。
2. 枚举只维护 `intro/makeup.mdx` 与各语言目录下的对应页，平台页链接过去。
3. 鉴权只维护 `intro/license.mdx` 与各语言目录下的对应页，平台页摘要并链接。
4. 所有已上线语言一起改（en / zh / ja / ko / es / pt-BR）。
5. 写完前 grep 禁止词（见下）。有命中则改成对外表述或删除。

## 禁止出现（除非是客户必须捕获的公开符号）

| 不要写 | 对外怎么写 |
| --- | --- |
| WebAssembly / WASM / WebGL 架构 | JavaScript SDK；浏览器里初始化引擎 |
| Cloudflare / 边缘 KV | 鉴权 API / 你的服务器代理 |
| gpupixel / MNN / 着色器 / 管线实现 | GPU 加速（产品能力即可） |
| `fb_engine_*` / `fb_status_t` / C 句柄 / FFI | 对应平台的公开类与方法 |
| `facebetter-core` / `fb_process_texture` | `BeautyEffectEngine` / `FacebetterPlugin.processTexture` |
| compact JWS / 紧凑 JWS | 许可证 token、`{token}` JSON、离线 `.lic` |
| 原生句柄为 0 / 内部任务队列 / 空实现 | 未初始化、已释放、不支持该路径 |
| `.fbpack` / 预加载 / 热加载 | `.fbd` 路径或字节；下一帧生效 |
| 1.x API（`setBeautyParam`、`registerFilter`、`ProcessMode`、ObjC 单例） | 只写 2.0 专用 setter |

公开错误码（如 JS `'WASM_LOAD_ERROR'`）可以出现在表格里，说明写成「SDK 加载失败」，不要解释 WASM。

## 必须保留的对接约定

这些不是八卦，客户不写就接不上：

- 原生 OpenGL / `externalContext`（含 Flutter TRTC：在 GL 线程调 `processTexture`）
- Web：`licenseToken`（create 前由你的服务器换好）；**不要**把 `appKey` 放进前端；可给服务端 HMAC 换 token 示例
- 随包提供运行时资源（Web 由 SDK 在 `init()` 时加载；`onProgress` 为下载进度）
- Android Direct `ByteBuffer`；混淆时保留 native 方法
- 控制台绑定 Bundle ID / 包名 / 域名（命令行工具绑定进程名）

## 2.0 口径

- 本站只文档 **SDK 2.0.0**，不要写 1.x 兼容说明或头文件过渡期
- 皮肤：`setSmoothing` / `setWhitening` / `setSharpening` / `setRosiness` / `setBeautySkinOnly` + 风格预设
- 美型：26 项，强度 `[-1.0, 1.0]`
- 美体：7 项，强度 `[0.0, 1.0]`。需要可选包 `resource_body.fbd`，先 `AddResourcePack` / `addResourcePack`
- 美妆：强度 + Style + Color
- 滤镜/贴纸：`setFilter` / `setSticker`（`.fbd` 路径或字节）+ `clear*`
- 虚拟背景：虚化 / 换图 / 色键；关键点运行时 **111**
- 统计：`getStats()`；帧类型：`FrameType.Image` / `Video`
- 错误码：`0` 成功，`-1` 参数，`-2` 未初始化，`-3` 授权，`-4` 不支持，`-5` IO，`-6` 槽位，`-7` 处理失败，`-8` 内存
- Flutter：`FBEngine.create`，不是单例
- 平台：iOS 12+、Android 7.0 API 24、macOS 10.15+；不要写 HarmonyOS
- 套餐与水印以 `intro/pricing.mdx` 为准，不要凭记忆改价格文案
- **没有按量付费**。不要写 metered / pay-as-you-go / 资源包分钟数，也不要写「不开放新购、已有订阅继续」。计费只有月付和年付

## 发布前自检

```bash
rg -n -i 'WebAssembly|WASM|WebGL|Cloudflare|gpupixel|\\bMNN\\b|fb_engine_|fb_status|facebetter-core|compact JWS|紧凑 JWS|fbpack|setBeautyParam|registerFilter|ProcessMode|metered|按量|pay-as-you-go' \
  --glob '*.mdx' .
```

`'WASM_LOAD_ERROR'` 允许留在 Web 错误处理页。
