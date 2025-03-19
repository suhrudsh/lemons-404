import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";

export function Sphere({ position }) {
	const sphereRef = useRef(null);

	// Factor to scale the impulse based on mouse movement
	const impulseFactor = 30;

	// Apply a continuous force pulling toward the origin
	useFrame(() => {
		if (sphereRef.current) {
			const pos = sphereRef.current.translation();
			const k = 3;
			const impulse = {
				x: -k * pos.x,
				y: -k * pos.y,
				z: -k * pos.z,
			};
			sphereRef.current.applyImpulse(impulse, true);
		}
	});

	function moveSphere(e) {
		// Calculate impulse based on pointer movement.
		const impulse = {
			x: e.movementX * impulseFactor,
			y: 0,
			z: -e.movementY * impulseFactor,
		};
		if (sphereRef.current) {
			sphereRef.current.applyImpulse(impulse, true);
		}
	}

	function puntSphere() {
		if (!sphereRef.current) return;

		const impulse = {
			x: 0, // Try increasing if it's not enough
			y: 50, // Give it more lift so it's noticeable
			z: -50000,
		};
		sphereRef.current.applyImpulse(impulse, true);
	}

	const color = [Math.random(), Math.random(), Math.random()];

	return (
		<RigidBody
			ref={sphereRef}
			position={position}
			linearDamping={0.5}
			angularDamping={0.5}
		>
			<mesh castShadow onPointerMove={moveSphere} onClick={puntSphere}>
				<icosahedronGeometry args={[2.5, 4]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={0.5}
					roughness={0.4}
				/>
			</mesh>
		</RigidBody>
	);
}
