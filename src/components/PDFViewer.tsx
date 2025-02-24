import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

interface PDFViewerProps {
  file: File;
  onTextExtracted: (text: string) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onTextExtracted }) => {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);
        setText('');

        // Clean up previous PDF document
        if (pdfDoc) {
          pdfDoc.destroy();
          setPdfDoc(null);
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPdfDoc(pdf);
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        }
        
        setText(fullText);
        onTextExtracted(fullText);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setError('Failed to load PDF. Please make sure you selected a valid PDF file.');
        setText('');
        onTextExtracted('');
      } finally {
        setLoading(false);
      }
    };

    if (file) {
      loadPDF();
    }

    // Cleanup function
    return () => {
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, [file, onTextExtracted]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="font-medium">{error}</p>
        <p className="text-sm mt-2">Try uploading a different PDF file or make sure the file isn't corrupted.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">PDF Content:</h2>
      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
        <pre className="whitespace-pre-wrap font-sans text-gray-700">{text}</pre>
      </div>
    </div>
  );
};

export default PDFViewer;