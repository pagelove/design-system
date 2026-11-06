# Responsive acceptance record

Status: not run. Replace every placeholder with actual evidence; an empty row is not a pass.

- App/build or commit:
- Reviewer and date:
- Browser/version, OS, device or emulation:
- Design/mode and locale/font loading:
- Required widths: 320, 375, 768, 1024, 1280, 1768 CSS px; add each component transition ±1px.

| Viewport / container width | Screen / component state and realistic content | Text size / actual zoom / spacing / direction | Automated result and flags | Screenshot | Opened and visually inspected by | Result, revision or explicit exception |
| --- | --- | --- | --- | --- | --- | --- |
| Not run | Populated / long content | Not run | Not run | None | Nobody | Pending |
| Not run | Edit / validation / pending | Not run | Not run | None | Nobody | Pending |
| Not run | Detail / secondary view | Not run | Not run | None | Nobody | Pending |
| Not run | Menu / dialog / bulk actions | Not run | Not run | None | Nobody | Pending |
| Not run | Empty / recovery | Not run | Not run | None | Nobody | Pending |

Record keyboard/focus and dialog recovery results. List every actual breakpoint and inspected neighboring width. State which screenshot subsets were inspected if captures exceed review coverage. For exceptions, name the element and width/state, explain the intentional behavior and link evidence. Do not use editorial/game exceptions to excuse clipping or lost interaction.

Remaining untested widths/states, actual zoom, devices, assistive technology or languages:

Final decision: pending. Responsive acceptance requires the [visual gate](../docs/responsive.md#visual-acceptance-gate), not only a page-overflow pass.
