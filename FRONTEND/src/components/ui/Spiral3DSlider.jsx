import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// Individual Image Plane arranged on a rotating cylinder with gentle helix offset
function SpiralCard({ item, index, total, radius, helixSpread, cardWidth, cardAspectRatio, scrollOffsetRef }) {
  const meshRef = useRef();
  const cardHeight = cardWidth / cardAspectRatio;

  // Load texture via R3F's Suspense-compatible loader
  const texture = useLoader(THREE.TextureLoader, item.src);
  texture.colorSpace = THREE.SRGBColorSpace;

  // Custom grayscale shader for monochrome treatment
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main() {
          vec4 tex = texture2D(uTexture, vUv);
          float gray = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
          gray = smoothstep(0.05, 0.95, gray);
          gl_FragColor = vec4(vec3(gray), tex.a);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
    });
  }, [texture]);

  // Base angle for this card (evenly spaced around the circle)
  const baseAngle = (index / total) * Math.PI * 2;

  useFrame(() => {
    if (!meshRef.current) return;

    const offset = scrollOffsetRef.current;
    // Rotate the angle by the scroll offset — pure rotation, no vertical drift
    const angle = baseAngle + offset;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    // Fixed Y: gentle helix offset so cards aren't all on the same plane
    const y = (index - (total - 1) / 2) * helixSpread;

    meshRef.current.position.set(x, y, z);
    meshRef.current.lookAt(0, y, 0);
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[cardWidth, cardHeight]} />
    </mesh>
  );
}

// Loading fallback planes
function FallbackCard({ index, total, radius, helixSpread, cardWidth, cardAspectRatio }) {
  const cardHeight = cardWidth / cardAspectRatio;
  const angle = (index / total) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = (index - (total - 1) / 2) * helixSpread;

  return (
    <mesh position={[x, y, z]}>
      <planeGeometry args={[cardWidth, cardHeight]} />
      <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
    </mesh>
  );
}

// Scene that reads the shared scrollOffsetRef every frame
function SpiralScene({ items, autoSpeed, radius, helixSpread, cardWidth, cardAspectRatio, scrollProgressRef }) {
  const scrollOffsetRef = useRef(0);
  const idleOffsetRef = useRef(0);
  const prevProgressRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  useFrame((_, delta) => {
    const currentProgress = scrollProgressRef.current;
    const progressDelta = Math.abs(currentProgress - prevProgressRef.current);

    // Detect if user is actively scrolling (progress is changing)
    if (progressDelta > 0.0001) {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    }

    if (isScrollingRef.current) {
      // Scroll-driven: map scroll progress (0→1) to two full rotations
      const scrollDriven = currentProgress * Math.PI * 4;
      scrollOffsetRef.current = idleOffsetRef.current + scrollDriven;
    } else {
      // Idle auto-rotation: slow continuous drift
      idleOffsetRef.current += autoSpeed * delta;
      const scrollDriven = currentProgress * Math.PI * 4;
      scrollOffsetRef.current = idleOffsetRef.current + scrollDriven;
    }

    prevProgressRef.current = currentProgress;
  });

  return (
    <group>
      {items.map((item, index) => (
        <SpiralCard
          key={index}
          item={item}
          index={index}
          total={items.length}
          radius={radius}
          helixSpread={helixSpread}
          cardWidth={cardWidth}
          cardAspectRatio={cardAspectRatio}
          scrollOffsetRef={scrollOffsetRef}
        />
      ))}
    </group>
  );
}

function FallbackScene({ items, radius, helixSpread, cardWidth, cardAspectRatio }) {
  return (
    <group>
      {items.map((_, index) => (
        <FallbackCard
          key={index}
          index={index}
          total={items.length}
          radius={radius}
          helixSpread={helixSpread}
          cardWidth={cardWidth}
          cardAspectRatio={cardAspectRatio}
        />
      ))}
    </group>
  );
}

export function Spiral3DSlider({
  items = [],
  autoSpeed = 0.15,
  radius = 8,
  helixSpread = 0.6,
  cardWidth = 4.5,
  cardAspectRatio = 1.5,
  className = "",
  ariaLabel = "Spiral image gallery",
  scrollProgressRef,
}) {
  // Fallback ref if none provided
  const fallbackRef = useRef(0);
  const progressRef = scrollProgressRef || fallbackRef;

  return (
    <div className={`relative w-full h-[650px] bg-black overflow-hidden ${className}`} aria-label={ariaLabel} role="img">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000');
        }}
      >
        <ambientLight intensity={1.5} />
        <React.Suspense fallback={
          <FallbackScene
            items={items}
            radius={radius}
            helixSpread={helixSpread}
            cardWidth={cardWidth}
            cardAspectRatio={cardAspectRatio}
          />
        }>
          <SpiralScene
            items={items}
            autoSpeed={autoSpeed}
            radius={radius}
            helixSpread={helixSpread}
            cardWidth={cardWidth}
            cardAspectRatio={cardAspectRatio}
            scrollProgressRef={progressRef}
          />
        </React.Suspense>
      </Canvas>

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,black_100%)]" />
    </div>
  );
}

export default Spiral3DSlider;
