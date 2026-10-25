// A language model returns JSON that is *usually* the right shape. Once in a
// while a list comes back as a single string, or an object, or null — and
// `thing.map is not a function` takes the whole screen down. Everything the UI
// treats as a list goes through here first.

export const asList = (v) => {
  if (Array.isArray(v)) return v.filter(x => x !== null && x !== undefined && x !== '');
  if (v === null || v === undefined || v === '') return [];
  if (typeof v === 'string') {
    // "1. do this\n2. do that" or "a; b; c" → separate steps.
    const lines = v.split(/\r?\n+/).map(s => s.replace(/^\s*[-*•]?\s*\d*[.)]?\s*/, '').trim()).filter(Boolean);
    return lines.length > 1 ? lines : [v.trim()];
  }
  if (typeof v === 'object') return Object.values(v).filter(Boolean);
  return [v];
};

export const asText = (v) => {
  if (typeof v === 'string') return v;
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.map(asText).filter(Boolean).join('\n');
  if (typeof v === 'object') {
    // The model sometimes answers { challenge: "…", coding: "…" } where a
    // single string was asked for. Read it out rather than printing
    // "[object Object]" — or, worse, handing React an object to render.
    return Object.entries(v)
      .filter(([, val]) => val !== null && val !== undefined && val !== '')
      .map(([k, val]) => {
        const label = String(k).replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
        const body = asText(val);
        return body.startsWith(label) ? body : `${label.charAt(0).toUpperCase()}${label.slice(1)}: ${body}`;
      })
      .join('\n\n');
  }
  return String(v);
};

const LIST_FIELDS = [
  'components', 'pinConnections', 'buildSteps', 'testingChecklist',
  'troubleshooting', 'safetyTips', 'learningOutcomes', 'extensions',
  'materials', 'steps', 'tips', 'concepts', 'tools',
];
const TEXT_FIELDS = ['arduinoCode', 'esp32Code', 'pythonCode', 'code', 'description', 'summary', 'title', 'name'];

// Returns a project object the views can render without defensive checks.
export function normalizeProject(p) {
  if (!p || typeof p !== 'object') return null;
  const out = { ...p };
  for (const f of LIST_FIELDS) if (f in out) out[f] = asList(out[f]);
  for (const f of TEXT_FIELDS) if (f in out) out[f] = asText(out[f]);
  // Rows the tables read must be objects; a bare string becomes a labelled row
  // rather than being dropped, and existing fields are left untouched.
  out.pinConnections = (out.pinConnections || []).map((c) => (
    c && typeof c === 'object' ? c : { component: asText(c), pin: '', wireColor: '' }
  ));
  out.components = (out.components || []).map((c) => (
    c && typeof c === 'object' ? c : { name: asText(c), quantity: 1 }
  ));
  return out;
}

/**
 * Make an AI reply match the schema it was asked for. A field declared as a
 * string is always a string, a list is always a list, and so on, so no screen
 * can be handed an object to print. Unknown shapes pass through untouched.
 */
export function coerceToSchema(value, schema) {
  if (!schema || typeof schema !== 'object') return value;
  const t = schema.type;
  if (t === 'string') return asText(value);
  if (t === 'number' || t === 'integer') {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  if (t === 'boolean') return value === true || value === 'true';
  if (t === 'array') {
    const list = asList(value);
    return schema.items ? list.map(v => coerceToSchema(v, schema.items)) : list;
  }
  if (t === 'object' && schema.properties) {
    const src = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const out = { ...src };
    for (const [k, s] of Object.entries(schema.properties)) {
      if (k in src || s?.type === 'string' || s?.type === 'array') out[k] = coerceToSchema(src[k], s);
    }
    return out;
  }
  return value;
}
