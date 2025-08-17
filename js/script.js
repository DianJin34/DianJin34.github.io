// Simple interactions for the profile page
(function () {
  const byId = (id) => document.getElementById(id);
  const yearEl = document.getElementById('year');

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
