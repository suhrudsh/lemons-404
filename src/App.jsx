import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Lemon } from "./Lemon";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CAMERA_SHIFT_X = -8;
const CAMERA_SHIFT_X_MOBILE = -5;

// Set camera target
function SetCameraTarget({ isMobile }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(
      -9.05 + isMobile ? CAMERA_SHIFT_X_MOBILE : CAMERA_SHIFT_X,
      9.54,
      -8.41,
    );
  }, [camera, isMobile]);
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
function Lights({ isMobile }) {
  const target = [1.05, 15.54, 1.41]; // Blender camera target

  return (
    <>
      <ambientLight intensity={0.5} />

      <SpotLightWithHelper
        position={isMobile ? [16.096, 20.616, 6.848] : [24.144, 30.924, 10.272]}
        intensity={isMobile ? 600 : 2000}
        penumbra={isMobile ? 0.5 : 0.8}
        color="white"
        targetPosition={target}
      />

      <SpotLightWithHelper
        position={isMobile ? [-9.96, 7.316, 11.608] : [-14.94, 10.974, 17.412]}
        intensity={isMobile ? 300 : 1000}
        penumbra={isMobile ? 0.5 : 0.8}
        color="white"
        targetPosition={target}
      />

      <SpotLightWithHelper
        position={
          isMobile ? [-9.66, 10.064, -10.032] : [-14.49, 15.096, -15.048]
        }
        intensity={isMobile ? 300 : 1000}
        penumbra={isMobile ? 0.5 : 0.8}
        color="white"
        targetPosition={target}
      />
    </>
  );
}

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="relative h-dvh w-screen touch-none overflow-hidden bg-black">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={import.meta.env.BASE_URL + "BG.webp"}
        alt=""
      />

      <div className="absolute bottom-0 flex flex-col justify-between gap-8 px-4 md:px-12 lg:inset-0 lg:flex-row lg:gap-0 lg:px-32">
        <div className="lg:py-8">
          <h1 className="font-shoulders text-lemon flex flex-col justify-between gap-0 text-8xl leading-none font-black md:text-[9rem] lg:text-[10rem] xl:text-[13rem]">
            <span>LIFE</span>
            <span>GAVE</span>
            <span className="font-shoulders-inline">YOU</span>
            <span>LEMONS.</span>
          </h1>
          <p className="font-shoulders text-lemon text-xl font-bold md:text-2xl xl:text-3xl">
            (This page does not exist.)
          </p>
        </div>
        <a
          href="/"
          className="font-shoulders bg-lemon hover:text-lemon z-10 mb-4 self-start px-4 py-2 text-2xl font-bold text-white transition-colors hover:bg-transparent md:mb-12 md:text-3xl lg:mb-25 lg:self-end xl:mb-20 xl:text-4xl"
        >
          Go back home
        </a>
      </div>

      <Canvas
        shadows="soft"
        camera={{
          position: [
            20.18 + isMobile ? CAMERA_SHIFT_X_MOBILE : CAMERA_SHIFT_X,
            20.36,
            18.756,
          ],
          fov: isMobile ? 70 : 65,
        }}
      >
        <SetCameraTarget isMobile />
        <Lights isMobile={isMobile} />

        <Physics gravity={[0, 0, 0]}>
          {Array.from({ length: 20 }, (_, i) => {
            const pos = [
              (Math.random() - 0.5) * 10,
              8 + Math.random() * 5,
              (Math.random() - 0.5) * 10,
            ];
            return <Lemon key={i} position={pos} isMobile={isMobile} />;
          })}
        </Physics>
      </Canvas>
    </div>
  );
}
