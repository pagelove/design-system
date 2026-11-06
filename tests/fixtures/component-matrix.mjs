import {button,field} from '../../components/index.mjs';
const query=new URLSearchParams(location.search),{design,mode}=DesignSelection.resolve(designCatalog,query.get('design'),query.get('mode'));
document.documentElement.dataset.design=design.id;document.documentElement.dataset.theme=mode;
document.documentElement.style.fontSize=query.get('size')==='200'?'200%':'';
document.documentElement.dir=query.get('dir')==='rtl'?'rtl':'ltr';
document.documentElement.dataset.spacing=query.get('spacing')==='expanded'?'expanded':'normal';
document.querySelector('#matrix').innerHTML=['strong','regular','light','outlined','outlined-gradient','borderless','borderless-gradient'].map(appearance=>`<section class="ds-panel"><h2>${appearance}</h2><div class="ds-row">${['lg','md','sm','xs'].map(size=>button({appearance,size,label:'Review '+size})).join('')}${['disabled','loading','skeleton'].map(state=>button({appearance,state,label:'Review '+state})).join('')}</div></section>`).join('')+`<section class="ds-panel"><h2>Fields</h2>${field({id:'name',label:'A readable display name',hint:'Use the name people know you by.'})}${field({id:'invalid',label:'An invalid field',hint:'Enter a valid email.',error:true})}${field({id:'disabled',label:'Unavailable field',disabled:true})}</section>`;
