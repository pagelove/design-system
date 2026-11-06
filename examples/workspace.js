const catalog = window.designCatalog;
const $ = selector => document.querySelector(selector);
const designSelect = $('#design'), modeSelect = $('#mode');
const collections = [...document.querySelectorAll('[data-collection]')];
for (const design of catalog.designs) designSelect.add(new Option(design.name, design.id));
let currentScreen = 'overview', currentCollection = 'fieldnotes';
const collectionById = id => collections.find(el => el.dataset.collection === id);
function applySelection() {
  const params = new URLSearchParams(location.search);
  const {design,mode}=window.DesignSelection.resolve(catalog,params.get('design'),params.get('mode'));
  designSelect.value = design.id;
  modeSelect.replaceChildren(...design.modes.map(m => new Option(m[0].toUpperCase() + m.slice(1), m)));
  modeSelect.value = mode;
  modeSelect.disabled = design.modes.length === 1;
  document.documentElement.dataset.design = design.id;
  document.documentElement.dataset.theme = mode;
  currentScreen = ['overview','project','settings'].includes(params.get('screen')) ? params.get('screen') : 'overview';
  currentCollection = collectionById(params.get('collection')) ? params.get('collection') : 'fieldnotes';
  document.querySelectorAll('[data-page]').forEach(el => el.hidden = el.dataset.page !== currentScreen);
  collections.forEach(el => el.hidden = el.dataset.collection !== currentCollection);
  document.querySelectorAll('[data-screen]').forEach(a => {
    const collection = a.dataset.collectionLink || currentCollection;
    a.href = `?design=${design.id}&mode=${mode}&screen=${a.dataset.screen}&collection=${collection}`;
    if (a.closest('nav') && a.dataset.screen === currentScreen) a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });
  $('#guide').href = `../designs/${design.id}/.stitch/${mode}.DESIGN.md`;
  $('#components-link').href = `catalog.html?design=${design.id}&mode=${mode}`;
  $('#quality-link').href = `quality.html?design=${design.id}&mode=${mode}`;
  const title = currentScreen === 'project' ? collectionById(currentCollection).querySelector('h1').textContent : currentScreen[0].toUpperCase() + currentScreen.slice(1);
  document.title = `${title} · ${design.name} · Studio`;
}
function navigate(url, focus = false) {
  try { history.pushState(null,'',url); } catch { location.href = url; return; }
  applySelection();
  if (focus) { $('#main').focus(); window.scrollTo(0,0); }
}
designSelect.addEventListener('change', () => navigate(`?design=${designSelect.value}&screen=${currentScreen}&collection=${currentCollection}`));
modeSelect.addEventListener('change', () => navigate(`?design=${designSelect.value}&mode=${modeSelect.value}&screen=${currentScreen}&collection=${currentCollection}`));
document.querySelectorAll('[data-screen]').forEach(a => a.addEventListener('click', e => {
  if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault(); navigate(a.href, true);
}));
window.addEventListener('popstate', applySelection);
function filterItems(collection, announce = true) {
  let count = 0;
  const query = collection.querySelector('[data-search]').value.trim().toLowerCase();
  collection.querySelectorAll('[data-items] > article').forEach(row => {
    row.hidden = !row.querySelector('h3').textContent.toLowerCase().includes(query);
    if (!row.hidden) count++;
  });
  collection.querySelector('[data-empty]').hidden = count !== 0;
  collection.querySelector('[data-count]').textContent = `${count} shown`;
  if (announce) collection.querySelector('[data-search-status]').textContent = `${count} ${collection.dataset.plural} found.`;
}
// The collection articles are authoritative. Counts and overview summaries are derived views.
function updateSummaries() {
  let reviews = 0;
  for (const collection of collections) {
    const items = [...collection.querySelectorAll('[data-items] > article')];
    const ready = items.filter(row => row.querySelector('.pill').textContent === 'Ready').length;
    reviews += items.filter(row => row.querySelector('.pill').textContent === 'Review').length;
    collection.querySelector('[data-progress]').textContent = `${ready} of ${items.length} ready`;
    const card = document.querySelector(`.collection-card[data-collection-link="${collection.dataset.collection}"]`);
    card.querySelector('p').textContent = `${items.length} ${collection.dataset.plural} · Local preview`;
    if (collection.dataset.collection === 'fieldnotes') {
      $('#feature-progress-label').textContent = `${ready} of ${items.length} stories ready`;
      $('#feature-progress').max = Math.max(1, items.length);
      $('#feature-progress').value = ready;
      $('#feature-progress').setAttribute('aria-label', `${ready} of ${items.length} stories ready`);
    }
  }
  $('#review-total').textContent = String(reviews).padStart(2,'0');
}
const dialog = $('#story-dialog');
for (const collection of collections) {
  collection.querySelector('[data-search]').addEventListener('input', () => filterItems(collection));
  collection.querySelector('[data-clear-search]').addEventListener('click', () => {
    collection.querySelector('[data-search]').value = ''; filterItems(collection); collection.querySelector('[data-search]').focus();
  });
  collection.querySelector('[data-add-item]').addEventListener('click', () => {
    $('#dialog-collection').textContent = collection.querySelector('h1').textContent + ' / New ' + collection.dataset.noun;
    $('#item-title-label').textContent = collection.dataset.noun[0].toUpperCase() + collection.dataset.noun.slice(1) + ' title';
    $('#story-title').setCustomValidity('');
    dialog.showModal(); $('#story-title').focus();
  });
  filterItems(collection, false);
}
$('#cancel-story').addEventListener('click', () => dialog.close());
$('#story-form').addEventListener('submit', e => {
  e.preventDefault();
  const title = $('#story-title').value.trim();
  if (!title) { $('#story-title').setCustomValidity('Enter a title.'); $('#story-title').reportValidity(); return; }
  const collection = collectionById(currentCollection), list = collection.querySelector('[data-items]');
  const article = document.createElement('article'), number = document.createElement('span'), body = document.createElement('div'), heading = document.createElement('h3'), description = document.createElement('p'), status = document.createElement('span');
  article.id = currentCollection + '-item-' + (list.children.length + 1);
  number.className = 'story-number'; number.textContent = String(list.children.length + 1).padStart(2,'0');
  heading.textContent = title; description.textContent = $('#profile-name').textContent + ' · New draft';
  status.className = 'pill'; status.textContent = 'Draft';
  body.append(heading, description); article.append(number, body, status); list.prepend(article);
  collection.querySelector('[data-search]').value = ''; filterItems(collection); updateSummaries();
  $('#story-form').reset(); dialog.close();
});
$('#story-title').addEventListener('input', () => $('#story-title').setCustomValidity(''));
const form = $('#settings-form');
const snapshot = () => JSON.stringify([...new FormData(form).entries()]);
let savedSnapshot = snapshot(), pending = null;
function clearErrors() {
  for (const id of ['name','email']) { $('#' + id).removeAttribute('aria-invalid'); $('#' + id + '-error').hidden = true; }
}
function showProfile(name) {
  $('#profile-name').textContent = name;
  document.querySelectorAll('[data-profile-name]').forEach(el => el.textContent = name);
  const initials = name.split(/\s+/).slice(0,2).map(part => [...part][0] || '').join('').toUpperCase();
  document.querySelectorAll('[data-profile-initials]').forEach(el => el.textContent = initials);
}
function applyReadingPreferences() { document.documentElement.dataset.motion = $('#motion').value; document.documentElement.dataset.textSize = $('#reading-size').value; }
function updateDirtyState() {
  const dirty = snapshot() !== savedSnapshot;
  $('#save').disabled = pending !== null || !dirty;
  $('#save-status').textContent = pending !== null ? 'Updating the submitted preferences. Newer edits will remain unsaved.' : dirty ? 'You have unsaved changes in this preview.' : 'Your preferences are up to date in this preview.';
}
form.addEventListener('input', updateDirtyState);
form.addEventListener('change', updateDirtyState);
$('#motion').addEventListener('change', applyReadingPreferences);
$('#reading-size').addEventListener('change', applyReadingPreferences);
form.addEventListener('submit', e => {
  e.preventDefault(); if (pending !== null) return;
  clearErrors();
  const invalid = ['name','email'].filter(id => !$('#' + id).value.trim() || !$('#' + id).checkValidity());
  if (invalid.length) {
    invalid.forEach(id => { $('#' + id).setAttribute('aria-invalid','true'); $('#' + id + '-error').hidden = false; });
    $('#save-status').textContent = 'Check the highlighted fields.'; $('#' + invalid[0]).focus(); return;
  }
  const submitted = snapshot(), name = $('#name').value.trim();
  $('#save').disabled = true; $('#save').setAttribute('aria-busy','true'); $('#save').textContent = 'Saving…';
  $('#save-status').textContent = 'Updating this preview…';
  pending = setTimeout(() => {
    pending = null; savedSnapshot = submitted; showProfile(name);
    $('#save').removeAttribute('aria-busy'); $('#save').textContent = 'Save preferences';
    const newerEdits = snapshot() !== savedSnapshot;
    $('#save').disabled = !newerEdits;
    $('#save-status').textContent = newerEdits ? 'Submitted preferences saved. Your newer edits are still unsaved.' : 'Preferences saved in this preview. Reloading restores the original values.';
  }, 650);
});
form.addEventListener('reset', () => {
  clearTimeout(pending); pending = null; clearErrors(); showProfile('Alex Lee');
  $('#save').removeAttribute('aria-busy'); $('#save').textContent = 'Save preferences';
  // The native reset updates form values after the reset event.
  queueMicrotask(() => { savedSnapshot = snapshot(); applyReadingPreferences(); $('#save').disabled = true; $('#save-status').textContent = 'Original preview preferences restored.'; });
});
applySelection(); updateSummaries(); updateDirtyState(); applyReadingPreferences();
