import React, { useEffect, useRef, useState } from 'react';

const OrbitImages = ({
  images = [],
  radius = 140,
  radiusX,
  radiusY,
  duration = 30,
  itemSize = 40,
  centerContent = null,
  pathColor = 'rgba(0,0,0,0.05)',
  showPath = true,
  rotation = 0,
  responsive = true,
}) => {
  const rx = radiusX || radius;
  const ry = radiusY || radius;
  const containerWidth = (rx + itemSize) * 2;
  const containerHeight = (ry + itemSize) * 2;
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000; // seconds
      const progress = elapsed / duration; // fraction of full revolution

      const newPositions = images.map((_, index) => {
        const offsetAngle = (360 / images.length) * index;
        const currentAngle = (progress * 360 + offsetAngle) % 360;
        const radian = (currentAngle * Math.PI) / 180;
        return {
          x: Math.cos(radian) * rx,
          y: Math.sin(radian) * ry,
        };
      });

      setPositions(newPositions);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [images.length, rx, ry, duration]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: responsive ? '100%' : containerWidth,
        height: responsive ? '100%' : containerHeight,
        minWidth: containerWidth,
        minHeight: containerHeight,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Orbit Path */}
      {showPath && (
        <svg
          className="absolute pointer-events-none"
          width={rx * 2 + 4}
          height={ry * 2 + 4}
          viewBox={`0 0 ${rx * 2 + 4} ${ry * 2 + 4}`}
        >
          <ellipse
            cx={rx + 2}
            cy={ry + 2}
            rx={rx}
            ry={ry}
            fill="none"
            stroke={pathColor}
            strokeWidth={2}
          />
        </svg>
      )}

      {/* Center Content */}
      {centerContent && (
        <div className="absolute z-10" style={{ transform: `rotate(${-rotation}deg)` }}>
          {centerContent}
        </div>
      )}

      {/* Orbiting Items */}
      {images.map((src, index) => {
        const pos = positions[index];
        if (!pos) return null;

        return (
          <div
            key={index}
            className="absolute"
            style={{
              width: itemSize,
              height: itemSize,
              transform: `translate(${pos.x - itemSize / 2}px, ${pos.y - itemSize / 2}px)`,
              transition: 'none',
              willChange: 'transform',
            }}
          >
            <div
              className="w-full h-full rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center p-2 hover:scale-125 transition-transform duration-300"
              style={{ transform: `rotate(${-rotation}deg)` }}
            >
              <img
                src={src}
                alt={`orbit-item-${index}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrbitImages;
