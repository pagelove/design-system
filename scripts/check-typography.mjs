import assert from 'node:assert/strict';
import {enrich} from './adapters.mjs';
import {toDtcg} from './dtcg.mjs';
import {validateDtcg} from './validate-dtcg.mjs';

export function checkTypography() {
  const cases=[
    {size:'20px',tracking:'2px',height:'1.5',spacing:{value:2,unit:'px'},ratio:1.5,studioSpacing:'2px',studioHeight:'150%'},
    {size:'2rem',tracking:'.05rem',height:'3rem',spacing:{value:.05,unit:'rem'},ratio:1.5,studioSpacing:'.05rem',studioHeight:'3rem'},
    {size:'20px',tracking:'-.025em',height:'30px',spacing:{value:-.5,unit:'px'},ratio:1.5,studioSpacing:'-2.5%',studioHeight:'30px'},
    {size:'2rem',tracking:'.1em',height:'1.5em',spacing:{value:.2,unit:'rem'},ratio:1.5,studioSpacing:'10%',studioHeight:'150%'},
    {size:'2rem',tracking:'0',height:'48px',spacing:{value:0,unit:'px'},ratio:1.5,studioSpacing:'0',studioHeight:'48px'}
  ];
  function build(c) {
    const base={'font-family-body':'Inter, sans-serif','font-weight-400':'400','font-size-body':c.size,'letter-spacing-body':c.tracking,'line-height-body':c.height};
    const dtcg=toDtcg(base,{}),out={};
    const design={id:'fixture',name:'Fixture',foundation:{textStyle:{body:{family:'body',weight:'400',size:'body',letterSpacing:'body',lineHeight:'body'}}},modes:{dark:{}}};
    enrich({design,base,resolved:{dark:base},defaultMode:'dark',dtcg,json:(p,v)=>out[p]=v,put:()=>{},guide:()=>'',version:'test'});
    validateDtcg({...dtcg,...out['tokens/typography.tokens.json']});
    return out;
  }
  for(const c of cases) {
    const out=build(c),typography=out['tokens/typography.tokens.json']['text-style-body'].$value,studio=out['exports/tokens-studio.json'].global;
    assert.deepEqual(typography.letterSpacing,c.spacing,'DTCG spacing '+c.tracking);
    assert.equal(typography.lineHeight,c.ratio,'DTCG line height '+c.height);
    for(const token of [studio['letter-spacing-body'].value,studio['text-style-body'].value.letterSpacing])assert.equal(token,c.studioSpacing,'Studio spacing '+c.tracking);
    for(const token of [studio['line-height-body'].value,studio['text-style-body'].value.lineHeight])assert.equal(token,c.studioHeight,'Studio line height '+c.height);
  }
  for(const bad of [{size:'0px'},{size:'-2px'},{tracking:'2'},{height:'-1'}])assert.throws(()=>build({...cases[0],...bad}));
  return {validCases:cases.length,rejectedCases:4,rootFontSizeForMixedUnits:16};
}
