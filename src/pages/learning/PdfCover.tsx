// src/pages/learning/PdfCover.tsx
import React, { useState, useEffect } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const API_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_PRODUCTION_URL ||
  'http://localhost:8080';

interface Props {
  url: string;
  materialId: string;
}

const PdfCover: React.FC<Props> = ({ url, materialId }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = localStorage.getItem('authToken');
        const httpHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const tryRender = async (sourceUrl: string) => {
          const pdf = await getDocument({ url: sourceUrl, httpHeaders }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.3 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) return;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, canvas, viewport } as any).promise;
          if (!cancelled) setImgSrc(canvas.toDataURL('image/png'));
        };

        try {
          await tryRender(url);
        } catch {
          await tryRender(`${API_URL}/api/learning-materials/${materialId}/file`);
        }
      } catch {
        if (!cancelled) setImgSrc(null);
      }
    })();

    return () => { cancelled = true; };
  }, [url, materialId]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {imgSrc
        ? <img src={imgSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
        : <div className="absolute inset-0 bg-gray-200" />
      }
    </div>
  );
};

export default PdfCover;
