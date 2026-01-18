"use client";

import React from "react"

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Environment,
  ContactShadows,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";

// Procedurally generated stylized robot
function Robot({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  // Colors for the robot - ApexMedia Branding
  const colors = useMemo(
    () => ({
      body: "#0a0a0a",
      accent: "#22c55e",
      emissive: "#22c55e",
      metal: "#1a1a1a",
      eye: "#22c55e",
    }),
    []
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Subtle idle body movement
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(time * 0.5) * 0.1 + mousePosition.x * 0.3;
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.05;
    }

    // Head follows mouse with smooth interpolation
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        mousePosition.x * 0.5,
        0.05
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -mousePosition.y * 0.3,
        0.05
      );
    }

    // Arm swaying animation
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(time * 1.2) * 0.15;
      leftArmRef.current.rotation.z = Math.sin(time * 0.8) * 0.1 - 0.2;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = Math.sin(time * 1.2 + Math.PI) * 0.15;
      rightArmRef.current.rotation.z = -Math.sin(time * 0.8) * 0.1 + 0.2;
    }

    // Eye glow pulsing
    if (eyeLeftRef.current && eyeRightRef.current) {
      const material = eyeLeftRef.current.material as THREE.MeshStandardMaterial;
      const intensity = 2 + Math.sin(time * 3) * 0.5;
      material.emissiveIntensity = intensity;
      (eyeRightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, 0.3, 0]} scale={0.85}>
        {/* Body - Main torso */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 1.5, 0.8]} />
          <meshStandardMaterial
            color={colors.body}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Body accent lines */}
        <mesh position={[0, 0, 0.41]}>
          <boxGeometry args={[1, 0.05, 0.02]} />
          <meshStandardMaterial
            color={colors.accent}
            emissive={colors.emissive}
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[0, -0.3, 0.41]}>
          <boxGeometry args={[0.8, 0.05, 0.02]} />
          <meshStandardMaterial
            color={colors.accent}
            emissive={colors.emissive}
            emissiveIntensity={2}
          />
        </mesh>

        {/* Chest reactor/core */}
        <mesh position={[0, 0.2, 0.41]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.5}
            chromaticAberration={0.1}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1}
            color={colors.accent}
          />
        </mesh>

        {/* Head */}
        <group ref={headRef} position={[0, 1.2, 0]}>
          {/* Main head */}
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.7, 0.7]} />
            <meshStandardMaterial
              color={colors.body}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Face plate */}
          <mesh position={[0, 0, 0.36]}>
            <boxGeometry args={[0.7, 0.5, 0.02]} />
            <meshStandardMaterial
              color={colors.metal}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Eyes */}
          <mesh ref={eyeLeftRef} position={[-0.2, 0.05, 0.38]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={colors.eye}
              emissive={colors.eye}
              emissiveIntensity={2}
            />
          </mesh>
          <mesh ref={eyeRightRef} position={[0.2, 0.05, 0.38]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={colors.eye}
              emissive={colors.eye}
              emissiveIntensity={2}
            />
          </mesh>

          {/* Antenna */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color={colors.accent}
              emissive={colors.emissive}
              emissiveIntensity={3}
            />
          </mesh>
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.85, 0.4, 0]}>
          {/* Shoulder joint */}
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Upper arm */}
          <mesh position={[-0.15, -0.4, 0]} castShadow>
            <boxGeometry args={[0.25, 0.6, 0.25]} />
            <meshStandardMaterial color={colors.body} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Elbow */}
          <mesh position={[-0.15, -0.75, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Lower arm */}
          <mesh position={[-0.15, -1.1, 0]} castShadow>
            <boxGeometry args={[0.2, 0.5, 0.2]} />
            <meshStandardMaterial color={colors.body} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Hand */}
          <mesh position={[-0.15, -1.45, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={colors.accent}
              emissive={colors.emissive}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.85, 0.4, 0]}>
          {/* Shoulder joint */}
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Upper arm */}
          <mesh position={[0.15, -0.4, 0]} castShadow>
            <boxGeometry args={[0.25, 0.6, 0.25]} />
            <meshStandardMaterial color={colors.body} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Elbow */}
          <mesh position={[0.15, -0.75, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Lower arm */}
          <mesh position={[0.15, -1.1, 0]} castShadow>
            <boxGeometry args={[0.2, 0.5, 0.2]} />
            <meshStandardMaterial color={colors.body} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Hand */}
          <mesh position={[0.15, -1.45, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={colors.accent}
              emissive={colors.emissive}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>

        {/* Legs */}
        {/* Left Leg */}
        <group position={[-0.35, -1.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.35, 0.8, 0.35]} />
            <meshStandardMaterial color={colors.body} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.55, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.95, 0]} castShadow>
            <boxGeometry args={[0.3, 0.6, 0.3]} />
            <meshStandardMaterial color={colors.body} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -1.35, 0.1]} castShadow>
            <boxGeometry args={[0.35, 0.15, 0.5]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group position={[0.35, -1.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.35, 0.8, 0.35]} />
            <meshStandardMaterial color={colors.body} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.55, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.95, 0]} castShadow>
            <boxGeometry args={[0.3, 0.6, 0.3]} />
            <meshStandardMaterial color={colors.body} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -1.35, 0.1]} castShadow>
            <boxGeometry args={[0.35, 0.15, 0.5]} />
            <meshStandardMaterial color={colors.metal} metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

// Animated particles around the robot
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#22c55e"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Camera controller for smooth movement
function CameraController({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePosition.x * 0.5, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mousePosition.y * 0.3 + 0.5, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#1a2744" wireframe />
    </mesh>
  );
}

interface Robot3DProps {
  className?: string;
}

export default function Robot3D({ className }: Robot3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePosition.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#22c55e" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            color="#ffffff"
          />

          {/* Robot */}
          <Robot mousePosition={mousePosition.current} />

          {/* Particles */}
          <Particles />

          {/* Environment */}
          <Environment preset="city" />

          {/* Contact shadow */}
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.4}
            scale={8}
            blur={2.5}
            far={3}
          />

          {/* Camera controller */}
          <CameraController mousePosition={mousePosition.current} />
        </Suspense>
      </Canvas>
    </div>
  );
}
