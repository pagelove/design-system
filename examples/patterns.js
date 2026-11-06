import {select,textarea,notice,disclosure,breadcrumbs,tabs,confirmation,errorSummary,enhancePatterns,openConfirmation} from '../components/patterns.mjs';

const designControl=document.querySelector('#pattern-design');
const modeControl=document.querySelector('#pattern-mode');
designControl.replaceChildren(...designCatalog.designs.map(d=>new Option(d.name,d.id)));

function applySelection(){
  const query=new URLSearchParams(location.search);
  const {design,mode}=DesignSelection.resolve(designCatalog,query.get('design'),query.get('mode'));
  document.documentElement.dataset.design=design.id;
  document.documentElement.dataset.theme=mode;
  document.documentElement.dir=query.get('dir')==='rtl'?'rtl':'ltr';
  document.documentElement.dataset.spacing=query.get('spacing')==='expanded'?'expanded':'normal';
  document.documentElement.style.fontSize=query.get('size')==='200'?'200%':'';
  designControl.value=design.id;
  modeControl.replaceChildren(...design.modes.map(m=>new Option(m[0].toUpperCase()+m.slice(1),m)));
  modeControl.value=mode;
  modeControl.disabled=design.modes.length===1;
  document.querySelector('#pattern-guide').href=`../designs/${design.id}/.stitch/${mode}.DESIGN.md`;
  document.querySelector('#pattern-workspace').href=`workspace.html?design=${design.id}&mode=${mode}`;
  document.title=`App patterns · ${design.name} / ${mode} · Pagelove`;
}
function changeSelection(key,value){
  const url=new URL(location.href);url.searchParams.set(key,value);
  if(key==='design')url.searchParams.delete('mode');
  history.pushState(null,'',url);applySelection();
}
designControl.addEventListener('change',()=>changeSelection('design',designControl.value));
modeControl.addEventListener('change',()=>changeSelection('mode',modeControl.value));
window.addEventListener('popstate',applySelection);
applySelection();
document.querySelector('.pattern-selection').hidden=false;

const root=document.querySelector('#patterns');
root.innerHTML=`
<section>
  <h2>Navigation</h2>
  ${breadcrumbs([{label:'Collection',href:'designs.html'},{label:'App patterns'}])}
  ${tabs({id:'example',label:'Project information',items:[{label:'Overview',text:'A complete overview of your project.'},{label:'Activity',text:'No recent activity. New changes will appear here.'}]})}
  ${disclosure({title:'When should I use a disclosure?',text:'Use it for supplementary content. Keep essential instructions visible.'})}
</section>
<section>
  <h2>Settings and recovery</h2>
  <div id="errors"></div>
  <form id="settings" novalidate>
    ${select({id:'language',label:'Language',options:[{value:'en',label:'English'},{value:'ar',label:'العربية'}]})}
    ${textarea({id:'description',label:'Project description',required:true})}
    <button type="submit">Save description</button>
  </form>
  <div id="feedback"></div>
</section>
<section>
  <h2>Confirmation</h2>
  <button id="confirm-open" type="button">Archive project</button>
  ${confirmation({id:'confirm',title:'Archive this project?',message:'This demonstration only changes the local status. Your files remain available.',action:'Archive'})}
  <p id="archive-status" role="status"></p>
</section>
<section>
  <h2>Records</h2>
  <div class="table-scroll ds-table-scroll" role="region" aria-label="Project records" tabindex="0">
    <table class="ds-table"><caption>Example projects</caption>
      <thead><tr><th scope="col" aria-sort="ascending"><button type="button" id="sort">Sort by project name</button></th><th scope="col">Status</th></tr></thead>
      <tbody id="records"></tbody>
    </table>
  </div>
  <nav class="table-controls ds-table-controls" aria-label="Pagination"><button id="previous" type="button">Previous</button><span id="page" role="status"></span><button id="next" type="button">Next</button></nav>
</section>
<section>
  <h2>International content</h2>
  <p lang="ar" dir="rtl">مساحة واضحة لتنظيم مشاريعك وأفكارك</p>
  <p>Mixed-direction name: <bdi dir="auto">ليلى — Studio</bdi></p>
  <p lang="de">Benachrichtigungseinstellungen für gemeinsam bearbeitete Projekte</p>
</section>`;
enhancePatterns(root);

const form=document.querySelector('#settings'),feedback=document.querySelector('#feedback');
form.addEventListener('input',()=>feedback.replaceChildren());
form.addEventListener('submit',event=>{
  event.preventDefault();feedback.replaceChildren();
  const input=document.querySelector('#description'),invalid=!input.value.trim();
  input.setAttribute('aria-invalid',String(invalid));
  document.querySelector('#errors').innerHTML=invalid?errorSummary([{id:'description',message:'Enter a project description.'}]):'';
  document.querySelector('#description-error')?.remove();
  if(invalid){
    input.setAttribute('aria-describedby','description-error');
    const hint=document.createElement('p');hint.id='description-error';hint.textContent='Enter a project description.';input.after(hint);
    document.querySelector('[data-error-summary]').focus();
    document.querySelector('[data-error-summary] a').addEventListener('click',()=>input.focus());
  }else{
    input.removeAttribute('aria-describedby');
    feedback.innerHTML=notice({title:'Description saved locally',message:'This preview resets when you reload.'});
  }
});
const opener=document.querySelector('#confirm-open'),dialog=document.querySelector('#confirm');
opener.addEventListener('click',()=>openConfirmation(dialog,opener));
dialog.addEventListener('close',()=>{
  document.querySelector('#archive-status').textContent=dialog.returnValue==='confirm'?'Project archived in this local preview.':'Archive cancelled.';
});

const names=['Fieldnotes','Small beginnings','Ways of seeing'];let page=0,ascending=true;
function render(){
  const ordered=[...names].sort();if(!ascending)ordered.reverse();
  document.querySelector('#records').replaceChildren(...ordered.slice(page*2,page*2+2).map(name=>{
    const row=document.createElement('tr');
    for(const value of [name,'In progress']){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}return row;
  }));
  document.querySelector('#page').textContent=`Page ${page+1} of 2`;
  document.querySelector('#previous').disabled=page===0;document.querySelector('#next').disabled=page===1;
  document.querySelector('[aria-sort]').setAttribute('aria-sort',ascending?'ascending':'descending');
}
document.querySelector('#previous').onclick=()=>{page=0;render();};
document.querySelector('#next').onclick=()=>{page=1;render();};
document.querySelector('#sort').onclick=()=>{ascending=!ascending;page=0;render();};
render();
