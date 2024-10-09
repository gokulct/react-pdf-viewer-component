import * as pdfjsLib from 'pdfjs-dist/webpack';
import { default_navigator_page_size } from './Constants';

export const extractImageFromPDF = async (pdfUrl, pageNumber) => {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    try {
      const pdfDocument = await loadingTask.promise;
      const page = await pdfDocument.getPage(pageNumber);
      const scale = 2;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
  
      await page.render(renderContext).promise;
      const imgDataUrl = canvas.toDataURL('image/png');
  
      return imgDataUrl;
    } catch (error) {
      console.error('Error extracting image from PDF:', error);
    }
};
  
export const extractThumbnailsFromPDF = async (pdfUrl,page) => {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    
    try {
        debugger;
        const size = default_navigator_page_size;
        const pdfDocument = await loadingTask.promise;
        const totalPages = pdfDocument.numPages;
        const maxPages = Math.min(totalPages, page * size);
        const from = (page * size) - size;
        const thumbnails = [];
    
        for (let pageNumber = from+1; pageNumber <= maxPages; pageNumber++) {
            const page = await pdfDocument.getPage(pageNumber);
            const scale = 0.5; 
            const viewport = page.getViewport({ scale });
    
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const renderContext = {
            canvasContext: context,
            viewport: viewport,
            };
    
            await page.render(renderContext).promise;
            const imgDataUrl = canvas.toDataURL('image/png');
            thumbnails.push(imgDataUrl); 
        }
  
        return { totalPages,thumbnails };
    } catch (error) {
      console.error('Error extracting thumbnails from PDF:', error);
    }
};
export const printPDF = async (url) => {
  const iframe = document.createElement('iframe');
  const scale = 6;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  const iframeDoc = iframe.contentWindow.document;
  pdfjsLib.getDocument(url).promise.then(pdfDoc => {
    const totalPages = pdfDoc.numPages;
    let renderedPages = 0;
    function renderPage(pageNum) {
      pdfDoc.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        page.render(renderContext).promise.then(() => {
          iframeDoc.body.appendChild(canvas);
          renderedPages++;
          if (renderedPages === totalPages) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            document.body.removeChild(iframe); 
            return {status:'success'}
          }
        });
      });
    }
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      renderPage(pageNum);
    }
  });
}