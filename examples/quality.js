const catalog = window.designCatalog;
const $ = selector => document.querySelector(selector);
let design, mode;
for (const item of catalog.designs) $('#design').add(new Option(item.name, item.id));
let fontRun = 0;
async function inspectFonts() {
  const run = ++fontRun;
  $('#fonts').textContent = 'Checking fonts…';
  // Imported theme styles may still be loading when a deferred script starts.
  // Inspect computed families only after the document's styles have loaded.
  if (document.readyState !== 'complete') await new Promise(resolve => window.addEventListener('load', resolve, {once:true}));
  const style = getComputedStyle(document.body);
  const roles = [['Heading','--design-heading-family'],['Body','--design-body-family'],['Code','--font-family-code']];
  const results = [];
  for (const [role, property] of roles) {
    const family = style.getPropertyValue(property).trim().split(',')[0].replaceAll('"','').replaceAll("'",'');
    for (const weight of [400,500,600]) {
      let loaded = false;
      try {
        const faces = await document.fonts.load(`${weight} 24px "${family}"`, 'Ag0123');
        loaded = faces.length > 0 && faces.every(face => face.status === 'loaded');
      } catch { /* Display the failed font rather than treating a fallback as success. */ }
      const row = document.createElement('div'), label = document.createElement('strong'), sample = document.createElement('p');
      row.className = 'font-result';
      label.textContent = `${role} · ${family} ${weight} · ${loaded ? 'Loaded local font' : 'Font failed to load'}`;
      sample.textContent = 'A considered pace. 0123456789';
      sample.style.fontFamily = `"${family}"`; sample.style.fontWeight = String(weight);
      row.append(label, sample); results.push(row);
    }
  }
  if (run === fontRun) $('#fonts').replaceChildren(...results);
}
function inspectMotion() {
  document.documentElement.dataset.motion = $('#reduce-motion').checked ? 'reduce' : 'system';
  const duration = getComputedStyle($('#sample-action')).transitionDuration;
  const device = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('#motion-status').textContent = `Device preference: ${device ? 'reduced motion' : 'no reduction requested'}. Effective button transition: ${duration}.`;
}
function render() {
  document.documentElement.dataset.design = design.id; document.documentElement.dataset.theme = mode;
  $('#design').value = design.id;
  $('#mode').replaceChildren(...design.modes.map(m => new Option(m, m))); $('#mode').value = mode; $('#mode').disabled = design.modes.length === 1;
  $('#workspace').href = `workspace.html?design=${design.id}&mode=${mode}`;
  inspectFonts(); inspectMotion();
}
function readSelection(){const params=new URLSearchParams(location.search);({design,mode}=window.DesignSelection.resolve(catalog,params.get('design'),params.get('mode')));render();}
function select(id,requestedMode){({design,mode}=window.DesignSelection.resolve(catalog,id,requestedMode));const url=new URL(location.href);url.searchParams.set('design',design.id);url.searchParams.set('mode',mode);try{history.pushState(null,'',url);}catch{/* Local-file selection remains usable without history. */}render();}
$('#design').addEventListener('change',()=>select($('#design').value,null));
$('#mode').addEventListener('change',()=>select(design.id,$('#mode').value));
window.addEventListener('popstate',readSelection);
$('#reduce-motion').addEventListener('change', inspectMotion);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', inspectMotion);
$('#sample-action').addEventListener('click', () => { $('#action-status').textContent = 'Action confirmed locally.'; });
readSelection();
