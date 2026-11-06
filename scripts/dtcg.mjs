// Translation of the supported CSS foundation values into DTCG 2025.10 types.
// Original CSS remains in extensions for loss-aware round trips.
export function toDtcg(base, gradients) {
  const result = {}, visiting = new Set();
  const color = hex => {
    const full = hex.length === 4 ? [...hex.slice(1)].map(c => c + c).join('') : hex.slice(1);
    return {colorSpace:'srgb', components:[0,2,4].map(i => parseInt(full.slice(i,i+2),16)/255), alpha:1, hex:'#'+full.toUpperCase()};
  };
  function convert(key) {
    if (result[key]) return result[key];
    if (!(key in base) || visiting.has(key)) throw Error('Missing/circular DTCG alias: ' + key);
    visiting.add(key);
    const css = base[key], alias = /^var\(--([\w-]+)\)$/.exec(css);
    let type, value, description = 'Published foundation value.';
    if (alias) { type = convert(alias[1]).$type; value = '{'+alias[1]+'}'; }
    else if (/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(css)) { type = 'color'; value = color(css); }
    else if (key.startsWith('gradient-')) {
      type = 'gradient'; value = gradients[key.slice(9)].stops.map(([ref,position]) => ({color:'{color-'+ref+'}', position:parseFloat(position)/100}));
      description = 'Color stops; CSS direction is recorded in extensions.';
    } else if (/^-?(?:\d*\.)?\d+(?:px|rem)$/.test(css)) {
      type = 'dimension'; value = {value:parseFloat(css), unit:css.endsWith('rem')?'rem':'px'};
    } else if (key.startsWith('font-family-') || key.endsWith('-family')) {
      type = 'fontFamily'; value = css.split(',').map(name => name.trim().replace(/^['"]|['"]$/g,''));
    } else if (key.startsWith('font-weight-')) { type = 'fontWeight'; value = Number(css); }
    else if (/^(?:\d*\.)?\d+(?:ms|s)$/.test(css)) {
      type = 'duration'; value = {value:parseFloat(css), unit:css.endsWith('ms')?'ms':'s'};
    } else if (key.startsWith('motion-easing-')) {
      type = 'cubicBezier';
      const named = {linear:[0,0,1,1], ease:[.25,.1,.25,1], 'ease-in':[.42,0,1,1], 'ease-out':[0,0,.58,1], 'ease-in-out':[.42,0,.58,1]};
      value = named[css] || (/^cubic-bezier\(([^)]+)\)$/.exec(css)?.[1].split(',').map(Number));
      if (!value) throw Error('Unsupported easing: '+css);
    } else if (key === 'design-shadow-panel' && css === 'none') {
      type = 'shadow'; const zero = {value:0,unit:'px'};
      value = {color:{colorSpace:'srgb',components:[0,0,0],alpha:0},offsetX:zero,offsetY:zero,blur:zero,spread:zero};
      description = 'No shadow, represented by a transparent zero-size shadow. Original CSS is none.';
    } else if (/^-?(?:\d*\.)?\d+(?:em)?$/.test(css)) {
      type = 'number'; value = parseFloat(css);
      if (css.endsWith('em')) description = 'Relative CSS multiplier in em; reconstruct CSS with the em suffix.';
    } else throw Error('No supported DTCG conversion for '+key+': '+css);
    const token = {$type:type,$value:value,$description:description,$extensions:{'com.pagelove.design-system':{css}}};
    result[key] = token; visiting.delete(key); return token;
  }
  for (const key of Object.keys(base)) convert(key);
  return Object.fromEntries(Object.keys(base).map(key => [key,result[key]]));
}
