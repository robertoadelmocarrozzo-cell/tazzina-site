document.addEventListener('DOMContentLoaded', () => {

  // ----- Mobile nav toggle -----
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ----- Open today (dynamic hours) -----
  // Edit the schedule or holidays below to update the homepage "Open today" card.
  const schedule = {
    0: ['8am – 1pm', '5pm – 9pm'],   // Sunday
    1: ['Closed'],                    // Monday
    2: ['7am – 1pm', '5pm – 9pm'],   // Tuesday
    3: ['7am – 1pm', '5pm – 9pm'],   // Wednesday
    4: ['7am – 1pm', '5pm – 9pm'],   // Thursday
    5: ['7am – 1pm', '5pm – 9pm'],   // Friday
    6: ['8am – 1pm', '5pm – 9pm'],   // Saturday
  };
  // One-off overrides. Format: 'YYYY-MM-DD': ['line 1', 'line 2', ...]
  const holidays = {
    // '2026-04-25': ['Closed – Anzac Day'],
    // '2026-12-25': ['Closed – Christmas Day'],
  };
  const openCard = document.querySelector('[data-open-today]');
  if (openCard) {
    const now = new Date();
    const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const lines = holidays[key] || schedule[now.getDay()];
    openCard.querySelectorAll('p').forEach(p => p.remove());
    lines.forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      openCard.appendChild(p);
    });
  }

  // ----- Menu tab filter -----
  const tabs = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('[data-category]');
  if (tabs.length && sections.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('on'));
        tab.classList.add('on');
        const filter = tab.dataset.filter;
        sections.forEach(sec => {
          sec.style.display = (filter === 'all' || sec.dataset.category === filter) ? '' : 'none';
        });
      });
    });
  }
});
