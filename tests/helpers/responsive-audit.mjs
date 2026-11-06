// Browser-side diagnostics. Run with page.evaluate(auditResponsiveLayout, options).
// Only declared content contracts are checked; screenshots still require inspection.
export function auditResponsiveLayout({allowLongLabels=false}={}) {
  const issues=[],exceptions=[];
  const visible=el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
  const name=el=>el.id?'#'+el.id:el.textContent.trim().slice(0,65)||el.tagName.toLowerCase();
  const issue=(code,el,detail)=>issues.push({code,element:name(el),detail});
  const rects=range=>[...range.getClientRects()].filter(r=>r.width>.1&&r.height>.1);
  const lineCount=rows=>new Set(rows.map(r=>Math.round(r.top/2))).size;
  const textRects=el=>{const range=document.createRange();range.selectNodeContents(el);return rects(range);};
  const width=el=>{const css=getComputedStyle(el);return el.clientWidth-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight);};
  const root=document.documentElement,availableWidth=Math.min(root.clientWidth,root.getBoundingClientRect().width);
  if(root.scrollWidth>availableWidth+1)issue('page-overflow',root,`Document width ${root.scrollWidth}px exceeds available layout width ${availableWidth}px`);
  for(const el of document.querySelectorAll('[data-layout-short],[data-layout-atomic],[data-layout-words],[data-layout-check],.ds-action,.sample-input,.ds-select')) {
    if(!visible(el))continue;
    const css=getComputedStyle(el),box=el.getBoundingClientRect(),rows=textRects(el),exception=el.dataset.layoutException;
    if(exception)exceptions.push({element:name(el),reason:exception});
    if(el.matches('[data-layout-atomic]')&&lineCount(rows)>1)issue('split-value',el,'Atomic value occupies multiple lines');
    if(el.matches('[data-layout-short]')&&lineCount(rows)>1&&!exception) {
      const clone=el.cloneNode(true);clone.removeAttribute('id');
      Object.assign(clone.style,{position:'fixed',visibility:'hidden',whiteSpace:'nowrap',inlineSize:'max-content',maxInlineSize:'none',font:css.font,letterSpacing:css.letterSpacing,wordSpacing:css.wordSpacing});
      document.body.append(clone);const intrinsic=clone.getBoundingClientRect().width;clone.remove();
      const control=el.closest('button'),padding=control?parseFloat(getComputedStyle(control).paddingLeft)+parseFloat(getComputedStyle(control).paddingRight):0;
      const container=el.closest('[data-layout-container]')??el.parentElement;
      if(!allowLongLabels||intrinsic+padding<=width(container)+1)issue('wrapped-action',el,'Short label compressed instead of moving its whole control/group');
      else exceptions.push({element:name(el),reason:'Label exceeds a full available row at this text size; whole-word wrapping checked separately'});
    }
    if(el.matches('[data-layout-words]')&&!exception) {
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;
      while((node=walker.nextNode()))for(const word of node.textContent.matchAll(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)) {
        const range=document.createRange();range.setStart(node,word.index);range.setEnd(node,word.index+word[0].length);
        if(lineCount(rects(range))>1)issue('word-fragment',el,word[0]);
      }
    }
    if(el.matches('.ds-action,.sample-input,.ds-select')&&box.height<43)issue('compressed-control',el,`Height ${box.height.toFixed(1)}px`);
    if((/hidden|clip/.test(css.overflowX)&&el.scrollWidth>el.clientWidth+1)||(/hidden|clip/.test(css.overflowY)&&el.scrollHeight>el.clientHeight+1)) {
      const mirror=el.matches('select[data-layout-value]')?document.getElementById(el.dataset.layoutValue):null;
      if(mirror&&visible(mirror)&&mirror.textContent.includes(el.selectedOptions[0]?.textContent))exceptions.push({element:name(el),reason:`Native select's complete selected value is visibly repeated in #${mirror.id}`});
      else if(el.matches('input:not([readonly]):not(:disabled)'))exceptions.push({element:name(el),reason:'Native editable value scrolls within its field; not static clipped content'});
      else issue('clipped-content',el,'Content exceeds a clipped box');
    }
    if(!el.matches('input,select')) {
      const boundary=el.matches('[data-layout-atomic],[data-layout-short]')?el.parentElement:el;
      const bounds=boundary.getBoundingClientRect();
      if(rows.some(r=>r.left<bounds.left-1||r.right>bounds.right+1))issue('content-overflow',el,'Text exceeds its immediate content box');
    }
  }
  for(const group of document.querySelectorAll('[data-layout-equal]')) {
    const buttons=[...group.children].flatMap(el=>el.matches('details')?[el.querySelector('summary')]:[el]).filter(el=>el&&el.matches('button,a,summary')&&visible(el));
    for(const first of buttons)for(const second of buttons)if(first!==second){const a=first.getBoundingClientRect(),b=second.getBoundingClientRect();if(Math.abs(a.top-b.top)<2&&Math.abs(a.height-b.height)>1)issue('unequal-actions',group,`${name(first)} / ${name(second)}`);}
  }
  return {viewport:innerWidth,containers:[...document.querySelectorAll('[data-layout-container]')].filter(visible).map(el=>({id:el.id,width:el.getBoundingClientRect().width})),issues,exceptions};
}
