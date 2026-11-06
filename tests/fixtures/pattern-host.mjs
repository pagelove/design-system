const host=document.querySelector('#host-tabs');
host.addEventListener('keydown',event=>{if(event.key!=='ArrowRight')return;event.preventDefault();host.children[1].focus();host.children[1].click();});
host.addEventListener('click',event=>{for(const button of host.children){button.setAttribute('aria-selected',String(button===event.target));button.tabIndex=button===event.target?0:-1;}});
document.querySelector('#load').addEventListener('click',async()=>{
 const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='../../styles/patterns.css';
 const loaded=new Promise((resolve,reject)=>{sheet.onload=resolve;sheet.onerror=reject;});document.head.append(sheet);await loaded;
 const {tabs,enhancePatterns}=await import('../../components/patterns.mjs');
 document.querySelector('#owned').innerHTML=tabs({id:'owned',label:'Owned tabs',items:[{label:'Owned A',text:'First'},{label:'Owned B',text:'Second'}]})+tabs({id:'separate',label:'Separate tabs',items:[{label:'Separate A',text:'First'},{label:'Separate B',text:'Second'}]});
 const cleanup=enhancePatterns(document);
 document.querySelector('#cleanup').disabled=false;document.querySelector('#cleanup').onclick=cleanup;
 document.querySelector('#load').disabled=true;document.querySelector('#load-status').textContent='Ready';
});
