// The generated HTML remains a complete usable gallery without JavaScript.
document.querySelectorAll('.gallery-modes').forEach(group => {
  group.addEventListener('change', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.checked) return;
    const article = group.closest('[data-design]');
    const id = article.dataset.design;
    const mode = input.value;
    const name = article.querySelector('h2').textContent;
    article.dataset.theme = mode;
    const img = article.querySelector('img');
    img.src = `../designs/${id}/previews/workspace-${mode}.png`;
    img.alt = `${name} ${mode}: Studio overview with collections, activity and workspace navigation`;
    article.querySelectorAll('[data-preview-link]').forEach(link => {
      link.href = `workspace.html?design=${id}&mode=${mode}`;
      if (link.classList.contains('gallery-preview')) link.setAttribute('aria-label', `Open ${name} ${mode} app preview`);
    });
    article.querySelectorAll('[data-mode-guide]').forEach(link => {
      link.href = `../designs/${id}/.stitch/${mode}.DESIGN.md`;
    });
    article.querySelector('[role="status"]').textContent = `${name} ${mode} preview selected.`;
  });
});
