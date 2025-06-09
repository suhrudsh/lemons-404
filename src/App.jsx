import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Lemon } from "./Lemon";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Set camera target
function SetCameraTarget() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(-9.05, 9.54, -8.41);
  }, [camera]);
  return null;
}

// SpotLight with live helper
function SpotLightWithHelper({
  position,
  color,
  intensity,
  penumbra,
  targetPosition,
}) {
  const lightRef = useRef();
  const helperRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;

    const target = new THREE.Object3D();
    target.position.set(...targetPosition);
    scene.add(target);
    light.target = target;

    if (import.meta.env.MODE !== "development") return; // skip helpers in prod

    const helper = new THREE.SpotLightHelper(light);
    scene.add(helper);
    helperRef.current = helper;

    return () => {
      scene.remove(helper);
      scene.remove(target);
    };
  }, [scene, targetPosition]);

  useFrame(() => {
    helperRef.current?.update();
  });

  return (
    <spotLight
      ref={lightRef}
      position={position}
      angle={Math.PI / 6}
      penumbra={penumbra}
      intensity={intensity}
      color={color}
      castShadow
    />
  );
}

// Main lights using helper wrappers
function Lights() {
  const target = [1.05, 15.54, 1.41]; // Blender camera target

  return (
    <>
      <ambientLight intensity={0.5} />

      <SpotLightWithHelper
        position={[16.096, 20.616, 6.848]}
        intensity={400}
        penumbra={0.5}
        color="white"
        targetPosition={target}
      />

      <SpotLightWithHelper
        position={[-9.96, 7.316, 11.608]}
        intensity={200}
        penumbra={0.5}
        color="white"
        targetPosition={target}
      />

      <SpotLightWithHelper
        position={[-9.66, 10.064, -10.032]}
        intensity={200}
        penumbra={0.5}
        color="white"
        targetPosition={target}
      />

      <pointLight
        position={[-11.18, 10.62, -11.788]}
        intensity={300}
        color={new THREE.Color(1.0, 0.657, 0.127)}
        castShadow
      />
    </>
  );
}

export default function App() {
  return (
    <div className="relative h-dvh w-screen touch-none overflow-hidden bg-black">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={import.meta.env.BASE_URL + "BG.webp"}
        alt=""
      />

      <div className="absolute inset-0 flex justify-between px-32">
        <h1 className="font-shoulders text-lemon flex flex-col justify-between gap-0 text-[14rem] leading-none font-black">
          <span>LIFE</span>
          <span>GAVE</span>
          <span className="font-shoulders-inline">YOU</span>
          <span>LEMONS.</span>
        </h1>
        <a
          href="/"
          className="font-shoulders bg-lemon hover:text-lemon z-10 mb-4 self-end px-4 py-2 text-4xl font-bold text-white transition-colors hover:bg-transparent"
        >
          Go back home
        </a>
      </div>

      <Canvas
        shadows="soft"
        camera={{
          position: [20.18, 20.36, 18.756],
          fov: 50,
        }}
        className="translate-x-1/5"
      >
        <SetCameraTarget />
        <Lights />

        <Physics gravity={[0, 0, 0]}>
          {Array.from({ length: 20 }, (_, i) => {
            const pos = [
              (Math.random() - 0.5) * 10,
              8 + Math.random() * 5,
              (Math.random() - 0.5) * 10,
            ];
            return <Lemon key={i} position={pos} />;
          })}
        </Physics>
      </Canvas>
    </div>
  );
}
