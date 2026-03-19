import React, { useState, useEffect } from 'react';

interface BackgroundSliderProps {
  images: string[];
  interval?: number;
}

const BackgroundSlider: React.FC<BackgroundSliderProps> = ({ 
  images, 
  interval = 6000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}
    </div>
  );
};

export default BackgroundSlider;
