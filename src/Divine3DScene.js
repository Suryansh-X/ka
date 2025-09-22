import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

// List your images (add your own files in public/assets)
const deities = [
  { src: "/assets/shiva.jpg", position: [-2, 0, 0] },
  { src: "/assets/krishna.jpg", position: [0, 0, 0] },
  { src: "/assets/mata.jpg", position: [2, 0, 0] }
];

const sacredSymbols = [
  { src: "/assets/om.png", position: [-3, 1, -2] },
  { src: "/assets/swastika.png", position: [3, 1, -2] },
  { src: "/assets/trishul.png", position: [0, 2, -2] }
];

function GlowingPlane({ image, position }) {
  const mesh = useRef();
  const texture = useLoader(TextureLoader, image);

  useFrame(({ clock }) => {
    mesh.current.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 1.2);
    mesh.current.rotation.y = 0.05 * Math.sin(clock.getElapsedTime() * 0.5 + position[0]);
  });

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[1.5, 2]} />
      <meshStandardMaterial map={texture} emissive={"orange"} emissiveIntensity={0.5} />
    </mesh>
  );
}

function SacredSymbol({ image, position }) {
  const mesh = useRef();
  const texture = useLoader(TextureLoader, image);

  useFrame(({ clock }) => {
    mesh.current.position.y = position[1] + 0.3 * Math.sin(clock.getElapsedTime() + position[0]);
    mesh.current.rotation.z = clock.getElapsedTime() * 0.3;
  });

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[0.8, 0.8]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={0.85}
        emissive={"gold"}
        emissiveIntensity={0.7}
      />
    </mesh>
  );
}

function GlowingFire({ position }) {
  const mesh = useRef();
  useFrame(({ clock }) => {
    mesh.current.material.emissiveIntensity = 1 + 0.7 * Math.abs(Math.sin(clock.getElapsedTime() * 2));
    mesh.current.scale.y = 1 + 0.13 * Math.sin(clock.getElapsedTime() * 3);
  });
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={"orange"}
        emissive={"red"}
        emissiveIntensity={1}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

export default function Divine3DScene() {
  return (
    <div style={{ height: "100vh", background: "black" }}>
      {/* Autoplay background music */}
      <audio src="/assets/bgm.mp3" autoPlay loop />

      <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 4, 6]} intensity={1.5} />
        <Suspense fallback={null}>
          {/* Deity Images */}
          {deities.map((deity, i) => (
            <GlowingPlane key={i} image={deity.src} position={deity.position} />
          ))}
          {/* Sacred Symbols */}
          {sacredSymbols.map((sym, i) => (
            <SacredSymbol key={i} image={sym.src} position={sym.position} />
          ))}
          {/* Animated Glowing Fire under each deity */}
          {deities.map((deity, i) => (
            <GlowingFire key={i} position={[deity.position[0], -1.3, deity.position[2] - 0.2]} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}