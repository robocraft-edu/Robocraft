// Reads a Python program the way a teacher would: which operators does it use,
// what does each one do, and what does every line mean. It works on the code
// itself (never on a model's description of it), so the explanation is always
// true for exactly what is on screen — even after the student edits it.

// ── what each operator does ──────────────────────────────────────────────────
export const OPERATORS = {
  '+':   { name: 'Addition',            group: 'Arithmetic', does: 'Adds two numbers. With text it joins them end to end.', example: '7 + 3  →  10     "Ro" + "bo"  →  "Robo"' },
  '-':   { name: 'Subtraction',         group: 'Arithmetic', does: 'Subtracts the right number from the left.', example: '7 - 3  →  4' },
  '*':   { name: 'Multiplication',      group: 'Arithmetic', does: 'Multiplies two numbers. With text and a whole number it repeats the text.', example: '7 * 3  →  21     "ab" * 3  →  "ababab"' },
  '/':   { name: 'Division',            group: 'Arithmetic', does: 'Divides and always gives a decimal (float) answer.', example: '7 / 2  →  3.5     8 / 2  →  4.0' },
  '//':  { name: 'Floor division',      group: 'Arithmetic', does: 'Divides and throws away the decimal part: how many times does it fit completely?', example: '7 // 2  →  3' },
  '%':   { name: 'Modulus (remainder)', group: 'Arithmetic', does: 'Gives what is left over after dividing. n % 2 == 0 is the classic "is it even?" test.', example: '7 % 2  →  1     10 % 5  →  0' },
  '**':  { name: 'Power (exponent)',    group: 'Arithmetic', does: 'Raises the left number to the power of the right.', example: '2 ** 5  →  32' },
  '=':   { name: 'Assignment',          group: 'Assignment', does: 'Stores the value on the right in the name on the left. It does NOT mean "equals" — that is ==.', example: 'age = 15   (age now holds 15)' },
  '+=':  { name: 'Add and assign',      group: 'Assignment', does: 'Shortcut: add to the variable and store the result back.', example: 'score += 10   is the same as   score = score + 10' },
  '-=':  { name: 'Subtract and assign', group: 'Assignment', does: 'Shortcut: subtract from the variable and store it back.', example: 'lives -= 1' },
  '*=':  { name: 'Multiply and assign', group: 'Assignment', does: 'Shortcut: multiply the variable and store it back.', example: 'total *= 2' },
  '/=':  { name: 'Divide and assign',   group: 'Assignment', does: 'Shortcut: divide the variable and store it back.', example: 'x /= 4' },
  '//=': { name: 'Floor-divide and assign', group: 'Assignment', does: 'Shortcut for x = x // y.', example: 'n //= 10' },
  '%=':  { name: 'Remainder and assign', group: 'Assignment', does: 'Shortcut for x = x % y.', example: 'n %= 7' },
  '**=': { name: 'Power and assign',    group: 'Assignment', does: 'Shortcut for x = x ** y.', example: 'x **= 2' },
  '==':  { name: 'Equal to',            group: 'Comparison', does: 'Checks whether two values are the same. Gives True or False.', example: '5 == 5  →  True     5 == 6  →  False' },
  '!=':  { name: 'Not equal to',        group: 'Comparison', does: 'True when the two values are different.', example: '5 != 6  →  True' },
  '<':   { name: 'Less than',           group: 'Comparison', does: 'True when the left value is smaller.', example: '3 < 5  →  True' },
  '>':   { name: 'Greater than',        group: 'Comparison', does: 'True when the left value is bigger.', example: '3 > 5  →  False' },
  '<=':  { name: 'Less than or equal',  group: 'Comparison', does: 'True when the left value is smaller or the same.', example: '5 <= 5  →  True' },
  '>=':  { name: 'Greater than or equal', group: 'Comparison', does: 'True when the left value is bigger or the same.', example: '5 >= 6  →  False' },
  'and': { name: 'Logical AND',         group: 'Logical', does: 'True only when BOTH sides are True.', example: 'age > 12 and age < 18  →  True for 15' },
  'or':  { name: 'Logical OR',          group: 'Logical', does: 'True when AT LEAST ONE side is True.', example: 'day == "Sat" or day == "Sun"' },
  'not': { name: 'Logical NOT',         group: 'Logical', does: 'Flips True to False and False to True.', example: 'not True  →  False' },
  'in':  { name: 'Membership',          group: 'Membership', does: 'True when the value is found inside a list, text, or dictionary.', example: '"a" in "cat"  →  True     3 in [1, 2]  →  False' },
  'not in': { name: 'Not a member',     group: 'Membership', does: 'True when the value is NOT found in the list or text.', example: '"z" not in "cat"  →  True' },
  'is':  { name: 'Identity',            group: 'Identity', does: 'True when both names point at the very same object (mostly used with None).', example: 'x is None' },
  'is not': { name: 'Not identical',    group: 'Identity', does: 'True when the two names are different objects.', example: 'x is not None' },
  '&':   { name: 'Bitwise AND',         group: 'Bitwise', does: 'Compares two numbers bit by bit and keeps the bits that are 1 in both.', example: '6 & 3  →  2' },
  '|':   { name: 'Bitwise OR',          group: 'Bitwise', does: 'Keeps a bit when it is 1 in either number.', example: '6 | 3  →  7' },
  '^':   { name: 'Bitwise XOR',         group: 'Bitwise', does: 'Keeps a bit when it is 1 in exactly one of the numbers.', example: '6 ^ 3  →  5' },
  '<<':  { name: 'Shift left',          group: 'Bitwise', does: 'Moves the bits left, which doubles the number for each step.', example: '1 << 3  →  8' },
  '>>':  { name: 'Shift right',         group: 'Bitwise', does: 'Moves the bits right, which halves the number for each step.', example: '8 >> 1  →  4' },
  ':=':  { name: 'Walrus (assign inside an expression)', group: 'Assignment', does: 'Stores a value and uses it in the same line.', example: 'if (n := len(items)) > 3:' },
  'neg': { name: 'Negative sign',       group: 'Arithmetic', does: 'A minus in front of a single number makes it negative.', example: '-5' },
  'kw=': { name: 'Keyword argument',    group: 'Function call', does: 'The = inside a call hands a value to a named option of the function.', example: 'print("a", end="")' },
  'unpack': { name: 'Unpacking (*)',    group: 'Function call', does: 'The * in front of a list spreads its items out as separate values.', example: 'print(*[1, 2, 3])  →  1 2 3' },
};

export const GROUP_ORDER = ['Arithmetic', 'Assignment', 'Comparison', 'Logical', 'Membership', 'Identity', 'Bitwise', 'Function call'];

// ── what the common words do ─────────────────────────────────────────────────
export const WORDS = {
  print:   { kind: 'function', does: 'Shows text and values on the screen.' },
  input:   { kind: 'function', does: 'Pauses and asks the user to type something. The answer always arrives as text (a str).' },
  int:     { kind: 'function', does: 'Turns text or a decimal into a whole number, e.g. int("42") → 42.' },
  float:   { kind: 'function', does: 'Turns text into a decimal number, e.g. float("3.5") → 3.5.' },
  str:     { kind: 'function', does: 'Turns a value into text so it can be joined with other text.' },
  len:     { kind: 'function', does: 'Counts the items in a list, or the characters in text.' },
  range:   { kind: 'function', does: 'Makes a sequence of numbers to loop over: range(5) gives 0,1,2,3,4.' },
  sum:     { kind: 'function', does: 'Adds up all the numbers in a list.' },
  max:     { kind: 'function', does: 'Finds the biggest value.' },
  min:     { kind: 'function', does: 'Finds the smallest value.' },
  round:   { kind: 'function', does: 'Rounds a number to the digits you ask for, e.g. round(3.14159, 2) → 3.14.' },
  abs:     { kind: 'function', does: 'Removes the minus sign: the distance from zero.' },
  sorted:  { kind: 'function', does: 'Gives back a sorted copy of a list.' },
  enumerate: { kind: 'function', does: 'Gives each item together with its position number while looping.' },
  zip:     { kind: 'function', does: 'Walks through two lists side by side.' },
  list:    { kind: 'function', does: 'Builds a list, or turns something else into one.' },
  dict:    { kind: 'function', does: 'Builds a dictionary of key → value pairs.' },
  isinstance: { kind: 'function', does: 'Checks what type a value is.' },
  append:  { kind: 'method', does: 'Adds one item to the end of a list.' },
  lower:   { kind: 'method', does: 'Makes all the letters small (lower case).' },
  upper:   { kind: 'method', does: 'Makes all the letters capital (upper case).' },
  strip:   { kind: 'method', does: 'Removes spaces from both ends of text.' },
  split:   { kind: 'method', does: 'Cuts text into a list of pieces at every separator.' },
  join:    { kind: 'method', does: 'Glues a list of text pieces into one string.' },
  format:  { kind: 'method', does: 'Puts values into the { } holes of a text template.' },
  randint: { kind: 'method', does: 'Picks a random whole number between two limits (both included).' },
  choice:  { kind: 'method', does: 'Picks one random item from a list.' },
  seed:    { kind: 'method', does: 'Fixes the random numbers so the program behaves the same every run.' },
  sqrt:    { kind: 'method', does: 'Square root of a number.' },
  keys:    { kind: 'method', does: 'All the keys of a dictionary.' },
  values:  { kind: 'method', does: 'All the values of a dictionary.' },
  items:   { kind: 'method', does: 'All the key → value pairs of a dictionary.' },
  if:      { kind: 'keyword', does: 'Runs the indented lines below only when the condition is True.' },
  elif:    { kind: 'keyword', does: 'Another condition to test when the earlier ones were False.' },
  else:    { kind: 'keyword', does: 'Runs when none of the conditions above were True.' },
  for:     { kind: 'keyword', does: 'Repeats the indented lines once for every item in a sequence.' },
  while:   { kind: 'keyword', does: 'Repeats the indented lines again and again as long as the condition stays True.' },
  break:   { kind: 'keyword', does: 'Leaves the loop immediately.' },
  continue:{ kind: 'keyword', does: 'Skips the rest of this round and jumps to the next one.' },
  def:     { kind: 'keyword', does: 'Defines a function: a named block of code you can run again and again.' },
  return:  { kind: 'keyword', does: 'Sends a value back from a function and ends it.' },
  class:   { kind: 'keyword', does: 'Defines a blueprint for objects that keep data and the actions that use it.' },
  import:  { kind: 'keyword', does: 'Brings in a ready-made module (random, math, …).' },
  try:     { kind: 'keyword', does: 'Tries some code, and lets the except part catch any error.' },
  except:  { kind: 'keyword', does: 'Runs if the try part raised an error, so the program does not crash.' },
  True:    { kind: 'value', does: 'The yes value. Comparisons give True or False (a bool).' },
  False:   { kind: 'value', does: 'The no value.' },
  None:    { kind: 'value', does: 'Means "nothing here yet".' },
  self:    { kind: 'keyword', does: 'Inside a class: the object the method is working on.' },
};

// ── tokenising ───────────────────────────────────────────────────────────────
const FILL = '§';   // stands in for the characters of a string, so a string still looks like an operand

/** Replaces every string with § and every comment with spaces (same length) so operators inside text are never counted. */
export function blankStringsAndComments(code) {
  const s = String(code || '');
  let out = '';
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '#') { while (i < s.length && s[i] !== '\n') { out += ' '; i++; } continue; }
    const m = /^([rRbBfFuU]{0,2})('''|"""|'|")/.exec(s.slice(i, i + 6));
    if (m && (m[1] === '' || /[a-zA-Z]/.test(m[1]))) {
      const prefixLen = m[1].length, q = m[2];
      if (prefixLen === 0 || !/[A-Za-z0-9_]/.test(s[i - 1] || ' ')) {
        out += FILL.repeat(prefixLen + q.length);
        i += prefixLen + q.length;
        while (i < s.length && !s.startsWith(q, i)) {
          if (s[i] === '\\') { out += FILL + FILL; i += 2; continue; }
          if (s[i] === '\n') { if (q.length === 1) break; out += '\n'; } else out += FILL;
          i++;
        }
        if (s.startsWith(q, i)) { out += FILL.repeat(q.length); i += q.length; }
        continue;
      }
    }
    out += c; i++;
  }
  return out;
}

const SYMBOLS = /\*\*=|\/\/=|<<|>>|:=|\*\*|\/\/|==|!=|<=|>=|\+=|-=|\*=|\/=|%=|->|[+\-*/%<>=&|^~]/g;

/** Every operator on one (already blanked) line, with the role it plays. */
function operatorsOnLine(line, depthStart) {
  const found = [];
  let depth = depthStart;
  // `for x in y` and `import … as …` use the word "in" as part of the statement, not as a test
  const text = line.replace(/\b(for\s+[\w\s,()]+?\s+)in\b/g, (_, a) => a + '  ');
  const walk = text.replace(/\bnot\s+in\b/g, ' not_in ').replace(/\bis\s+not\b/g, ' is_not ');
  const re = new RegExp(SYMBOLS.source + '|\\b(?:and|or|not|in|is|not_in|is_not)\\b|[()\\[\\]{}]', 'g');
  let m;
  while ((m = re.exec(walk))) {
    const t = m[0];
    if ('([{'.includes(t)) { depth++; continue; }
    if (')]}'.includes(t)) { depth = Math.max(0, depth - 1); continue; }
    if (t === '->' || t === '~') continue;
    const before = walk.slice(0, m.index).trimEnd();
    const prev = before.slice(-1);
    const afterOperand = /[\w§)\]}]/.test(prev) && !/\b(and|or|not|in|is|return|if|elif|while|print|yield|else|lambda)$/.test(before);
    let op = t;
    if (t === 'not_in') op = 'not in';
    else if (t === 'is_not') op = 'is not';
    else if (t === '=') op = depth > 0 ? 'kw=' : '=';
    else if (t === '-' && !afterOperand) op = 'neg';
    else if (t === '+' && !afterOperand) continue;
    else if ((t === '*' || t === '**') && !afterOperand) op = 'unpack';
    if (OPERATORS[op]) found.push(op);
  }
  return { ops: found, depth };
}

/** Walks the code and gathers, per operator, the lines where it appears. */
export function analyze(code) {
  const src = String(code || '').replace(/\r\n?/g, '\n');
  const raw = src.split('\n');
  const blank = blankStringsAndComments(src).split('\n');
  const opMap = new Map();
  const wordMap = new Map();
  const lines = [];
  let depth = 0;

  blank.forEach((b, idx) => {
    const n = idx + 1;
    const text = raw[idx] || '';
    const res = operatorsOnLine(b, depth);
    depth = res.depth;
    const here = [...new Set(res.ops)];
    here.forEach(op => {
      if (!opMap.has(op)) opMap.set(op, { op, ...OPERATORS[op], count: 0, lines: [] });
      const e = opMap.get(op);
      e.count += res.ops.filter(x => x === op).length;
      if (e.lines.length < 4) e.lines.push({ n, text: text.trim() });
    });
    // words (keywords and well-known functions)
    const seen = new Set();
    for (const w of b.match(/[A-Za-z_][A-Za-z0-9_]*/g) || []) {
      const info = WORDS[w];
      if (!info || seen.has(w)) continue;
      if (info.kind === 'keyword' && w === 'self') continue;
      seen.add(w);
      if (!wordMap.has(w)) wordMap.set(w, { word: w, ...info, count: 0, lines: [] });
      const e = wordMap.get(w);
      e.count++;
      if (e.lines.length < 3) e.lines.push({ n, text: text.trim() });
    }
    lines.push({ n, text, ops: here, ...explainLine(text, here) });
  });

  const operators = [...opMap.values()].sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || b.count - a.count);
  const words = [...wordMap.values()];
  return { operators, words, lines, codeLines: lines.filter(l => l.text.trim() && !l.text.trim().startsWith('#')).length };
}

// ── explaining one line ──────────────────────────────────────────────────────
const short = (op) => `${op === 'neg' ? '−' : op === 'kw=' ? '=' : op} (${OPERATORS[op].name.toLowerCase()})`;
const sayOps = (ops) => {
  const list = ops.filter(o => o !== 'kw=' && o !== 'unpack');
  return list.length ? ` Operators here: ${list.map(short).join(', ')}.` : '';
};

/** A plain-English reading of one line, plus a small "kind" tag for colouring. */
export function explainLine(rawLine, ops = []) {
  const t = String(rawLine || '').trim();
  const O = sayOps(ops);
  if (!t) return { kind: 'blank', explain: '' };
  if (t.startsWith('#')) return { kind: 'comment', explain: 'A comment. Python skips it; it is a note for the humans reading the code.' };
  let m;
  if ((m = /^from\s+([\w.]+)\s+import\s+(.+)$/.exec(t))) return { kind: 'import', explain: `Brings ${m[2]} from the ${m[1]} module into this program so we can use it.` };
  if ((m = /^import\s+([\w.]+)(?:\s+as\s+(\w+))?/.exec(t))) return { kind: 'import', explain: `Loads the ${m[1]} module${m[2] ? ` and gives it the short name ${m[2]}` : ''}. A module is a toolbox of ready-made code.` };
  if ((m = /^class\s+(\w+)/.exec(t))) return { kind: 'def', explain: `Starts the class ${m[1]}: a blueprint. Each object made from it keeps its own data and can use the functions (methods) written inside.` };
  if ((m = /^def\s+(\w+)\s*\((.*)\)\s*(?:->.*)?:/.exec(t))) {
    const params = m[2].trim();
    const special = m[1] === '__init__' ? ' __init__ runs automatically when a new object is created.' : '';
    return { kind: 'def', explain: `Defines the function ${m[1]}${params ? ` that receives: ${params}` : ' (it needs no inputs)'}. Nothing inside runs until the function is called.${special}` };
  }
  if ((m = /^return\b\s*(.*)$/.exec(t))) return { kind: 'return', explain: m[1] ? `Sends the value ${m[1]} back to whoever called this function and stops the function.${O}` : 'Ends the function.' };
  if ((m = /^if\s+(.+):$/.exec(t))) return { kind: 'branch', explain: `Asks a question: is ${m[1]} True? If yes, the indented lines below run; if not, Python skips them.${O}` };
  if ((m = /^elif\s+(.+):$/.exec(t))) return { kind: 'branch', explain: `"Else if": only checked when the earlier conditions were False. Is ${m[1]} True?${O}` };
  if (/^else\s*:/.test(t)) return { kind: 'branch', explain: 'The "otherwise" part: runs when none of the conditions above were True.' };
  if ((m = /^for\s+(.+?)\s+in\s+(.+):$/.exec(t))) {
    const r = /^range\((.*)\)$/.exec(m[2].trim());
    const extra = r ? ` range(${r[1]}) produces the numbers to count through (it stops one before the end value).` : '';
    return { kind: 'loop', explain: `A for loop: repeats the indented block once for every item in ${m[2]}. Each time, ${m[1]} holds the current item.${extra}` };
  }
  if ((m = /^while\s+(.+):$/.exec(t))) return { kind: 'loop', explain: `A while loop: keeps repeating the indented block as long as ${m[1]} is True. Something inside must eventually make it False, or the loop never ends.${O}` };
  if (/^break\b/.test(t)) return { kind: 'loop', explain: 'Jumps out of the loop right now.' };
  if (/^continue\b/.test(t)) return { kind: 'loop', explain: 'Skips the rest of this round of the loop and starts the next one.' };
  if (/^pass\b/.test(t)) return { kind: 'plain', explain: 'Does nothing. It is a placeholder where Python needs a line.' };
  if (/^try\s*:/.test(t)) return { kind: 'branch', explain: 'Tries the indented code. If it causes an error, Python jumps to the except block instead of crashing.' };
  if ((m = /^except\b\s*(.*):$/.exec(t))) return { kind: 'branch', explain: `Runs only when the try block raised an error${m[1] ? ` (${m[1]})` : ''}, so the program can recover.` };
  if ((m = /^(?:print)\s*\((.*)\)\s*$/.exec(t))) {
    const f = /\bf["']/.test(m[1]) ? ' The f before the quote makes it an f-string: anything in { } is replaced by its value.' : '';
    return { kind: 'output', explain: `Shows this on the screen: ${m[1] || 'an empty line'}.${f}${O}` };
  }
  if ((m = /^(\w+)\s*=\s*(?:(int|float)\s*\(\s*)?input\s*\((.*?)\)\s*\)?\s*$/.exec(t))) {
    const conv = m[2] ? ` ${m[2]}( ) then turns that text into ${m[2] === 'int' ? 'a whole number' : 'a decimal number'}, so you can do maths with it.` : ' input() always returns text (a str), even if you type digits.';
    return { kind: 'input', explain: `Asks the user a question (${m[3] || 'no prompt'}) and stores the answer in ${m[1]}.${conv}` };
  }
  if ((m = /^([\w.[\]"']+)\s*(\+=|-=|\*\*=|\*=|\/\/=|\/=|%=)\s*(.+)$/.exec(t))) return { kind: 'assign', explain: `Updates ${m[1]} in place: ${m[1]} ${m[2][0] === '*' && m[2] === '**=' ? '**' : m[2].slice(0, -1)} ${m[3]}, and the result is stored back in ${m[1]}.${O}` };
  if ((m = /^(\w+(?:\s*,\s*\w+)+)\s*=\s*(.+)$/.exec(t))) return { kind: 'assign', explain: `Stores several values at once: ${m[1]} receive the parts of ${m[2]} in order.${O}` };
  if ((m = /^([\w.]+)\s*=\s*\[(.*)\]\s*$/.exec(t))) return { kind: 'assign', explain: m[2].trim() ? `Creates a list called ${m[1]} holding ${m[2]}. A list keeps items in order and each has a position number starting at 0.` : `Creates an empty list called ${m[1]}, ready to be filled with append().` };
  if ((m = /^([\w.]+)\s*=\s*\{(.*)\}\s*$/.exec(t))) return { kind: 'assign', explain: m[2].trim() ? `Creates a dictionary called ${m[1]}: pairs of key: value, so you can look a value up by its key.` : `Creates an empty dictionary called ${m[1]}.` };
  if ((m = /^([\w.[\]"']+)\s*=\s*(.+)$/.exec(t))) {
    const rhs = m[2];
    const call = /^(\w+)\(/.exec(rhs);
    const fn = call && WORDS[call[1]] ? ` ${call[1]}() ${WORDS[call[1]].does.charAt(0).toLowerCase()}${WORDS[call[1]].does.slice(1)}` : '';
    return { kind: 'assign', explain: `Works out ${rhs} and stores the result in ${m[1]}.${fn}${O}` };
  }
  if ((m = /^([\w.]+)\.append\((.*)\)$/.exec(t))) return { kind: 'call', explain: `Adds ${m[2]} to the end of the list ${m[1]}.` };
  if ((m = /^([\w.]+)\((.*)\)$/.exec(t))) return { kind: 'call', explain: `Calls ${m[1]}${m[2] ? ` with ${m[2]}` : ''}: runs the code stored under that name.${O}` };
  return { kind: 'plain', explain: `Runs: ${t}${O}` };
}
