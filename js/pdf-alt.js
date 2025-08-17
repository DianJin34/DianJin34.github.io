(function(){
  const altBtn = document.getElementById('altViewerBtn');
  const altContainer = document.getElementById('pdfAlt');
  if (!altBtn || !altContainer) return;

  async function loadPdfJs() {
    if (window.pdfjsLib) return window.pdfjsLib;
    await new Promise((resolve, reject) => {
      const s1 = document.createElement('script');
      s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s1.onload = resolve; s1.onerror = reject; document.head.appendChild(s1);
    });
    await new Promise((resolve, reject) => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      s2.onload = resolve; s2.onerror = reject; document.head.appendChild(s2);
    });
    return window.pdfjsLib;
  }

  altBtn.addEventListener('click', async () => {
    try {
      altBtn.disabled = true; altBtn.textContent = 'Loading…';
      const url = altContainer.getAttribute('data-src');
      const pdfjsLib = await loadPdfJs();
      if (!pdfjsLib) throw new Error('PDF.js not available');
      altContainer.classList.remove('hidden');
      altContainer.innerHTML = '';
      altContainer.style.height = '100%';
      altContainer.style.overflow = 'auto';
      const wrap = document.createElement('div');
      wrap.style.maxWidth = '900px'; wrap.style.margin = '0 auto';
      altContainer.appendChild(wrap);

      const pdf = await pdfjsLib.getDocument(url).promise;
      for (let i=1;i<=pdf.numPages;i++){
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width; canvas.height = viewport.height;
        canvas.style.display = 'block'; canvas.style.margin = '0 auto 12px';
        wrap.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      }
      altBtn.textContent = 'Alternate viewer loaded';
    } catch (e) {
      console.error(e);
      altBtn.textContent = 'Alternate viewer failed';
    }
  });
})();
