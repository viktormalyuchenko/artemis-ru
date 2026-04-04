"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Sphere,
  useTexture,
  Html,
} from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function Earth({ onHover }: { onHover: (v: boolean) => void }) {
  const [colorMap, normalMap] = useTexture([
    "/earth_color.jpg",
    "/earth_normal.jpg",
  ]);
  return (
    <Sphere
      args={[6.3, 64, 64]}
      position={[0, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughness={0.6}
      />
    </Sphere>
  );
}

function Moon({
  pos,
  onHover,
}: {
  pos: { x: number; y: number; z: number };
  onHover: (v: boolean) => void;
}) {
  const colorMap = useTexture("/moon_color.jpg");
  return (
    <Sphere
      args={[1.7, 64, 64]}
      position={[pos.x, pos.y, pos.z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      <meshStandardMaterial map={colorMap} roughness={1} />
    </Sphere>
  );
}

// Главный компонент логики камеры
function CameraController({
  orionPos,
  moonPos,
  focus,
}: {
  orionPos: { x: number; y: number; z: number };
  moonPos: { x: number; y: number; z: number };
  focus: string;
}) {
  const controlsRef = useRef<any>(null);

  useFrame((state) => {
    if (!controlsRef.current) return;

    const vEarth = new THREE.Vector3(0, 0, 0);
    // ИСПРАВЛЕНИЕ: Используем moonPos и orionPos (имена пропсов)
    const vMoon = new THREE.Vector3(moonPos.x, moonPos.y, moonPos.z);
    const vOrion = new THREE.Vector3(orionPos.x, orionPos.y, orionPos.z);

    // Вектор от Земли к Луне (направляющая ось)
    const earthToMoonDir = new THREE.Vector3()
      .subVectors(vMoon, vEarth)
      .normalize();
    const up = new THREE.Vector3(0, 1, 0);
    // Вектор "вбок" (перпендикуляр)
    const right = new THREE.Vector3()
      .crossVectors(earthToMoonDir, up)
      .normalize();

    let target = new THREE.Vector3();
    let idealCameraPos = new THREE.Vector3();

    if (focus === "EARTH") {
      target.copy(vMoon); // Смотрим на Луну
      // Встаем ЗА Землю, смещаемся вбок и чуть вверх
      idealCameraPos
        .copy(vEarth)
        .add(earthToMoonDir.clone().multiplyScalar(-20))
        .add(right.clone().multiplyScalar(15))
        .add(up.clone().multiplyScalar(5));
    } else if (focus === "MOON") {
      target.copy(vEarth); // Смотрим на Землю
      // Встаем ЗА Луну (дальше от Земли), смещаемся вбок
      idealCameraPos
        .copy(vMoon)
        .add(earthToMoonDir.clone().multiplyScalar(12))
        .add(right.clone().multiplyScalar(-8))
        .add(up.clone().multiplyScalar(3));
    } else if (focus === "ORION") {
      target.copy(vMoon); // Смотрим на Луну
      // Встаем прямо за хвостом Ориона
      idealCameraPos
        .copy(vOrion)
        .add(earthToMoonDir.clone().multiplyScalar(-8))
        .add(right.clone().multiplyScalar(5))
        .add(up.clone().multiplyScalar(2));
    } else if (focus === "WIDE") {
      // Смотрим в центр между Землей и Луной
      target.copy(vMoon).multiplyScalar(0.5);
      // Камера далеко сбоку (по вектору right), чтобы все влезло в экран
      idealCameraPos
        .copy(target)
        .add(right.clone().multiplyScalar(450))
        .add(up.clone().multiplyScalar(100));
    }

    // ЭФФЕКТ РЕЗИНКИ: Плавное возвращение камеры в идеальную позицию каждый кадр
    state.camera.position.lerp(idealCameraPos, 0.03);
    controlsRef.current.target.lerp(target, 0.03);
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxDistance={2000}
    />
  );
}

export default function Scene3D({
  orionPosition,
  moonPosition,
  focus,
}: {
  orionPosition: { x: number; y: number; z: number };
  moonPosition: { x: number; y: number; z: number };
  focus: string;
}) {
  const [hoveredEarth, setHoveredEarth] = useState(false);
  const [hoveredMoon, setHoveredMoon] = useState(false);
  const [hoveredOrion, setHoveredOrion] = useState(false);

  return (
    <Canvas camera={{ position: [0, 400, 600], fov: 45, far: 5000 }}>
      <ambientLight intensity={0.4} />
      {/* Солнце светит со стороны Земли на Луну и немного сверху */}
      <directionalLight
        position={[0, 200, 500]}
        intensity={2.5}
        color="#ffffff"
      />
      <Stars
        radius={800}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <CameraController
        orionPos={orionPosition}
        moonPos={moonPosition}
        focus={focus}
      />

      {/* ЗЕМЛЯ */}
      <group position={[0, 0, 0]}>
        <Earth onHover={setHoveredEarth} />
        {hoveredEarth && (
          <Html center className="pointer-events-none z-50">
            <div className="bg-[#0a1120]/95 text-white text-[10px] px-3 py-1.5 rounded border border-slate-700 whitespace-nowrap shadow-2xl backdrop-blur-sm mt-8">
              <div className="font-bold text-cyan-400 uppercase tracking-widest mb-0.5">
                Земля
              </div>
              <div className="text-slate-400">Центр управления</div>
            </div>
          </Html>
        )}
      </group>

      {/* ЛУНА */}
      <group>
        <Moon pos={moonPosition} onHover={setHoveredMoon} />
        {hoveredMoon && (
          <Html
            position={[moonPosition.x, moonPosition.y, moonPosition.z]}
            center
            className="pointer-events-none z-50"
          >
            <div className="bg-[#0a1120]/95 text-white text-[10px] px-3 py-1.5 rounded border border-slate-700 whitespace-nowrap shadow-2xl backdrop-blur-sm mt-8">
              <div className="font-bold text-slate-300 uppercase tracking-widest mb-0.5">
                Луна
              </div>
              <div className="text-slate-400">Цель миссии</div>
            </div>
          </Html>
        )}
      </group>

      {/* ОРИОН */}
      <mesh
        position={[orionPosition.x, orionPosition.y, orionPosition.z]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredOrion(true);
        }}
        onPointerOut={() => setHoveredOrion(false)}
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#4deeea"
          emissive="#4deeea"
          emissiveIntensity={1}
        />

        {(hoveredOrion || focus === "ORION") && (
          <Html
            position={[0, 2.5, 0]}
            center
            className="pointer-events-none z-50"
          >
            <div className="flex flex-col items-center animate-pulse">
              <div className="bg-cyan-500 text-black text-[9px] px-2 py-0.5 rounded uppercase tracking-widest font-black shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                ORION
              </div>
              {/* Линия теперь растет сверху вниз */}
              <div className="w-[2px] h-4 bg-gradient-to-t from-transparent to-cyan-500 mt-1"></div>
            </div>
          </Html>
        )}
      </mesh>
    </Canvas>
  );
}
