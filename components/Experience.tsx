// @ts-nocheck
"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, Float, Text, Image, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useState, Suspense } from "react";
import * as THREE from "three";

// CONFIG: Your photos
const memories = [
  { pos: [-3, 0, 0], rot: [0, 0.3, 0], url: "/memories/1.jpg" },
  { pos: [3, 0, 0], rot: [0, -0.3, 0], url: "/memories/2.jpg" },
  { pos: [0, 2.5, -1], rot: [0, 0, 0], url: "/memories/3.jpg" },
];

function FloatingMemories() {
  return (
    <group>
      {memories.map((mem, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
           <Suspense fallback={null}>
            <Image 
              url={mem.url} 
              position={mem.pos} 
              scale={[2, 3, 1]} 
              transparent
              opacity={0.8}
            />
           </Suspense>
        </Float>
      ))}
    </group>
  );
}

function ValentineText({ onAnswer, celebration }: { onAnswer: (a: string) => void, celebration: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  
  // State for the "Runaway No Button"
  const [noPos, setNoPos] = useState([1.5, -0.5, 0]);

  const runAway = () => {
    // Teleport to a random position within x: -3 to 3, y: -2 to 2
    const x = (Math.random() - 0.5) * 6;
    const y = (Math.random() - 0.5) * 4;
    setNoPos([x, y, 0]);
  };

  if (celebration) {
    return (
      <group position={[0, 0, 1]}>
        <Float speed={5} rotationIntensity={0.5} floatIntensity={2}>
          <Text
            fontSize={1.5}
            color="#ffd700"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="orange"
          >
            I KNEW IT! ❤️
          </Text>
        </Float>
      </group>
    );
  }

  return (
    <group position={[0, 0, 1]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          fontSize={0.8}
          color="#ff1493"
          position={[0, 1.5, 0]}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
        >
          Will you be my Valentine?
        </Text>
      </Float>

      {/* YES Button */}
      <group position={[-1.5, -0.5, 0]} onClick={() => onAnswer("YES")}>
        <mesh
          onPointerOver={() => setHovered("YES")}
          onPointerOut={() => setHovered(null)}
          scale={hovered === "YES" ? 1.2 : 1}
        >
          <boxGeometry args={[2.5, 0.8, 0.1]} />
          <meshStandardMaterial 
            color={hovered === "YES" ? "#ffd700" : "#b00b69"} 
            emissive={hovered === "YES" ? "#ffd700" : "#500020"}
            emissiveIntensity={2}
          />
        </mesh>
        <Text position={[0, 0, 0.1]} fontSize={0.3} color="white">YES</Text>
      </group>

      {/* NO Button - The "Runaway" Logic */}
      <group 
        position={noPos} 
        onPointerOver={runAway} // Run away when mouse touches it
        onClick={runAway}       // Run away if she manages to click
      >
        <mesh>
          <boxGeometry args={[2.5, 0.8, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <Text position={[0, 0, 0.1]} fontSize={0.3} color="white">NO</Text>
      </group>
    </group>
  );
}

export default function Experience() {
  const [celebrating, setCelebrating] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  const playMusic = () => {
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      audio.play();
      setMusicStarted(true);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (answer === "YES") {
      setCelebrating(true); // Trigger celebration mode
      
      // Send Email in background
      try {
        await fetch('/api/notify', {
          method: 'POST',
          body: JSON.stringify({ answer }),
          headers: { 'Content-Type': 'application/json' }
        });
        console.log("Email sent!");
      } catch (e) {
        console.error("Email failed", e);
      }
    }
  };

  return (
    <div className="h-screen w-full bg-black relative">
      <audio id="bg-music" loop>
        <source src="/music.mp3" type="audio/mp3" />
      </audio>

      {!musicStarted && (
        <div className="absolute top-5 left-5 z-50">
          <button 
            onClick={playMusic}
            className="px-6 py-2 bg-pink-600 text-white rounded-full font-bold shadow-lg animate-pulse"
          >
            🎵 Play Song
          </button>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
        <color attach="background" args={['#050505']} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff0080" />
        
        <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>

        {/* Dynamic Background: Speed up stars if celebrating! */}
        <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={celebrating ? 5 : 1} 
        />
        
        {/* Explosion of Gold Particles if celebrating */}
        <Sparkles 
            count={celebrating ? 2000 : 300} 
            size={celebrating ? 10 : 5} 
            scale={[10, 10, 10]} 
            speed={celebrating ? 2 : 0.5} 
            opacity={0.8} 
            color={celebrating ? "gold" : "pink"} 
        />
        
        <FloatingMemories />
        <ValentineText onAnswer={handleAnswer} celebration={celebrating} />
      </Canvas>
    </div>
  );
}