// Generated from components/patterns.mjs; do not edit.
window.WorkspaceDialog = {open: function openConfirmation(dialog,trigger){
 if(dialog.open)return;
 const key=event=>{
  if(event.key!=='Tab'||event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey)return;
  const controls=[...dialog.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')].filter(el=>!el.matches(':disabled')&&!el.closest('[inert]')&&el.tabIndex>=0&&el.getClientRects().length&&getComputedStyle(el).visibility==='visible');
  if(!controls.length){event.preventDefault();dialog.focus();return;}
  const first=controls[0],last=controls.at(-1),active=dialog.ownerDocument.activeElement;
  if(event.shiftKey&&active===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&active===last){event.preventDefault();first.focus();}
 };
 const close=()=>{dialog.removeEventListener('keydown',key);if(trigger?.isConnected)trigger.focus();};
 dialog.returnValue='';dialog.showModal();
 dialog.addEventListener('keydown',key);dialog.addEventListener('close',close,{once:true});
}};
