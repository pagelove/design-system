import assert from 'node:assert/strict';

// Consumer for this repository's flat DTCG resolver subset, not full-spec certification.
// Walks declared references/order rather than assuming particular source filenames.
export function resolveTokens(resolver, input, readSource) {
  assert.equal(resolver.version, '2025.10');
  const modifiers = resolver.modifiers ?? {};
  for (const key of Object.keys(input)) assert.ok(Object.hasOwn(modifiers, key), 'Unknown modifier: ' + key);
  const selections = {};
  for (const [name, modifier] of Object.entries(modifiers)) {
    assert.ok(Object.keys(modifier.contexts ?? {}).length >= 2, 'Use a set for a single context: ' + name);
    const selected = input[name] ?? modifier.default;
    assert.ok(typeof selected === 'string' && Object.hasOwn(modifier.contexts, selected), 'Invalid/missing context: ' + name);
    selections[name] = selected;
  }
  function merge(sources, trail) {
    assert.ok(Array.isArray(sources), 'Sources must be an array');
    return Object.assign({}, ...sources.map(source => {
      if (!source.$ref) return source;
      if (source.$ref.startsWith('#/sets/')) return reference(source, trail);
      assert.match(source.$ref, /^\.\/[\w-]+\.tokens\.json$/, 'Unsupported source reference');
      return readSource(source.$ref);
    }));
  }
  function reference(item, trail) {
    assert.ok(typeof item.$ref === 'string', 'Expected a reference');
    assert.ok(!trail.includes(item.$ref), 'Circular resolver reference');
    const match = /^#\/(sets|modifiers)\/([^/]+)$/.exec(item.$ref);
    assert.ok(match, 'Unsupported resolver reference: ' + item.$ref);
    const [, kind, encoded] = match, name = encoded.replaceAll('~1', '/').replaceAll('~0', '~');
    const target = resolver[kind]?.[name];
    assert.ok(target, 'Missing resolver reference: ' + item.$ref);
    return merge(kind === 'sets' ? target.sources : target.contexts[selections[name]], [...trail, item.$ref]);
  }
  assert.ok(Array.isArray(resolver.resolutionOrder) && resolver.resolutionOrder.length, 'Resolution order required');
  return Object.assign({}, ...resolver.resolutionOrder.map(item => reference(item, [])));
}
