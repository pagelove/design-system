// Derived adapters. CSS remains the lossless representation of unsupported tool properties.
import {dtcgTracking,lineHeightRatio,studioTracking,studioLineHeight} from './typography.mjs';
export function enrich({design,base,resolved,defaultMode,dtcg,json,put,guide,version}) {
  const modes=Object.keys(resolved), first=resolved[defaultMode];
  const family=v=>v.split(',')[0].replaceAll('"','').replaceAll("'",'').trim();
  const typography={};
  for(const [name,s] of Object.entries(design.foundation.textStyle)) {
    const size=first['font-size-'+s.size];
    typography['text-style-'+name]={$type:'typography',$value:{fontFamily:'{font-family-'+s.family+'}',fontWeight:'{font-weight-'+s.weight+'}',fontSize:'{font-size-'+s.size+'}',letterSpacing:dtcgTracking(first['letter-spacing-'+s.letterSpacing],size),lineHeight:lineHeightRatio(first['line-height-'+s.lineHeight],size)}};
  }
  json('tokens/typography.tokens.json',typography);
  const resolver={version:'2025.10',name:design.name,sets:{base:{sources:[{$ref:'./foundations.tokens.json'},{$ref:'./typography.tokens.json'}]}},resolutionOrder:[{$ref:'#/sets/base'}]};
  if(modes.length===1){
    resolver.sets.appearance={sources:[{$ref:'./'+defaultMode+'.tokens.json'}]};
    resolver.resolutionOrder.push({$ref:'#/sets/appearance'});
  }else{
    resolver.modifiers={mode:{default:defaultMode,contexts:Object.fromEntries(modes.map(m=>[m,[{$ref:'./'+m+'.tokens.json'}]]))}};
    resolver.resolutionOrder.push({$ref:'#/modifiers/mode'});
  }
  json('tokens/tokens.resolver.json',resolver);
  const global={};
  for(const [key,css] of Object.entries(first).filter(([k])=>k in base)) {
    let type='other',value=css;
    if(dtcg[key].$type==='color')type='color';
    else if(dtcg[key].$type==='fontFamily'){type='fontFamilies';value=family(css);}
    else if(key.startsWith('font-weight-')){type='fontWeights';value=Number(css);}
    else if(key.includes('letter-spacing')||key==='design-heading-tracking'){type='letterSpacing';value=studioTracking(css);}
    else if(key.startsWith('line-height-')){type='lineHeights';value=studioLineHeight(css);}
    else if(key.startsWith('font-size-')||/design-(title-size|text-)/.test(key))type='fontSizes';
    else if(key.startsWith('design-radius-'))type='borderRadius';
    else if(dtcg[key].$type==='dimension')type='dimension';
    else if(dtcg[key].$type==='number'){type='number';value=Number(css);}
    else if(key.startsWith('gradient-'))type='color';
    global[key]={type,value,description:type==='other'?'CSS-only property; intentionally not applied in Figma.':'Generated from '+key+'. Font family exports use the first family; CSS retains fallbacks.'};
  }
  for(const [key,t]of Object.entries(typography)){
    const s=design.foundation.textStyle[key.slice(11)];
    global[key]={type:'typography',value:{fontFamily:family(first['font-family-'+s.family]),fontWeight:first['font-weight-'+s.weight],fontSize:first['font-size-'+s.size],lineHeight:studioLineHeight(first['line-height-'+s.lineHeight]),letterSpacing:studioTracking(first['letter-spacing-'+s.letterSpacing])}};
  }
  json('exports/tokens-studio.json',{global,...Object.fromEntries(modes.map(m=>[m,Object.fromEntries(Object.entries(design.modes[m]).map(([key,value])=>[key,{type:'color',value:value.replace(/^var\(--([\w-]+)\)$/,'{$1}') }]))])),$metadata:{tokenSetOrder:['global',...modes]}});
  for(const mode of modes)put('.stitch/'+mode+'.DESIGN.md',guide(mode));
  put('DESIGN.md',guide(defaultMode));put('.stitch/DESIGN.md',guide(defaultMode));
  json('exports/manifest.json',{schemaVersion:1,releaseVersion:version,design:design.id,defaultMode,modes,resolver:'../tokens/tokens.resolver.json',stitch:Object.fromEntries(modes.map(m=>[m,'../.stitch/'+m+'.DESIGN.md'])),limitations:['Tokens Studio font families use the first family; CSS retains fallback stacks.','Native dictionaries remain CSS strings.','Live tool imports require separate verification.']});
  put('exports/tailwind.css','/* Tailwind v4: import the selected theme CSS first. Preserve its mode selector. */\n@theme inline {\n'+Object.keys(design.modes[defaultMode]).map(k=>'  --color-'+k+': var(--'+k+');').join('\n')+'\n  --font-sans: var(--design-body-family);\n  --font-display: var(--design-heading-family);\n  --radius-card: var(--design-radius-card);\n  --radius-control: var(--design-radius-input);\n}\n');
}
