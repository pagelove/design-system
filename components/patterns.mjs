import {escapeHTML as e} from './index.mjs';
const required=(id,label)=>{if(!id||!label)throw Error('An ID and visible label are required');};
export function select({id,label,options=[],value='',hint=''}){required(id,label);return `<label for="${e(id)}">${e(label)}</label><select class="ds-select" id="${e(id)}" name="${e(id)}"${hint?` aria-describedby="${e(id)}-hint"`:''}>${options.map(o=>`<option value="${e(o.value)}"${String(o.value)===String(value)?' selected':''}>${e(o.label)}</option>`).join('')}</select>${hint?`<p id="${e(id)}-hint">${e(hint)}</p>`:''}`;}
export function textarea({id,label,value='',required:isRequired=false}){required(id,label);return `<label for="${e(id)}">${e(label)}</label><textarea class="ds-textarea" id="${e(id)}" name="${e(id)}" rows="4" dir="auto"${isRequired?' required':''}>${e(value)}</textarea>`;}
export function notice({title,message,urgent=false}){return `<div class="ds-notice" role="${urgent?'alert':'status'}"><strong>${e(title)}</strong><p>${e(message)}</p></div>`;}
export function disclosure({title,text}){return `<details><summary>${e(title)}</summary><p>${e(text)}</p></details>`;}
export function breadcrumbs(items){return `<nav aria-label="Breadcrumb"><ol class="ds-breadcrumbs" role="list">${items.map((item,i)=>`<li>${i?'<span aria-hidden="true">/</span>':''}${i===items.length-1?`<span aria-current="page">${e(item.label)}</span>`:`<a href="${safeURL(item.href)}">${e(item.label)}</a>`}</li>`).join('')}</ol></nav>`;}
function safeURL(value){
 const url=String(value??'').trim();
 if(!url||/[\u0000-\u0020\\]/.test(url)||url.startsWith('//'))throw Error('Use an HTTP or relative navigation URL');
 const parsed=new URL(url,'https://example.invalid/');
 if(!['http:','https:'].includes(parsed.protocol))throw Error('Use an HTTP or relative navigation URL');
 return e(url);
}
export function tabs({id,label,items}){required(id,label);if(!items?.length)throw Error('Tabs require items');return `<div data-tabs data-ds-tabs><div role="tablist" aria-label="${e(label)}">${items.map((item,i)=>`<button type="button" role="tab" id="${e(id)}-${i}" aria-controls="${e(id)}-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${e(item.label)}</button>`).join('')}</div>${items.map((item,i)=>`<section role="tabpanel" id="${e(id)}-panel-${i}" aria-labelledby="${e(id)}-${i}" tabindex="0"${i?' hidden':''}><p>${e(item.text)}</p></section>`).join('')}</div>`;}
export function confirmation({id,title,message,action='Confirm'}){required(id,title);return `<dialog class="ds-dialog" id="${e(id)}" aria-labelledby="${e(id)}-title"><h2 id="${e(id)}-title">${e(title)}</h2><p>${e(message)}</p><form method="dialog"><button value="cancel" autofocus>Cancel</button><button value="confirm">${e(action)}</button></form></dialog>`;}
export function errorSummary(errors){return `<div class="ds-notice" role="alert" tabindex="-1" data-error-summary><h2>Check your answers</h2><ul>${errors.map(x=>`<li><a href="#${e(x.id)}">${e(x.message)}</a></li>`).join('')}</ul></div>`;}

// Call once on a newly inserted root. Returns cleanup for apps that unmount it.
export function enhancePatterns(root=document){
 const owned=event=>{
  const tab=event.target.closest?.('[role="tab"]'),group=tab?.closest('[data-ds-tabs]');
  if(!group||!root.contains(group)||tab.parentElement.getAttribute('role')!=='tablist')return null;
  return {tab,group,list:[...tab.parentElement.children].filter(t=>t.getAttribute('role')==='tab')};
 };
 const click=event=>{const context=owned(event);if(!context)return;const {tab,group,list}=context;for(const t of list){const panel=group.querySelector('#'+CSS.escape(t.getAttribute('aria-controls')));if(!panel)continue;const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;panel.hidden=!active;}};
 const key=event=>{const context=owned(event);if(!context)return;const {tab,list}=context;let index=list.indexOf(tab),dir=getComputedStyle(tab).direction==='rtl'?-1:1;if(event.key==='ArrowRight')index+=dir;else if(event.key==='ArrowLeft')index-=dir;else if(event.key==='Home')index=0;else if(event.key==='End')index=list.length-1;else return;event.preventDefault();const next=list[(index+list.length)%list.length];next.focus();next.click();};
 root.addEventListener('click',click);root.addEventListener('keydown',key);return()=>{root.removeEventListener('click',click);root.removeEventListener('keydown',key);};
}
export function openConfirmation(dialog,trigger){
 if(dialog.open)return;
 const key=event=>{
  if(event.key!=='Tab')return;
  const controls=[...dialog.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')].filter(el=>!el.disabled&&el.tabIndex>=0&&el.getClientRects().length);
  if(!controls.length){event.preventDefault();dialog.focus();return;}
  const first=controls[0],last=controls.at(-1),active=dialog.ownerDocument.activeElement;
  if(event.shiftKey&&active===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&active===last){event.preventDefault();first.focus();}
 };
 const close=()=>{dialog.removeEventListener('keydown',key);if(trigger?.isConnected)trigger.focus();};
 dialog.returnValue='';dialog.showModal();
 dialog.addEventListener('keydown',key);dialog.addEventListener('close',close,{once:true});
}
