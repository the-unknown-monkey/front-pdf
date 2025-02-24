import React, { useState } from 'react';
import { FileText, Download, Volume2 } from 'lucide-react';
import Welcome from './components/Welcome';
import PDFViewer from './components/PDFViewer';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [pdfText, setPdfText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleTextToSpeech = () => {
    if (pdfText) {
      const utterance = new SpeechSynthesisUtterance(pdfText);
      window.speechSynthesis.speak(utterance);
    }
  };

  const downloadAudio = async () => {
    if (!pdfText) return;

    try {
      // Step 1: Send text to backend for TTS processing
      const response = await fetch("http://127.0.0.1:8000/text-to-speech/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pdfText }),
      });

      const data = await response.json();

      if (response.ok) {
        // Step 2: Download the generated audio file
        const audioResponse = await fetch(data.audio_url);
        const audioBlob = await audioResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = "output.wav";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Error:", data.detail);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  if (showWelcome) {
    return <Welcome onClose={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            PDF to AUDIO
          </h1>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF File
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {selectedFile && (
            <PDFViewer file={selectedFile} onTextExtracted={setPdfText} />
          )}

          {pdfText && (
            <div className="mt-6 space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleTextToSpeech}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Volume2 className="w-5 h-5 mr-2" />
                  Play Audio
                </button>
               
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
