import {button} from '../components/index.mjs';
import {openConfirmation} from '../components/patterns.mjs';
const $=selector=>document.querySelector(selector),params=new URLSearchParams(location.search);
const {design,mode}=DesignSelection.resolve(designCatalog,params.get('design'),params.get('mode'));
document.documentElement.dataset.design=design.id;
document.documentElement.dataset.theme=mode;
document.documentElement.dir=params.get('dir')==='rtl'?'rtl':'ltr';
document.documentElement.dataset.spacing=params.get('spacing')==='expanded'?'expanded':'normal';
document.documentElement.style.fontSize=params.get('size')==='200'?'200%':'';
$('#design').replaceChildren(...designCatalog.designs.map(d=>new Option(d.name,d.id)));
$('#design').value=design.id;
$('#mode').replaceChildren(...design.modes.map(m=>new Option(m,m)));
$('#mode').value=mode;$('#mode').disabled=design.modes.length===1;
$('.preview-selection').hidden=false;
for(const key of ['design','mode'])$('#'+key).addEventListener('change',event=>{const url=new URL(location.href);url.searchParams.set(key,event.target.value);if(key==='design')url.searchParams.delete('mode');location.assign(url);});
function action(parent,id,label,handler,appearance='regular') {
  const template=document.createElement('template');template.innerHTML=button({label,appearance,size:'md'});
  const node=template.content.firstElementChild;node.id=id;node.classList.add('ds-action');
  node.querySelector('span').dataset.layoutShort='';node.querySelector('span').dataset.layoutWords='';
  node.addEventListener('click',handler);$(parent).append(node);return node;
}
const status=text=>$('#action-status').textContent=text;
action('#toolbar-actions','export','Export contacts',()=>status('Demo export requested; no file or external service is connected.'));
action('#menu-actions','import','Import contacts',()=>status('Demo import selected; no file was read.'));
action('#menu-actions','labels','Manage labels',()=>status('Demo labels selected.'));
const menu=$('#more-menu');$('#toolbar-actions').append(menu);
function filter(){let count=0;for(const item of document.querySelectorAll('.record-list li')){item.hidden=!item.textContent.toLowerCase().includes($('#search').value.toLowerCase())||($('#visibility').value==='Active contacts'&&item.dataset.active!=='true');if(!item.hidden)count++;}$('#search-status').textContent=(count?`${count} contacts`:'No contacts found. Clear the search to show all contacts.')+' · '+$('#visibility').value;}
$('#search').addEventListener('input',filter);$('#visibility').addEventListener('change',filter);
$('#album').addEventListener('change',()=>$('#destination').textContent='Destination: '+$('#album').value);
const weeks=['26 Oct–1 Nov 2026','2–8 Nov 2026','9–15 Nov 2026'];let week=1;
action('#week-actions','previous','Previous week',()=>{week=Math.max(0,week-1);$('#week').textContent=weeks[week];updateWeek();});
action('#week-actions','next','Next week',()=>{week=Math.min(2,week+1);$('#week').textContent=weeks[week];updateWeek();});
function updateWeek(){$('#previous').disabled=week===0;$('#next').disabled=week===2;}updateWeek();
action('#bulk-actions','move','Move to album',()=>status('Demo destination: '+$('#album').value));
action('#bulk-actions','download','Download selected',()=>status('Demo download requested; no archive was created.'));
action('#bulk-actions','clear','Clear selection',()=>{$('#select-all').checked=false;updateSelection();});
function updateSelection(){const selected=$('#select-all').checked;$('#selection-status').textContent=selected?'8 photographs selected':'No photographs selected';for(const node of document.querySelectorAll('#bulk-actions button'))node.disabled=!selected;}
$('#select-all').addEventListener('change',updateSelection);
action('#detail-actions','view','View invoice',()=>{$('#invoice-detail').hidden=!$('#invoice-detail').hidden;$('#view').setAttribute('aria-expanded',String(!$('#invoice-detail').hidden));});
$('#view').setAttribute('aria-expanded','false');$('#view').setAttribute('aria-controls','invoice-detail');
action('#detail-actions','print','Print / PDF',()=>window.print());
const dialog=$('#edit-dialog');
action('#detail-actions','edit','Edit invoice',event=>openConfirmation(dialog,event.currentTarget));
action('#dialog-actions','cancel','Cancel',()=>dialog.close());
const save=action('#dialog-actions','save','Save changes',()=>{},'strong');save.type='submit';
$('#edit-form').addEventListener('submit',event=>{event.preventDefault();const input=$('#invoice-name');if(!input.value.trim()){input.setAttribute('aria-invalid','true');$('#name-error').hidden=false;input.focus();return;}input.removeAttribute('aria-invalid');$('#name-error').hidden=true;$('#invoice-title').textContent=input.value.trim();dialog.close();status('Invoice description updated for this preview. Reloading restores the sample.');});
document.documentElement.dataset.ready='true';
