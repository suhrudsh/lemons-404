import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Lemon({ position }) {
	const lemonRef = useRef();
	const lemonsURL = import.meta.env.BASE_URL + "/lemons.glb";

	const { nodes } = useGLTF(lemonsURL);

	const lemonMesh = nodes.lemon;

	// Factor to scale the impulse based on mouse movement
	const impulseFactor = 5;

	// Apply a continuous force pulling toward the origin
	useFrame(() => {
		if (lemonRef.current) {
			const pos = lemonRef.current.translation();
			const k = 3;
			const impulse = {
				x: -k * pos.x,
				y: -k * pos.y + 50,
				z: -k * pos.z,
			};
			lemonRef.current.applyImpulse(impulse, true);
		}
	});

	function moveLemon(e) {
		// Calculate impulse based on pointer movement.
		const impulse = {
			x: e.movementX * impulseFactor,
			y: 0,
			z: -e.movementY * impulseFactor,
		};
		if (lemonRef.current) {
			lemonRef.current.applyImpulse(impulse, true);
		}
	}

	function puntLemon() {
		if (!lemonRef.current) return;

		const impulse = {
			x: 0, // Try increasing if it's not enough
			y: 50, // Give it more lift so it's noticeable
			z: -50000,
		};
		lemonRef.current.applyImpulse(impulse, true);
	}

	return (
		<RigidBody
			ref={lemonRef}
			position={position}
			linearDamping={0.5}
			angularDamping={0.5}
			// colliders="hull"
		>
			<mesh
				geometry={lemonMesh.geometry}
				material={lemonMesh.material}
				castShadow
				scale={4}
				onPointerMove={moveLemon}
				onClick={puntLemon}
			/>
		</RigidBody>
	);
}
