// Less escaped strings retain JSON's backslashes. Decode quote/backslash escapes
// explicitly; control characters are not supported in this single-line CSS view.
export function lessValue(value) {
 if(/[\u0000-\u001f]/.test(value))throw new TypeError('Less values must be single-line CSS strings');
 return `replace(~${JSON.stringify(value)}, '\\\\(["\\\\])', '$1', 'g')`;
}
