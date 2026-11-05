const catalog=window.designCatalog;
const $=s=>document.querySelector(s);
const designSelect=$('#design'),modeSelect=$('#mode');
for(const design of catalog.designs)designSelect.add(new Option(design.name,design.id));
let currentScreen='overview';
function applySelection(){
 const params=new URLSearchParams(location.search);
 const design=catalog.designs.find(d=>d.id===params.get('design'))||catalog.designs.find(d=>d.id===catalog.defaultDesign);
 const mode=design.modes.includes(params.get('mode'))?params.get('mode'):(params.has('design')?design.defaultMode:catalog.defaultMode);
 designSelect.value=design.id;modeSelect.replaceChildren(...design.modes.map(m=>new Option(m[0].toUpperCase()+m.slice(1),m)));
 modeSelect.value=mode;modeSelect.disabled=design.modes.length===1;
 document.documentElement.dataset.design=design.id;document.documentElement.dataset.theme=mode;
 currentScreen=['overview','project','settings'].includes(params.get('screen'))?params.get('screen'):'overview';
 document.querySelectorAll('[data-page]').forEach(el=>el.hidden=el.dataset.page!==currentScreen);
 document.querySelectorAll('[data-screen]').forEach(a=>{a.href=`?design=${design.id}&mode=${mode}&screen=${a.dataset.screen}`;if(a.closest('nav')&&a.dataset.screen===currentScreen)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 $('#guide').href='../'+design.guide;$('#components-link').href=`catalog.html?design=${design.id}&mode=${mode}`;
 document.title=`${currentScreen[0].toUpperCase()+currentScreen.slice(1)} · ${design.name} · Studio`;
}
function navigate(url,focus=false){try{history.pushState(null,'',url);}catch{location.href=url;return;}applySelection();if(focus){$('#main').focus();window.scrollTo(0,0);}}
designSelect.addEventListener('change',()=>navigate(`?design=${designSelect.value}&screen=${currentScreen}`));
modeSelect.addEventListener('change',()=>navigate(`?design=${designSelect.value}&mode=${modeSelect.value}&screen=${currentScreen}`));
document.querySelectorAll('[data-screen]').forEach(a=>a.addEventListener('click',e=>{if(e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();navigate(a.href,true);}));
window.addEventListener('popstate',applySelection);applySelection();
function filterStories(){let count=0;const query=$('#search').value.trim().toLowerCase();$('#stories').querySelectorAll('article').forEach(row=>{row.hidden=!row.querySelector('h3').textContent.toLowerCase().includes(query);if(!row.hidden)count++;});$('#empty').hidden=count!==0;$('#story-count').textContent=`${count} shown`;$('#search-status').textContent=`${count} stories found.`;}
$('#search').addEventListener('input',filterStories);$('#clear-search').addEventListener('click',()=>{$('#search').value='';filterStories();$('#search').focus();});
const dialog=$('#story-dialog');$('#add-story').addEventListener('click',()=>{dialog.showModal();$('#story-title').focus();});$('#cancel-story').addEventListener('click',()=>dialog.close());
$('#story-form').addEventListener('submit',e=>{e.preventDefault();const title=$('#story-title').value.trim();if(!title){$('#story-title').setCustomValidity('Enter a story title.');$('#story-title').reportValidity();return;}const article=document.createElement('article'),number=document.createElement('span'),body=document.createElement('div'),heading=document.createElement('h3'),description=document.createElement('p'),status=document.createElement('span');number.className='story-number';number.textContent=String($('#stories').children.length+1).padStart(2,'0');heading.textContent=title;description.textContent='Alex Lee · New draft';status.className='pill';status.textContent='Draft';body.append(heading,description);article.append(number,body,status);$('#stories').prepend(article);$('#search').value='';filterStories();$('#story-form').reset();dialog.close();});
$('#story-title').addEventListener('input',()=>$('#story-title').setCustomValidity(''));
const form=$('#settings-form');let pending;
function clearErrors(){for(const id of ['name','email']){$('#'+id).removeAttribute('aria-invalid');$('#'+id+'-error').hidden=true;}}
form.addEventListener('input',()=>{$('#save-status').textContent='You have unsaved changes in this preview.';});
form.addEventListener('submit',e=>{e.preventDefault();clearErrors();const invalid=['name','email'].filter(id=>!$('#'+id).value.trim()||!$('#'+id).checkValidity());if(invalid.length){invalid.forEach(id=>{$('#'+id).setAttribute('aria-invalid','true');$('#'+id+'-error').hidden=false;});$('#save-status').textContent='Check the highlighted fields.';$('#'+invalid[0]).focus();return;}$('#save').disabled=true;$('#save').setAttribute('aria-busy','true');$('#save').textContent='Saving…';$('#save-status').textContent='Updating this preview…';const name=$('#name').value.trim();pending=setTimeout(()=>{$('#profile-name').textContent=name;$('#save').disabled=false;$('#save').removeAttribute('aria-busy');$('#save').textContent='Save preferences';$('#save-status').textContent='Preferences saved in this preview. Reloading restores the original values.';},650);});
form.addEventListener('reset',()=>{clearTimeout(pending);clearErrors();$('#profile-name').textContent='Alex Lee';$('#save').disabled=false;$('#save').removeAttribute('aria-busy');$('#save').textContent='Save preferences';$('#save-status').textContent='Original preview preferences restored.';});
