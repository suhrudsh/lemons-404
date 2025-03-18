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

	return (
		<RigidBody
			ref={sphereRef}
			position={position}
			linearDamping={0.9}
			angularDamping={0.9}
		>
			<mesh castShadow onPointerMove={moveSphere}>
				<icosahedronGeometry args={[2.5, 4]} />
				<meshStandardMaterial color="orange" />
			</mesh>
		</RigidBody>
	);
}
