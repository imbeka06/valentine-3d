"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Text, Image, Sparkles } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

// CONFIG: Your photos here (ensure files exist in /public)
const memories = [
  { pos: [-3, 0, 0], rot: [0, 0.3, 0], url: "/1.jpg" },
  { pos: [3, 0, 0], rot: [0, -0.3, 0], url: "/2.jpg" },
  { pos: [0, 2.5, -1], rot: [0, 0, 0], url: "/3.jpg" },
  // Add more as needed...
];

function FloatingMemories() {
  return (
    <group>
      {memories.map((mem, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <Image 
            url={mem.url} 
            position={new THREE.Vector3(...mem.pos)} 
            scale={2} // Adjust size of photos
            transparent
            opacity={0.9} 
          />
        </Float>
      ))}
    </group>
  );
}

function ValentineText({ onAnswer }: { onAnswer: (a: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <group position={[0, -2, 1]}> {/* Move text closer to camera */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          fontSize={0.6}
          color="#ff1493"
          font="/fonts/Inter-Bold.ttf" // Remove this line if it crashes
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
        >
          Will you be my Valentine?
        </Text>
      </Float>

      {/* Cinematic Buttons */}
      <group position={[-1.5, -1.2, 0]} onClick={() => onAnswer("YES")}>
        <mesh
          onPointerOver={() => setHovered("YES")}
          onPointerOut={() => setHovered(null)}
          scale={hovered === "YES" ? 1.1 : 1}
        >
          <boxGeometry args={[2, 0.7, 0.1]} />
          <meshStandardMaterial 
            color={hovered === "YES" ? "#ffd700" : "#b00b69"} 
            emissive={hovered === "YES" ? "#ffd700" : "#500020"}
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        <Text position={[0, 0, 0.06]} fontSize={0.25} color="white">YES</Text>
      </group>

      <group position={[1.5, -1.2, 0]} onClick={() => onAnswer("NO")}>
        <mesh
          onPointerOver={() => setHovered("NO")}
          onPointerOut={() => setHovered(null)}
          scale={hovered === "NO" ? 0.9 : 1}
        >
          <boxGeometry args={[2, 0.7, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <Text position={[0, 0, 0.06]} fontSize={0.25} color="white">NO</Text>
      </group>
    </group>
  );
}

export default function Experience() {
  const handleAnswer = (answer: string) => {
    alert(`She chose: ${answer}`);
  };

  return (
    <div className="h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
        <color attach="background" args={['#050505']} />
        
        {/* CINEMATIC LIGHTING SETUP */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff0080" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
        <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} color="white" />

        {/* ATMOSPHERE */}
        <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={200} size={4} scale={[10, 10, 10]} speed={0.5} opacity={0.5} color="gold" />
        
        {/* CONTENT */}
        <FloatingMemories />
        <ValentineText onAnswer={handleAnswer} />
      </Canvas>
    </div>
  );
}