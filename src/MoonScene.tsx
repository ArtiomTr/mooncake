import { useLoader, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const CameraController = () => {
	const { camera, gl } = useThree();
	useEffect(() => {
		const controls = new OrbitControls(camera, gl.domElement);

		controls.minDistance = 2;
		controls.maxDistance = 20;
		return () => {
			controls.dispose();
		};
	}, [camera, gl]);
	return null;
};

export const MoonScene = () => {
	const moonTexture = useLoader(TextureLoader, 'moon_surface.jpg');
	const moonDisplacementMap = useLoader(TextureLoader, 'moon_displacement_map.jpg');

	return (
		<scene>
			<CameraController />
			<ambientLight color={0xffffff} intensity={0.03} />
			<directionalLight color={0xffffff} position={[10, 0, 0]} intensity={1} />
			<mesh>
				<sphereGeometry args={[1, 1024, 1024]} attach="geometry" />
				<meshStandardMaterial
					displacementScale={0.05}
					displacementMap={moonDisplacementMap}
					map={moonTexture}
					color={0xffffff}
				/>
			</mesh>
		</scene>
	);
};
