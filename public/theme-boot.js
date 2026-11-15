/* Runs before the first paint: applies the saved light/dark choice (no theme
   flash) and marks the page as script-capable, which hides the plain-HTML
   landing text meant for crawlers and shows the boot screen instead.
   This has to live in a file: the page's CSP forbids inline scripts. */
(function () {
  document.documentElement.classList.add('js');
  try {
    var t = localStorage.getItem('robocraft_theme');
    // No saved choice: start in the bright "Clean Lab" look.
    if (t !== 'light' && t !== 'dark') t = 'light';
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) { /* storage blocked: stay light */ }
})();
