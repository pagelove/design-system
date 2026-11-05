import assert from 'node:assert/strict';

// A strict validator for the flat token types emitted here, not full-spec certification.
export function validateDtcg(tokens) {
  const supported = new Set(['color','dimension','fontFamily','fontWeight','duration','cubicBezier','number','gradient','shadow']);
  const number = value => assert.ok(typeof value === 'number' && Number.isFinite(value), 'Finite number required');
  function valueOf(type, value, trail) {
    if (typeof value === 'string' && /^\{[^{}]+\}$/.test(value)) {
      const target = value.slice(1,-1);
      assert.ok(tokens[target], 'Missing alias: '+target);
      assert.equal(tokens[target].$type,type,'Alias type mismatch: '+target);
      assert.ok(!trail.includes(target),'Circular alias: '+target);
      return valueOf(type,tokens[target].$value,[...trail,target]);
    }
    if (type === 'number') number(value);
    else if (type === 'fontWeight') { number(value); assert.ok(value >= 1 && value <= 1000); }
    else if (type === 'fontFamily') {
      const names = Array.isArray(value) ? value : [value];
      assert.ok(names.length && names.every(name => typeof name === 'string' && name.trim()),'Font names required');
    } else if (type === 'dimension' || type === 'duration') {
      assert.ok(value && typeof value === 'object'); number(value.value);
      assert.ok((type === 'dimension' ? ['px','rem'] : ['ms','s']).includes(value.unit),'Invalid unit');
      if (type === 'duration') assert.ok(value.value >= 0,'Negative duration');
    } else if (type === 'color') {
      assert.equal(value.colorSpace,'srgb'); assert.equal(value.components.length,3);
      for (const channel of value.components) { number(channel); assert.ok(channel >= 0 && channel <= 1); }
      if (value.alpha !== undefined) { number(value.alpha); assert.ok(value.alpha >= 0 && value.alpha <= 1); }
    } else if (type === 'cubicBezier') {
      assert.equal(value.length,4); value.forEach(number);
      for (const i of [0,2]) assert.ok(value[i] >= 0 && value[i] <= 1);
    } else if (type === 'gradient') {
      assert.ok(Array.isArray(value) && value.length >= 2);
      for (const stop of value) { valueOf('color',stop.color,trail); number(stop.position); assert.ok(stop.position >= 0 && stop.position <= 1); }
    } else if (type === 'shadow') {
      for (const shadow of Array.isArray(value) ? value : [value]) {
        if (typeof shadow === 'string') { valueOf('shadow',shadow,trail); continue; }
        valueOf('color',shadow.color,trail);
        for (const key of ['offsetX','offsetY','blur','spread']) valueOf('dimension',shadow[key],trail);
        if (shadow.inset !== undefined) assert.equal(typeof shadow.inset,'boolean');
      }
    }
  }
  for (const [key,token] of Object.entries(tokens)) {
    assert.ok(!key.startsWith('$') && !/[.{}]/.test(key),'Invalid flat token name');
    assert.ok(supported.has(token.$type),'Unsupported DTCG type: '+token.$type);
    assert.notEqual(token.$value,undefined,'Missing value');
    valueOf(token.$type,token.$value,[key]);
  }
}
