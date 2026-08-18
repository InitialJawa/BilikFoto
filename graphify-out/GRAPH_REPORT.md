# Graph Report - .  (2026-08-18)

## Corpus Check
- Corpus is ~21,087 words - fits in a single context window. You may not need a graph.

## Summary
- 140 nodes · 248 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 2,095 input · 1,024 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Package Config|Package Config]]
- [[_COMMUNITY_Layout & Canvas Rendering|Layout & Canvas Rendering]]
- [[_COMMUNITY_Camera & Audio|Camera & Audio]]
- [[_COMMUNITY_Customizer & Presets|Customizer & Presets]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Pattern & Drawing Utils|Pattern & Drawing Utils]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_Entry Point & HTML|Entry Point & HTML]]
- [[_COMMUNITY_Project Metadata|Project Metadata]]
- [[_COMMUNITY_OpenCode Plugin|OpenCode Plugin]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `CustomizationSettings` - 14 edges
3. `PhotoItem` - 13 edges
4. `scripts` - 6 edges
5. `getAudioContext()` - 6 edges
6. `playClickSound()` - 6 edges
7. `FilterType` - 5 edges
8. `LayoutCardItem` - 5 edges
9. `playStickerPopSound()` - 5 edges
10. `renderPhotoboothToCanvas()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `CustomizerSidebarProps` --references--> `CustomizationSettings`  [EXTRACTED]
  src/components/CustomizerSidebar.tsx → src/types.ts
- `CameraBoothProps` --references--> `PhotoItem`  [EXTRACTED]
  src/components/CameraBooth.tsx → src/types.ts
- `CameraBoothProps` --references--> `FilterType`  [EXTRACTED]
  src/components/CameraBooth.tsx → src/types.ts
- `ChooseLayoutProps` --references--> `CustomizationSettings`  [EXTRACTED]
  src/components/ChooseLayout.tsx → src/types.ts
- `ChooseLayoutProps` --references--> `LayoutCardItem`  [EXTRACTED]
  src/components/ChooseLayout.tsx → src/types.ts

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "Package Config"
Cohesion: 0.08
Nodes (23): dependencies, canvas-confetti, dotenv, express, @google/genai, lucide-react, motion, react (+15 more)

### Community 1 - "Layout & Canvas Rendering"
Cohesion: 0.20
Nodes (17): ChooseLayout(), ChooseLayoutProps, ExportModal(), ExportModalProps, PhotoStripCanvas(), PhotoStripCanvasProps, CustomizationSettings, DoodlePath (+9 more)

### Community 2 - "Camera & Audio"
Cohesion: 0.21
Nodes (15): CameraBooth(), CameraBoothProps, Header(), HeaderProps, generateSamplePhotos(), AppStep, FilterType, getAudioContext() (+7 more)

### Community 3 - "Customizer & Presets"
Cohesion: 0.16
Nodes (14): CustomizerSidebar(), CustomizerSidebarProps, TabType, DEFAULT_SETTINGS, FONT_OPTIONS, LAYOUT_CATALOG_CARDS, TEMPLATE_PRESETS, PRESET_STICKERS (+6 more)

### Community 4 - "TypeScript Config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 5 - "Pattern & Drawing Utils"
Cohesion: 0.15
Nodes (4): createProceduralPatternCanvas(), FRAME_SWATCHES, PatternSwatch, PhotoShape

### Community 6 - "Dev Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, esbuild, tailwindcss, tsx, @types/express, @types/node, typescript (+1 more)

### Community 8 - "Project Metadata"
Cohesion: 0.40
Nodes (4): description, majorCapabilities, name, requestFramePermissions

## Knowledge Gaps
- **51 isolated node(s):** `@opencode-ai/plugin`, `name`, `description`, `requestFramePermissions`, `majorCapabilities` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CustomizationSettings` connect `Layout & Canvas Rendering` to `Camera & Audio`, `Customizer & Presets`, `Pattern & Drawing Utils`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Package Config`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `@opencode-ai/plugin`, `name`, `description` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Config` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._