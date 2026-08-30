"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center } from "@react-three/drei";
import { Model as Gopro } from "./Gopro";

export default function GoproScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 35 }}
      gl={{ alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 3]} intensity={1.4} />
      <directionalLight position={[-3, -2, -3]} intensity={0.4} />

      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
            <Center>
                <Gopro scale={26} />
            </Center>
        </group>
        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.4}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}