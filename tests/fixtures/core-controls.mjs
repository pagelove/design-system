import {choice,progress,button} from '../../components/index.mjs';
const query=new URLSearchParams(location.search);
const {design,mode}=DesignSelection.resolve(designCatalog,query.get('design'),query.get('mode'));
document.documentElement.dataset.design=design.id;document.documentElement.dataset.theme=mode;
document.documentElement.dir=query.get('dir')==='rtl'?'rtl':'ltr';
document.documentElement.style.fontSize=query.get('size')==='200'?'200%':'';
document.documentElement.dataset.spacing=query.get('spacing')==='expanded'?'expanded':'normal';
document.documentElement.dataset.motion=query.get('motion')==='reduce'?'reduce':'auto';
document.querySelector('#controls').innerHTML=`
<fieldset><legend>Export choices</legend>
${choice({id:'include',label:'Include documentation and translated guidance for everyone on your team',checked:true})}
${choice({id:'mixed',label:'Some sections selected'})}
${choice({id:'locked',label:'Required license notices',checked:true,disabled:true})}</fieldset>
<fieldset><legend>Preferred format</legend>${choice({id:'format-json',label:'JSON',kind:'radio',name:'format',value:'json',checked:true})}${choice({id:'format-css',label:'CSS',kind:'radio',name:'format',value:'css'})}</fieldset>
${choice({id:'guidance',label:'Show helpful guidance while reviewing your designs',kind:'switch',checked:true})}
<section><h2>Progress sizes</h2><div class="ds-row">${['xxs','xs','sm','md','lg','xl'].map(size=>`<div class="ds-progress" data-size="${size}">${progress({value:40,label:'Export '+size,size})}</div>`).join('')}</div></section>
<div class="ds-row">${button({label:'Add item',iconOnly:true,state:'loading'})}${progress({label:'Preparing preview'})}</div>`;
document.querySelector('#mixed').indeterminate=true;
