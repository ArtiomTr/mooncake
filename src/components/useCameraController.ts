import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const useCameraController = () => {
	const { camera, gl } = useThree();
	const controls = useRef<OrbitControls>();

	useEffect(() => {
		const currentControls = new OrbitControls(camera, gl.domElement);

		currentControls.minDistance = 2;
		currentControls.maxDistance = 20;
		currentControls.enableDamping = true;
		currentControls.enablePan = false;
		controls.current = currentControls;

		return () => {
			currentControls.dispose();
		};
	}, [camera, gl]);

	useFrame(() => controls.current?.update());
};
