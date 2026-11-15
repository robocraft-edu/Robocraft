// Variable Description Table generator for Python programs and Arduino sketches.
// Produces rows { name, type, description } that the student can edit.

const COMMON = {
  i: 'loop counter', j: 'inner loop counter', k: 'loop counter', n: 'stores the number being processed', count: 'counts matching items',
  total: 'stores the running total', sum: 'stores the sum', avg: 'stores the average', average: 'stores the average', mean: 'stores the mean',
  pct: 'stores the percentage', percentage: 'stores the percentage', max: 'largest value', min: 'smallest value', peak: 'highest value reached',
  temp: 'temporary value used while swapping', flag: 'status message / flag', found: 'true if the item is found', pos: 'position (index) of the item',
  low: 'lower index of the search range', high: 'upper index of the search range', mid: 'middle index of the search range', key: 'value to search for',
  error: 'difference between set-point and measured value', integral: 'sum of past errors (I term)', derivative: 'change in error (D term)',
  setpoint: 'target value', speed: 'current speed', distance: 'measured distance', t: 'time / duration',
  x: 'x-coordinate', y: 'y-coordinate', row: 'row index', col: 'column index', line: 'one line of output being built',
  grade: 'grade awarded', status: 'status message', label: 'class label (prediction)', best: 'smallest distance found so far',
  readings: 'list of sensor readings', marks: 'list of marks', words: 'list of words', text: 'input text', cmd: 'command string', name: 'name',
  angle: 'servo angle in degrees', raw: 'raw ADC reading (0–1023)', duration: 'echo pulse width in microseconds', cm: 'distance in centimetres',
  left: 'left motor speed / sensor value', right: 'right motor speed / sensor value', 
};

// Single letters are too ambiguous to guess from a name table (T, g, l…).
const describe = (name, fallback = '') => COMMON[name] || (name.length > 2 ? COMMON[name.toLowerCase()] : undefined) || fallback;

function inferPy(rhs) {
  const s = rhs.trim();
  if (/^input\(/.test(s) || /^["']/.test(s) || /^str\(/.test(s)) return 'str';
  if (/^int\(/.test(s) || /^len\(/.test(s) || /^-?\d+$/.test(s) || /\.(count|index|find)\(/.test(s)) return 'int';
  if (/^float\(/.test(s) || /^-?\d*\.\d+$/.test(s)) return 'float';
  if (/^\[/.test(s) || /^list\(/.test(s) || /\.split\(/.test(s)) return 'list';
  if (/^\{.*:/.test(s) || /^dict\(/.test(s)) return 'dict';
  if (/^\{/.test(s) || /^set\(/.test(s)) return 'set';
  if (/^deque\(/.test(s)) return 'deque';
  if (/^\(.*,.*\)$/.test(s) && splitTop(s.slice(1, -1)).length > 1) return 'tuple';
  if (/^(True|False)$/.test(s) || /^not\s/.test(s) || /(==|!=|<=|>=|\band\b|\bor\b)/.test(s)) return 'bool';
  if (/\.(upper|lower|strip|title|join|replace)\(/.test(s)) return 'str';
  if (/math\.|(?<!\/)\/(?!\/)|\d\.\d|^round\(.*,/.test(s)) return 'float';
  if (/\/\/|%/.test(s) || /^(sum|max|min|abs)\(/.test(s) || (/\d/.test(s) && /[+\-*]/.test(s))) return 'int';
  return '';
}

function guessDesc(name, type, rhs = '') {
  const known = describe(name);
  if (known) return known;
  const s = rhs.trim();
  if (/input\(/.test(s)) return 'value entered by the user';
  let m = s.match(/^(\w+)\(/);
  if (m && !['int', 'float', 'str', 'list', 'dict', 'round', 'len', 'sum', 'max', 'min', 'abs'].includes(m[1])) return `result returned by ${m[1]}()`;
  if ((m = s.match(/^(sum|max|min|len)\((\w+)\)\s*\/\s*\w/))) return `average (mean) of ${m[2]}`;
  if ((m = s.match(/^(sum|max|min|len)\((\w+)/))) return `${{ sum: 'sum', max: 'largest value', min: 'smallest value', len: 'number of elements' }[m[1]]} of ${m[2]}`;
  if (/\.count\(/.test(s)) return 'number of occurrences';
  return { list: 'list of values', dict: 'dictionary (key → value)', str: 'stores text', bool: 'true / false flag', tuple: 'tuple of values', deque: 'queue used for the search', function: 'user-defined function' }[type] || 'stores a value used in the calculation';
}

export function pythonVDT(code) {
  const rows = new Map();
  const add = (name, type, desc) => {
    if (!/^[A-Za-z_]\w*$/.test(name) || name.startsWith('__') || ['print', 'self'].includes(name)) return;
    const cur = rows.get(name);
    if (!cur) { rows.set(name, { name, type: type || '', description: desc || describe(name) }); }
    else {
      if (!cur.type && type) cur.type = type;
      // a real assignment describes the variable better than "parameter of f()"
      if (desc && /^parameter of/.test(cur.description) && !/^parameter of/.test(desc)) cur.description = desc;
    }
    if (rows.get(name).type === 'NoneType') rows.get(name).type = '';
  };
  for (const raw of code.split('\n')) {
    const line = raw.replace(/#.*$/, '');
    let m;
    if ((m = line.match(/^\s*def\s+(\w+)\s*\(([^)]*)\)/))) {
      add(m[1], 'function', 'user-defined function');
      m[2].split(',').map(p => p.split('=')[0].trim()).filter(Boolean).forEach(p => add(p, '', 'parameter of ' + m[1] + '()'));
      continue;
    }
    if ((m = line.match(/^\s*for\s+(.+?)\s+in\s+(.+):/))) {
      const iter = m[2].trim();
      const t = /^range\(/.test(iter) ? 'int' : /\.items\(\)/.test(iter) ? '' : /^["']/.test(iter) ? 'str' : '';
      m[1].replace(/[()]/g, '').split(',').map(s => s.trim()).forEach(v => add(v, t, describe(v, 'loop variable')));
      continue;
    }
    if ((m = line.match(/^\s*([\w\s,[\]]+?)\s*([+\-*/%]?=)(?!=)\s*(.+)$/))) {
      const lhs = m[1], op = m[2], rhs = m[3];
      if (/\[/.test(lhs)) continue; // element assignment, not a new variable
      const names = lhs.split(',').map(s => s.trim());
      const parts = names.length > 1 ? splitTop(rhs) : [rhs];
      names.forEach((n, i) => { const r = parts[i] ?? rhs; const t = op === '=' ? inferPy(r) : (op === '/=' ? 'float' : ''); add(n, t, guessDesc(n, t, op === '=' ? r : '')); });
    }
    if ((m = line.match(/^\s*(?:from\s+\S+\s+)?import\s+(.+)/))) m[1].split(',').forEach(s => add(s.trim().split(/\s+as\s+/).pop(), 'module', 'imported module'));
  }
  return [...rows.values()].filter(r => r.type !== 'module');
}

function splitTop(s) {
  const out = []; let depth = 0, cur = '';
  for (const ch of s) {
    if ('([{'.includes(ch)) depth++; if (')]}'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}

const C_TYPES = 'int|long|float|double|char|bool|boolean|byte|unsigned\\s+int|unsigned\\s+long|String|Servo|const\\s+int|const\\s+char\\s*\\*?|word|short';
export function arduinoVDT(code) {
  const rows = new Map();
  const add = (name, type, desc) => { if (!rows.has(name)) rows.set(name, { name, type, description: desc || describe(name) }); };
  const src = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  for (const m of src.matchAll(/#define\s+(\w+)\s+(\S+)/g)) add(m[1], 'constant (#define)', /^\d+$|^A\d$/.test(m[2]) ? `pin ${m[2]}` : `constant = ${m[2]}`);
  for (const m of src.matchAll(new RegExp(`\\b(${C_TYPES}|void)\\s+(\\w+)\\s*\\(([^)]*)\\)\\s*\\{`, 'g'))) {
    const [, rt, fn, params] = m;
    if (fn !== 'setup' && fn !== 'loop') add(fn, `function (returns ${rt.replace(/\s+/g, ' ')})`, 'user-defined function');
    params.split(',').map(p => p.trim()).filter(p => p && p !== 'void').forEach(p => {
      const pm = p.match(/^(.*?)(\w+)\s*(\[\])?$/);
      if (pm) add(pm[2], pm[1].trim().replace(/\s+/g, ' ') + (pm[3] ? '[]' : ''), `parameter of ${fn}()`);
    });
  }
  for (const m of src.matchAll(new RegExp(`\\b(${C_TYPES})\\s+\\*?(\\w+)\\s*(\\[[^\\]]*\\])?\\s*(=\\s*([^;]*))?;`, 'g'))) {
    const type = m[1].replace(/\s+/g, ' ');
    const rhs = m[5] || '';
    const desc = type === 'Servo' ? 'servo motor object' : describe(m[2]) || (/digitalRead/.test(rhs) ? 'digital sensor reading (HIGH/LOW)' : /analogRead/.test(rhs) ? 'analog reading (0–1023)' : /pulseIn/.test(rhs) ? 'echo pulse width (µs)' : /^(\w+)\(/.test(rhs) ? `value returned by ${rhs.match(/^(\w+)/)[1]}()` : 'stores a value used in the sketch');
    add(m[2], type + (m[3] ? '[]' : ''), desc);
  }
  for (const m of src.matchAll(new RegExp(`for\\s*\\(\\s*(${C_TYPES})\\s+(\\w+)`, 'g'))) add(m[2], m[1], describe(m[2], 'loop counter'));
  return [...rows.values()];
}

export const makeVDT = (code, kind) => (kind === 'arduino' ? arduinoVDT(code) : pythonVDT(code));
