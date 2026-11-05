const catalog=window.designCatalog;
const designSelect=document.querySelector('#design'),modeSelect=document.querySelector('#theme');
for(const design of catalog.designs){const option=document.createElement('option');option.value=design.id;option.textContent=design.name+(design.id===catalog.defaultDesign?' (default)':'');designSelect.append(option);}
designSelect.firstElementChild.remove();
function selectDesign(id,mode,writeURL=false){
 const design=catalog.designs.find(d=>d.id===id)||catalog.designs.find(d=>d.id===catalog.defaultDesign);
 const fallback=design.id===catalog.defaultDesign?catalog.defaultMode:design.defaultMode;
 const selectedMode=design.modes.includes(mode)?mode:fallback;
 designSelect.value=design.id;modeSelect.replaceChildren();
 for(const name of design.modes){const option=document.createElement('option');option.value=name;option.textContent=name[0].toUpperCase()+name.slice(1);modeSelect.append(option);}
 modeSelect.value=selectedMode;modeSelect.disabled=design.modes.length===1;
 document.documentElement.dataset.design=design.id;document.documentElement.dataset.theme=selectedMode;
 document.querySelector('#design-description').textContent=design.name+' — '+design.description+' '+(design.modes.length===1?'Available in '+selectedMode+' mode.':'Choose light or dark mode.');
 document.querySelector('#design-guide').href='../'+design.guide;document.querySelector('#design-exports').href='../'+design.exports+'tokens.json';
 document.querySelector('#foundations img').src='../designs/'+design.id+'/assets/palette.svg';
 document.querySelector('#palette-link').href='../designs/'+design.id+'/assets/palette.svg';document.querySelector('#foundation-guide').href='../'+design.guide;
 if(writeURL){const url=new URL(location.href);url.searchParams.set('design',design.id);url.searchParams.set('mode',selectedMode);try{history.pushState(null,'',url);}catch{/* Local-file previews can still select without history. */}}
}
function readSelection(){const params=new URLSearchParams(location.search);selectDesign(params.get('design'),params.get('mode'));}
designSelect.addEventListener('change',()=>selectDesign(designSelect.value,null,true));
modeSelect.addEventListener('change',()=>selectDesign(designSelect.value,modeSelect.value,true));
window.addEventListener('popstate',readSelection);readSelection();
document.querySelectorAll('[data-notice]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#action-status').textContent=button.dataset.notice+'.';}));
document.querySelector('#show-password').addEventListener('click',event=>{const input=document.querySelector('#password');const show=input.type==='password';input.type=show?'text':'password';event.currentTarget.textContent=show?'Hide password':'Show password';event.currentTarget.setAttribute('aria-pressed',String(show));});
document.querySelector('#example-form').addEventListener('submit',event=>{event.preventDefault();document.querySelector('#save-status').textContent='Preview accepted locally. Nothing was sent or saved to a service.';});
document.querySelector('#show-hints').addEventListener('change',event=>{const hints=document.querySelector('#guidance');hints.hidden=!event.target.checked;});
document.querySelector('#advance-progress').addEventListener('click',()=>{const progress=document.querySelector('#export-progress');progress.value=progress.value>=100?0:Math.min(100,progress.value+20);document.querySelector('#progress-label').textContent=progress.value+'%';document.querySelector('#progress-status').textContent=progress.value===100?'Example export complete. Advance again to reset.':'Example export at '+progress.value+'%.';});
