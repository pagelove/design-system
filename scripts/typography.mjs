// Supported CSS typography units. Mixed px/rem ratios assume the documented 16px root.
function measure(css) {
  const match=/^(-?(?:\d+(?:\.\d+)?|\.\d+))(px|rem|em)?$/.exec(String(css));
  if(!match||!Number.isFinite(Number(match[1])))throw Error('Unsupported typography value: '+css);
  return {value:Number(match[1]),unit:match[2]||''};
}
function fontSize(css) {
  const size=measure(css);
  if(!['px','rem'].includes(size.unit)||size.value<=0)throw Error('Font size must be a positive px/rem length: '+css);
  return size;
}
export function dtcgTracking(css,sizeCSS) {
  const spacing=measure(css),size=fontSize(sizeCSS);
  if(['px','rem'].includes(spacing.unit))return spacing;
  if(spacing.unit==='em')return {value:spacing.value*size.value,unit:size.unit};
  if(spacing.value===0)return {value:0,unit:'px'};
  throw Error('Letter spacing requires px/rem/em or zero: '+css);
}
export function lineHeightRatio(css,sizeCSS) {
  const height=measure(css),size=fontSize(sizeCSS);
  if(height.value<0)throw Error('Line height must not be negative: '+css);
  if(!height.unit||height.unit==='em')return height.value;
  const pixels=value=>value.value*(value.unit==='rem'?16:1);
  return pixels(height)/pixels(size);
}
export function studioTracking(css) {
  const spacing=measure(css);
  if(spacing.unit==='em')return spacing.value*100+'%';
  if(['px','rem'].includes(spacing.unit)||spacing.value===0)return String(css);
  throw Error('Letter spacing requires px/rem/em or zero: '+css);
}
export function studioLineHeight(css) {
  const height=measure(css);
  if(height.value<0)throw Error('Line height must not be negative: '+css);
  return !height.unit||height.unit==='em'?height.value*100+'%':String(css);
}
