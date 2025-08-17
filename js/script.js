// Simple interactions for the profile page
(function () {
  const byId = (id) => document.getElementById(id);
  const resumeSection = document.getElementById('resume');
  const yearEl = document.getElementById('year');
  const openers = [byId('viewResume'), byId('navViewResume')].filter(Boolean);
  const closer = byId('closeResume');

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function openResume() {
    if (!resumeSection) return;
    resumeSection.classList.remove('hidden');
    resumeSection.setAttribute('aria-hidden', 'false');
    openers.forEach((el) => el && el.setAttribute('aria-expanded', 'true'));
  }
  function closeResume() {
    if (!resumeSection) return;
    resumeSection.classList.add('hidden');
    resumeSection.setAttribute('aria-hidden', 'true');
    openers.forEach((el) => el && el.setAttribute('aria-expanded', 'false'));
  }

  openers.forEach((el) => el && el.addEventListener('click', openResume));
  if (closer) closer.addEventListener('click', closeResume);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeResume(); });
})();
