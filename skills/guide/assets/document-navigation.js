document.querySelectorAll('[data-document-navigation]').forEach((root) => {
  const trigger = root.querySelector('[data-document-nav-toggle]');
  const panel = root.querySelector('[data-document-nav-panel]');
  if (!trigger || !panel) return;
  const breakpoint = Number(root.dataset.documentNavBreakpoint) || 912;
  const compact = matchMedia(`(max-width: ${breakpoint - 1}px)`);
  const setOpen = (open, returnFocus = false) => {
    trigger.setAttribute('aria-expanded', String(open));
    root.dataset.navOpen = String(open);
    if (compact.matches) panel.hidden = !open;
    else panel.hidden = false;
    if (returnFocus) trigger.focus({ preventScroll: true });
  };
  const sync = () => {
    trigger.hidden = !compact.matches;
    setOpen(false);
  };
  trigger.addEventListener('click', () => setOpen(trigger.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const label = trigger.querySelector('[data-document-nav-current]');
    if (label) label.textContent = link.dataset.label || link.textContent.trim();
    if (compact.matches) setOpen(false, true);
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      setOpen(false, true);
    }
  });
  document.addEventListener('click', (event) => {
    if (compact.matches && !root.contains(event.target)) setOpen(false);
  });
  window.addEventListener('hashchange', () => {
    const active = panel.querySelector('a[aria-current="page"]');
    const label = trigger.querySelector('[data-document-nav-current]');
    if (active && label) label.textContent = active.dataset.label || active.textContent.trim();
  });
  compact.addEventListener('change', sync);
  sync();
});
