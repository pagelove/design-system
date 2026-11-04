# Game and simulation experience

Adapted from Pagelove contributors, *Web Game Development Handbook*, edition 2.14.0 (2026), MIT licensed. This public summary selects reusable interaction, architecture, performance and recovery guidance; project-specific integrations and operational references are omitted. See LICENSE.

## First playable experience

State the player's goal, controls and win/loss conditions before play. Start with a complete small journey: start, act, understand feedback, pause, resume, reach a result and retry or continue. Make the next action clear. Give immediate visible feedback; optional music, effects and haptics supplement it. Do not claim that passing technical checks establishes enjoyment.

Introduce mechanics through a short safe first action or optional help. Returning players should be able to find controls again without replaying a long tutorial. Keep score, completion and earned rewards distinct. Describe which result is local and which is accepted by a shared service.

## State and content

Separate authored levels/rules, runtime simulation, rendered output, player preferences and durable progress. Prefer semantic HTML for document-based authored content and DOM-backed editing. Use a specialized runtime representation for simulation where justified; preserve stable source identity and a declared rebuild/conversion path.

Keep test play separate from authoring. A test run should not silently publish a level, consume real inventory or submit a ranked score. Validate imported content before applying it atomically. Undo and checkpoints must refer to compatible rules/content versions. Define what a checkpoint includes and whether restore is all-or-nothing.

## Input and mobile layout

Use native DOM controls for menus, help and settings. Map keyboard, pointer and touch to the same validated actions. Provide selection/action alternatives to required dragging and avoid hover-only information. For ordinary discrete actions, activate once on click/release. Continuous held actions need explicit ownership and cancellation.

Track independent contacts by pointer ID when simultaneous actions are needed. Handle release, pointer cancellation, lost capture, focus loss, hidden pages, dialogs and removed controls. Cleanup must be idempotent; releasing one input source must not cancel another source's still-held action. Require fresh input after interruption when appropriate.

At the normal adopted scale, fit a bounded playfield, essential status and primary controls together so ordinary mobile play does not require page scrolling. Allow natural scrolling for help, forms and enlarged-text fallback. Do not disable browser zoom to meet the fit target. Account for safe-area insets, browser chrome, orientation and virtual keyboards. Resizing should not accidentally change physics or competitive field of view.

Frequent targets start at 44×44 CSS pixels; 48px targets with 8–12px separation can be useful for play controls. These are project defaults rather than universal web requirements. Separate restart, purchase and destructive actions from rapid play. Avoid global gesture suppression; scope any exclusive manipulation region narrowly.

## Feedback, accessibility and audio

Show selected, pressed, unavailable, cooldown, pending and rejected states with visible meaning. Preserve readable text and focus outside the playfield. Supply appropriate alternatives for motion, flashing, audio cues and time pressure. Keep essential help reachable while paused.

Audio starts through supported user activation and has separate music/effects controls when useful. Handle muted/denied playback without blocking progress. Bound active voices, decode work, loops and resource ownership. Pause or adapt audio when the document is hidden according to the declared game policy; never promise to pause an authoritative multiplayer world just because one client hides.

## Performance and resilience

Profile representative play before optimizing. Separate CPU simulation, layout, drawing, GPU work, compositing, asset loading and memory costs. Set frame/input/memory budgets for the supported environment, measure sustained play and cold effects, and record the measurement boundary. Device-pixel-ratio caps, batching, caching, lower effect quality and workers are conditional optimizations, not default requirements.

Keep render data derived. Dispose observers, listeners, timers, textures, buffers and audio nodes at clear lifecycle boundaries. A graphics-context loss or optional API failure needs a visible recovery path. Preserve meaningful progress through refresh/back/history return according to the game's save contract. Never label a local score as verified shared acceptance.

## Genre-specific emphasis

| Category | Essential checks |
| --- | --- |
| Arcade/action | Timing, collision clarity, independent inputs and fast retry |
| Platform/exploration | Camera, movement feedback, readable hazards and checkpoint restore |
| Puzzle/procedural | Solvability, deterministic seeds, hint policy and undo |
| Card/board/turn-based | Legal actions, turn ownership, hidden information and exact scoring |
| Narrative | Reading pace, branch persistence, accessible choices and localization |
| Rhythm | Declared timing/calibration, audio lifecycle and non-audio feedback |
| Asynchronous multiplayer | Versioned rules, duplicate commands, receipts and calendar/timezone boundaries |
| Real-time multiplayer | Server authority, disconnect behavior, reconciliation and bounded latency claims |

## Acceptance walkthrough

Test start/play/pause/resume/result/retry, then refresh or history return at meaningful points. Inspect portrait/landscape, short-height windows, keyboard-only operation, enlarged text, slow/offline behavior and optional audio/fullscreen denial. Real browser input establishes more than synthetic event dispatch, but desktop emulation does not prove actual phone behavior. Keep unsupported environment claims explicit.
