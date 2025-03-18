import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Sphere } from "./Sphere";

export default function App() {
	return (
		<div className="h-dvh touch-none w-screen">
			<Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
				<ambientLight intensity={0.5} />
				<directionalLight position={[10, 10, 5]} intensity={1} />
				<Physics gravity={[0, 0, 0]}>
					{Array.from({ length: 100 }, (_, i) => {
						const pos = [
							(Math.random() - 0.5) * 40,
							Math.random() * 20,
							(Math.random() - 0.5) * 40,
						];
						return <Sphere key={i} position={pos} />;
					})}
				</Physics>
			</Canvas>
		</div>
	);
}
