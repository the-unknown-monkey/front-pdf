import React from 'react';
import { X } from 'lucide-react';
import smallai from "./smallai.jpg";

interface WelcomeProps {
  onClose: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="relative">
          <img
            src={smallai} alt="Welcome" className="w-full h-64 object-cover"
        
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Hi Sudarshan kamath 
          </h1>
          <p className="text-gray-600 text-lg mb-6">
          I saw an upcoming feature, 'PDF to Voice,' on your website, so I thought, why not make one . I'm not a pro developer, but I have late-night hackathon proficiency in everything. Who doesn’t love building things from 0 to 1? Now, this is another one for me .Please add Node.js capabilities. Additionally, include a 'Notes' section clearly stating that Python 3.10 is supported and 3.13 is not. This will save users significant time.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg 
                     hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
