// components/Experience.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, Float, Text, ContactShadows } from "@react-three/drei";
import { useState } from "react";

function ValentineText({ onAnswer }: { onAnswer: (a: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <group>
      {/* The Big Question */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Text
          
        fontSize={0.6}
          color="#ff69b4"
          position={[0, 1, 0]}
          anchorX="center"
          anchorY="middle"
        >
          Will you be my Valentine?
        </Text>
      </Float>

      {/* YES Button */}
      <group position={[-1.5, -1, 0]} onClick={() => onAnswer("YES")}>
        <mesh
          onPointerOver={() => setHovered("YES")}
          onPointerOut={() => setHovered(null)}
          scale={hovered === "YES" ? 1.1 : 1}
        >
          <boxGeometry args={[2, 0.7, 0.1]} />
          <meshStandardMaterial color={hovered === "YES" ? "gold" : "#ff1493"} />
        </mesh>
        <Text position={[0, 0, 0.1]} fontSize={0.25} color="white">YES</Text>
      </group>

      {/* NO Button */}
      <group position={[1.5, -1, 0]} onClick={() => onAnswer("NO")}>
        <mesh
          onPointerOver={() => setHovered("NO")}
          onPointerOut={() => setHovered(null)}
          scale={hovered === "NO" ? 0.9 : 1}
        >
          <boxGeometry args={[2, 0.7, 0.1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
        <Text position={[0, 0, 0.1]} fontSize={0.25} color="white">NO</Text>
      </group>
    </group>
  );
}

export default function Experience() {
  const handleAnswer = (answer: string) => {
    alert(`She chose: ${answer}`); // We will hook up SMS later
  };

  return (
    <div className="h-screen w-full bg-black" style={{ height: '100vh', width: '100vw' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 35 }}>
        <color attach="background" args={['#000000']} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="purple" />

        {/* The Background Stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* The Content */}
        <ValentineText onAnswer={handleAnswer} />
        
        {/* Floor Reflections */}
        <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
      </Canvas>
    </div>
  );
}