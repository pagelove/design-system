# Component contracts

The [catalog](../examples/catalog.html) is an offline-capable HTML/CSS reference with optional local preview interactions. [components/index.mjs](../components/index.mjs) exports escaped HTML helpers. It does not connect persistence or services. All user-supplied strings are escaped; helpers validate variants and require visible field/choice labels. Load [styles/app.css](../styles/app.css) once.

## Buttons and icon buttons

Use a native button for an action, with an explicit type. Use an anchor with a meaningful destination for navigation. `pl-button` supports strong, regular, light, outlined, outlined-gradient, borderless and borderless-gradient appearances, with lg/md/sm/xs sizes. Icon buttons add `pl-button--icon`; squared buttons add `pl-button--square`.

Represent default, hover, pressed, focus, disabled, loading and skeleton states. Focus must remain visible. Disable a pending action when duplicate activation is invalid and keep an accessible label while its appearance changes. Skeletons are placeholders, not actionable unlabeled controls. Every icon-only action needs an accessible name describing its purpose. The recommended app layer expands small library sizes to at least 44px targets. It does not change the foundation scale.

## Links

Use `pl-link--default` for standalone links and `pl-link--inline` for links in prose. Native underline, visited state, focus and useful link text matter more than decorative icons. Do not make a disabled-looking anchor navigate unexpectedly; if there is no destination, describe availability as text.

## Fields: basic, password and phone

Use `pl-field` with a visible label, `pl-field__control`, `pl-field__input` and an optional `pl-field__hint`. Labels reference a stable unique input ID. Associate hints and errors with `aria-describedby`; set `aria-invalid="true"` for an invalid value. Do not substitute placeholder text for a label. Keep a value when validation fails and explain the correction.

Use native input types and appropriate autocomplete/inputmode. Password fields use the browser's `type="password"` rather than a second string masked with asterisks; changing visibility keeps the same underlying value. The catalog provides a named visibility button with pressed state. Do not log or store passwords in a component demo. Phone input accepts an international number; a country selector is optional and must not silently reinterpret stored data. Actual phone verification requires a separate service contract.

## Verification codes and segmented PIN

The source library includes segmented PIN cells, 4–8 digits, with empty/incorrect error feedback. This repository recommends one native input with numeric input mode, one-time-code autocomplete and a visible digit-count hint. It preserves paste, autofill and a single accessible name without custom key movement. This is an intentional adaptation, not a claim to reproduce the original segmented interaction.

If implementing segmented cells, define paste distribution, backspace, selection, focus order, error clearing and current-value serialization. Keep an equivalent accessible single-field route. A component only collects a code; it does not establish its validity or security.

## Checkbox, radio and switch

Use native checkboxes for independent selections; a group can use a fieldset and legend. Use same-name native radio buttons for exclusive selections, with one group legend. A switch uses a native checkbox with `role="switch"` for a labeled setting; state must remain available to assistive technology. Labels form part of the target.

The library supports left/right labels and top-aligned switch labels, plus disabled/loading/skeleton appearances. A loading appearance alone must not leave an action repeatable when the operation needs duplicate protection. Native states and application acceptance remain distinct. Keep skeleton labels present or provide a named loading region rather than interactive placeholders.

## Progress indicators

Indeterminate progress has a name and no invented percentage. Determinate progress has bounds and an actual value. The source library includes radial sizes xxs/xs/sm/md/lg/xl (16/24/32/40/48/56px) and progress/done/error presentations. Adjacent visible text must explain completion or failure and the available next action.

The helper provides a radial determinate indicator; the catalog also demonstrates native `progress`. Clamp numeric values to the supported range and reject non-finite values. Progress reaching 100% is evidence only for the measured operation, not proof of external delivery. Reduced-motion mode stops decorative spin while preserving the loading label.

## Integration limits

React, Vue and Svelte files are small usage examples, not compiled framework packages. Native Swift/Kotlin outputs are dictionaries of CSS strings, not platform colors, dp/sp or SwiftUI views. The library's CSS is preserved separately; the recommended app layer makes documented readability, target-size, native-input and reduced-motion adaptations. Consult [the source inventory](../reference/library-inventory.json) for every observed public story and variant.

Pending button helpers and framework examples preserve the supplied action label and append an in-progress indication. Skeleton helper buttons remain disabled and retain an explicit accessible name even when their visual text is hidden. Framework examples still require compilation and integration tests in the consuming application.

## Reusable interaction patterns

components/patterns.mjs exports select, textarea, notice, disclosure, breadcrumbs, tabs, confirmation, errorSummary, enhancePatterns and openConfirmation. Import it as a JavaScript module over HTTP; load styles/patterns.css after the selected theme. All content arguments are plain text and escaped. IDs must be unique within the consuming document. Breadcrumb URLs accept HTTP or relative destinations and reject executable schemes.

Tabs require a nonempty items array of label/text objects and use immediate activation; do not use them for slow network-loaded panels without changing the activation contract. Call enhancePatterns once on a mounted root and retain its cleanup function. Confirmation uses native dialog: openConfirmation(dialog, trigger) restores focus on close; the safe Cancel action has initial focus. Use disclosure for supplementary content, never to hide required instructions. Notice supports polite status and urgent alerts; avoid nested live regions in consuming apps.

The patterns fixture demonstrates a captioned sortable table and bounded pagination using DOM-backed records, plus a complete form-error summary and recovery flow. These compositions can be copied and adapted; they are not a server-backed grid API. Every helper and composition remains Preview until the documented browser/AT acceptance matrix is complete.
