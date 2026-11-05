// Shared by classic-script previews, including local-file use. No fetch or framework required.
(function (scope) {
  function resolve(catalog, id, requestedMode) {
    const explicit = catalog.designs.find(design => design.id === id);
    const design = explicit || catalog.designs.find(design => design.id === catalog.defaultDesign);
    if (!design) throw new Error('The catalog default design is missing.');
    const fallback = explicit ? design.defaultMode : catalog.defaultMode;
    return {design, mode:design.modes.includes(requestedMode) ? requestedMode : fallback};
  }
  scope.DesignSelection = Object.freeze({resolve});
})(globalThis);
