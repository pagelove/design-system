# Document-first development for applications

Adapted from Pagelove, *Document-first development for websites and applications*, edition 2.4 (2026). Changes: condensed and reorganized for a public design system; platform-specific evidence, operations, private examples and internal references omitted. This adaptation is CC BY 4.0: https://creativecommons.org/licenses/by/4.0/. Distributed source: https://github.com/pagelove/design-system/blob/main/docs/document-first.md.

## Model the information before the interface

Identify the entities, relationships and operations that matter to the user. Prefer semantic HTML for document-based domain information and the live DOM as its editable client working model. Make meaningful resources independently understandable and addressable through stable IDs or URLs. Addressability does not imply public access.

An article, catalog record, workflow item, scene or quest can be a bounded document resource. A document is not a requirement to create one file per object or use a specific database. Transactions, binary assets, simulation buffers and established external systems can retain more suitable representations.

## Declare authority

For every value, identify whether it is authoritative, derived, cached, a local draft, pending confirmation, accepted or historical. Name the owner, schema/version, allowed operations and persistence boundary. Do not keep independently editable HTML and JSON copies of the same domain fields. Derived views must be rebuildable from their declared source.

This repository's JSON token files are a justified design-tool interchange format. They describe design values rather than replacing document-based app content. JSON transport envelopes, receipts and revision metadata likewise do not create another editable domain authority.

Choose aggregate boundaries that support the required consistency. Shared constraints across several records need a transaction, enforced operation or explicit recovery policy that actually provides the promised guarantee.

## Separate meaning, appearance and behavior

Use headings, lists, tables, articles, forms and native controls to express meaning. Apply visual styles through tokens and CSS. Attach behavior through named commands, scoped bindings and documented events/results. Keep temporary menus, focus state and selection overlays outside persisted content unless they are deliberate domain values.

An editor is a view over the model. Identify its source resource and exact editable root. Read the current form-control properties when serializing: HTML attributes and `outerHTML` alone do not necessarily contain the current input, checkbox or selection values. Validate bounded values and preserve allowed nested structure. Do not replace a complete resource with a partial extracted fragment.

Composed views must retain provenance: identify their source and supported mutation target. If origin or permission is ambiguous, keep the view read-only. Check actual platform capabilities before relying on routing, composition, subscriptions or declarative schemas.

## Enforce writes where they become durable

Client-side constraints improve experience but do not establish authorization, uniqueness or trusted shared results. Establish which actual read/write path checks actor permissions, shape, ownership, references and invariants. A trusted authoring endpoint can have a different contract from an application mutation endpoint.

For concurrency, use supported atomic conditional writes, revision checks or a suitable transaction. On a conflict, keep the user's draft and explain compare/reload/reapply choices. Do not silently overwrite current accepted data or retry a consequential action with an unknown outcome.

Freeze a pending command's identity and payload while it is in flight. Retrying the same intent should follow a declared duplicate/receipt policy. Distinguish a local save, queued request, server acceptance and external delivery. A timeout is not proof of failure or success; reconcile against supported receipts before resubmitting an irreversible operation.

## Design recovery

Define behavior for refresh, back/forward navigation, account changes, loss of connectivity, stale revisions and interrupted writes. Scope local storage/queues to the actor and resource. Preserve unsent work; clearly label offline drafts. Incoming changes must not silently overwrite dirty work or trigger an outgoing save loop. Specify subscription gaps, reset and reconnection behavior.

Release code separately from user-managed content. Version stored formats, define compatibility and validate before switching readers. Test restoration or forward repair for consequential changes. A backup is not verified until an isolated restore succeeds.

## Keep the experience usable

Provide a useful reading experience without unnecessary JavaScript. Preserve native controls, keyboard paths, visible focus, field errors and status. Show data freshness when it affects decisions. Explain empty, loading, partial, stale, denied and failed states with a useful next action.

Measure the workload before choosing an optimization: document size, network, layout, painting, query work, simulation and graphics can have different bottlenecks. Keep efficient specialized runtimes where appropriate; avoid forcing every transient value into the DOM. Use summaries, pagination and bounded work when they improve the actual task.

## Apply the guide proportionately

1. Scope the feature and select its application profile.
2. Choose the HTML/DOM default or record a concrete representation exception.
3. Define resources, stable IDs, authority, formats and supported operations.
4. Establish actual enforcement with a valid case and a case that must be rejected.
5. Implement the scoped view/editor and explicit behavior.
6. Handle applicable drafts, conflicts, retries, incoming changes and recovery.
7. Verify exact operation paths separately from browser task behavior.
8. Report changes, evidence, exceptions and remaining gaps.

## Application profiles

| Profile | Additional focus |
| --- | --- |
| Publishing and documentation | Readable semantic content, navigation, metadata, progressive enhancement |
| Catalogs and directories | Stable record IDs, filtering, useful no-results, source provenance |
| Analytics and dashboards | Units, aggregation windows, freshness, accessible table alternatives |
| Workflows and transactions | Permissions, bounded operations, concurrency, receipts and recovery |
| Editors and creative tools | Scoped bindings, draft safety, undo, import validation and round-trip fidelity |
| Games and simulations | Authored content vs runtime state, responsive controls, checkpoints and bounded rendering |

## Exception record

Record the requirement, why HTML/DOM is unsuitable, owner, authoritative representation, derivation/reference relationship, validation and recovery. Required external JSON integration or specialized simulation buffers can justify an exception. A preference for duplicating editable data does not establish one.

## Evidence and completion

Maintain a compact record of the changed revision, environment, operation, actor, expected result, actual result and limitation. Check validation, rejection, concurrency and restoration where applicable. Separately inspect keyboard tasks, responsive layout, control prefill/current values and browser recovery. Mark each applicable check pass, fail, pending or not applicable with a reason. A local fixture does not prove deployment behavior, and a screenshot does not prove an entire task.
