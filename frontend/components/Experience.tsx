"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Image, ScrollControls, useScroll, Stars, Float, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

// CONFIG: Add your image filenames here
const images = [
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: "/memories/1.jpg" },
  { position: [-1.5, 0, 0.5], rotation: [0, 0.2, 0], url: "/memories/2.jpg" },
  { position: [1.5, 0, 0.5], rotation: [0, -0.2, 0], url: "/memories/3.jpg" },
  // Add more positions/urls as needed...
];

function FloatingMemories() {
  // This creates the floating effect for the images
  return (
    <group>
      {images.map((img, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
          <Image 
            url={img.url} 
            position={new THREE.Vector3(...img.position)} 
            scale={[1, 1.4, 1]} // Aspect ratio of standard vertical photo
            transparent 
            opacity={0.9}
          />
        </Float>
      ))}
    </group>
  );
}

function ValentineQuestion({ onAnswer }: { onAnswer: (response: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <group position={[0, -2.5, 2]}> {/* Positioned below the images */}
      <Text 
        font="/fonts/Inter-Bold.ttf" // Ensure you have a font in public/fonts or remove this prop to use default
        fontSize={0.5} 
        color="#ff69b4" 
        anchorX="center" 
        anchorY="middle"
      >
        Will you be my Valentine?
      </Text>
      
      {/* YES BUTTON */}
      <group position={[-1, -1, 0]} onClick={() => onAnswer("YES")}>
        <mesh 
          onPointerOver={() => setHovered("YES")} 
          onPointerOut={() => setHovered(null)}
          scale={hovered === "YES" ? 1.2 : 1}
        >
          <boxGeometry args={[1.5, 0.5, 0.1]} />
          <meshStandardMaterial color={hovered === "YES" ? "gold" : "hotpink"} emissive={hovered === "YES" ? "gold" : "black"} />
        </mesh>
        <Text position={[0, 0, 0.06]} fontSize={0.2} color="white">YES</Text>
      </group>

      {/* NO BUTTON (Optional: Make it run away in a later update!) */}
      <group position={[1, -1, 0]} onClick={() => onAnswer("NO")}>
        <mesh>
          <boxGeometry args={[1.5, 0.5, 0.1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
        <Text position={[0, 0, 0.06]} fontSize={0.2} color="white">NO</Text>
      </group>
    </group>
  );
}

export default function Experience() {
  const handleAnswer = async (answer: string) => {
    if (answer === "YES") {
      alert("She said YES! sending notification..."); // Replace with confetti later
      
      // Call our API to send SMS/Email
      await fetch('/api/notify', {
        method: 'POST',
        body: JSON.stringify({ answer }),
      });
    }
  };

  return (
    <div className="h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 30 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* The Atmospheric Particles */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* The Content */}
        <FloatingMemories />
        <ValentineQuestion onAnswer={handleAnswer} />
      </Canvas>
      
      {/* Music Player Control (Simple overlay) */}
      <div className="absolute top-5 left-5 text-white z-10">
        <audio id="audio" loop>
            <source src="/music.mp3" type="audio/mp3" />
        </audio>
        <button onClick={() => (document.getElementById('audio') as HTMLAudioElement).play()}>
          PLAY MUSIC 🎵
        </button>
      </div>
    </div>
  );
}