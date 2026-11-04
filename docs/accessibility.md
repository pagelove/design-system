# Accessibility and responsive behavior

Target WCAG 2.2 AA for the consuming application and evaluate complete tasks. This repository supplies patterns; it does not certify applications built from them. The standard is available at https://www.w3.org/TR/WCAG22/.

- Text generally needs 4.5:1 contrast; qualifying large text needs 3:1. Check actual backgrounds, alpha blending, gradients and every theme. Meaningful control boundaries and visual states need applicable non-text contrast. Decorative separators are a different case.
- Preserve semantic landmarks and heading order. Label fields and groups, name icon buttons, describe meaningful images, and hide decorative graphics from assistive technology.
- All actions need a keyboard path with visible focus. Dialogs require an appropriate focus lifecycle and escape/recovery behavior. Do not hide essential actions behind hover or a gesture alone.
- Associate errors with fields and describe a correction. Announce meaningful asynchronous status without making every progress tick a disruptive alert. Do not use color alone for status or selection.
- Use 44px targets as this design system's default for frequent controls. WCAG 2.2 AA's target-size criterion uses 24px with exceptions; the 44px criterion is AAA with its own exceptions. Design defaults and conformance rules are distinct.
- Reflow at 320 CSS pixels, preserve zoom and inspect 200% text enlargement. Tables or inherently two-dimensional content can have a deliberate scroll region with context; ordinary form controls and essential actions must remain reachable.
- Allow wrapping and long translated/RTL text. Use logical properties when practical. Do not rely on a font family declaration to guarantee that a particular font loaded.
- Honor reduced motion; keep visible feedback when animations stop. Avoid flashing and unnecessary autoplay. Audio needs a useful independent control and a non-audio path to essential meaning.
- Check browser contrast modes, pointer/keyboard switching, virtual keyboard occlusion and safe-area clearance. Desktop emulation is useful but does not prove physical-device behavior.

Run automated checks where available, then inspect the actual task separately. Record build, environment, input path, result and limits. Missing screen-reader or device evidence stays pending rather than becoming a pass.
