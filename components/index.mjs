// Framework-independent HTML helpers. Escaping applies to every caller-supplied string.
export const escapeHTML = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const oneOf=(v,values,fallback)=>values.includes(v)?v:fallback;
export function button({label='Continue',appearance='strong',size='lg',state='default',iconOnly=false,square=false}={}) {
  appearance=oneOf(appearance,['strong','regular','light','outlined','outlined-gradient','borderless','borderless-gradient'],'strong');
  size=oneOf(size,['lg','md','sm','xs'],'lg');state=oneOf(state,['default','disabled','loading','skeleton'],'default');
  const busy=state==='loading',disabled=state!=='default';
  return `<button type="button" class="pl-button pl-button--${appearance} pl-button--${size}${iconOnly?' pl-button--icon':''}${square?' pl-button--square':''}${busy?' is-loading':''}${state==='skeleton'?' is-skeleton':''}"${disabled?' disabled':''}${busy?' aria-busy="true"':''}${iconOnly?` aria-label="${escapeHTML(label)}"`:''}>${iconOnly?'<svg class="pl-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>':`<span class="pl-button__label">${escapeHTML(busy?'Working…':label)}</span>`}</button>`;
}
export function field({id,label,type='text',hint='',value='',error=false,disabled=false,autocomplete='off'}={}) {
  if(!id||!label)throw new TypeError('field requires id and visible label');
  type=oneOf(type,['text','email','password','tel'],'text');
  return `<div class="pl-field pl-field--lg${error?' is-error':''}"><label class="pl-field__label" for="${escapeHTML(id)}">${escapeHTML(label)}</label><div class="pl-field__control"><input class="pl-field__input" id="${escapeHTML(id)}" name="${escapeHTML(id)}" type="${type}" value="${escapeHTML(value)}" autocomplete="${escapeHTML(autocomplete)}"${hint?` aria-describedby="${escapeHTML(id)}-hint"`:''}${error?' aria-invalid="true"':''}${disabled?' disabled':''}></div>${hint?`<p class="pl-field__hint" id="${escapeHTML(id)}-hint">${escapeHTML(hint)}</p>`:''}</div>`;
}
export function choice({id,label,kind='checkbox',name='',value='on',checked=false,disabled=false}={}) {
 if(!id||!label)throw new TypeError('choice requires id and visible label');
 kind=oneOf(kind,['checkbox','radio','switch'],'checkbox');const toggle=kind==='switch',cls=toggle?'pl-toggle':`pl-${kind}`;
 return `<label class="${cls}${toggle?' pl-toggle--right':''}" for="${escapeHTML(id)}"><input id="${escapeHTML(id)}" name="${escapeHTML(name||id)}" value="${escapeHTML(value)}" type="${kind==='radio'?'radio':'checkbox'}" class="${cls}__${toggle?'switch':'input'}"${toggle?' role="switch"':''}${checked?' checked':''}${disabled?' disabled':''}>${toggle?'':`<span class="${cls}__${kind==='radio'?'dot':'box'}" aria-hidden="true"></span>`}<span class="${cls}__label">${escapeHTML(label)}</span></label>`;
}
export function progress({value=null,label='Loading',size='md'}={}) {
 size=oneOf(size,['xxs','xs','sm','md','lg','xl'],'md');
 if(value===null)return `<span class="pl-progress-radial pl-progress-radial--${size}" role="progressbar" aria-label="${escapeHTML(label)}"></span><span>${escapeHTML(label)}</span>`;
 const v=Number(value);if(!Number.isFinite(v))throw new TypeError('Progress must be finite');const n=Math.min(100,Math.max(0,v));
 return `<span class="pl-progress-det pl-progress-det--md" role="progressbar" aria-label="${escapeHTML(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${n}"><svg class="pl-progress-det__ring" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle class="pl-progress-det__track" cx="20" cy="20" r="18" stroke-width="4"/><circle class="pl-progress-det__bar" cx="20" cy="20" r="18" stroke-width="4" pathLength="100" stroke-dasharray="${n} ${100-n}" transform="rotate(-90 20 20)"/></svg></span><span>${escapeHTML(label)}: ${n}%</span>`;
}
