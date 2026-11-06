// Keep semantic roles meaningful when a browser applies only part of a contrast palette.
export function forcedColor(role) {
  if(role.includes('disabled'))return role.startsWith('background-')?'Canvas':'GrayText';
  if(role.startsWith('background-'))return 'Canvas';
  if(role.startsWith('border-'))return role==='border-focused'?'Highlight':'CanvasText';
  if(role.startsWith('link-'))return role.endsWith('visited')?'VisitedText':'LinkText';
  if(role==='button-strong-text')return 'HighlightText';
  if(role.startsWith('button-strong-'))return 'Highlight';
  if(role.startsWith('button-regular-'))return role.endsWith('-text')?'ButtonText':'ButtonFace';
  if(role.startsWith('button-gradient-bg-'))return 'ButtonFace';
  if(role.startsWith('button-'))return 'ButtonText';
  if(role==='text-inverse'||role==='icon-inverse')return 'Canvas';
  if(role.startsWith('text-')||role.startsWith('icon-'))return 'CanvasText';
  throw Error('Unmapped forced-color role: '+role);
}
export function renderForcedColors(roles) {
  return '/* Generated system palette for the shared semantic roles. User contrast colors take precedence. */\n@media (forced-colors:active) {\n  :root, [data-design] {\n    color-scheme: light dark !important;\n'+Object.keys(roles).map(role=>'    --'+role+': '+forcedColor(role)+' !important;').join('\n')+'\n  }\n}\n';
}
