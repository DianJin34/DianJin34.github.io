(function(){
  const container = document.getElementById('pdfContainer');
  if (!container || !window['pdfjsLib']) return;
  const url = container.getAttribute('data-src');
  const ratio = 1.5; // scale for readability
  container.innerHTML = '';
  container.style.display = 'grid';
  container.style.placeItems = 'center';
  container.style.height = '100%';
  container.style.overflow = 'auto';

  const progress = document.createElement('div');
  progress.textContent = 'Loading resume…';
  progress.style.color = '#a0a5b8';
  progress.style.padding = '8px';
  container.appendChild(progress);

  try {
    // Configure worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    pdfjsLib.getDocument(url).promise.then(async (pdf) => {
      progress.remove();
      const pagesWrap = document.createElement('div');
      pagesWrap.style.width = '100%';
      pagesWrap.style.maxWidth = '900px';
      pagesWrap.style.padding = '8px 0 16px';
      container.appendChild(pagesWrap);

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: ratio });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto 12px';
        canvas.style.background = '#0b0f1f';
        canvas.style.border = '1px solid rgba(255,255,255,0.08)';
        canvas.style.borderRadius = '8px';
        pagesWrap.appendChild(canvas);

        await page.render({ canvasContext: ctx, viewport }).promise;
      }
    }).catch((err) => {
      console.error('PDF load error', err);
      // Keep fallback visible
      container.innerHTML = '';
      container.insertAdjacentHTML('beforeend', `
        <div class="fallback">
          <p>Unable to render the PDF preview.</p>
          <p>
            <a class="btn primary" href="${url}" target="_blank" rel="noopener">Open in new tab</a>
            <a class="btn" href="${url}" download>Download PDF</a>
          </p>
        </div>
      `);
    });
  } catch (e) {
    console.error('PDF init error', e);
  }
})();
