import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PartyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

const PartyImage: React.FC<PartyImageProps> = ({ src, alt, className = "", fallbackText = "?" }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // If the image fails to load, we show a stylized fallback with the first letter
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-zinc-100 text-zinc-400 font-black rounded-full border border-zinc-200 ${className}`}>
        {fallbackText[0]}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-50">
          <Loader2 className="animate-spin text-zinc-300" size={16} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default PartyImage;
