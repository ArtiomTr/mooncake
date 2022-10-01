import { useFrame } from '@react-three/fiber';
import { useLoader, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	BufferAttribute,
	BufferGeometry,
	Camera,
	Color,
	EdgesGeometry,
	Float32BufferAttribute,
	Intersection,
	Object3D,
	Points,
	TextureLoader,
	Vector3,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import activityPointFragment from './activityPointFragment.glsl?raw';
import activityPointVertex from './activityPointVertex.glsl?raw';

const CameraController = () => {
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

	return null;
};

export type SeismicActivityPoint = {
	amplitude: number;
	lat: number;
	lon: number;
	latError: number;
	lonError: number;
};

export type MoonSceneProps = {
	points: SeismicActivityPoint[];
	onSelectedItemChange: (index: number, position: { top: number; left: number }) => void;
};

const latLonToCoords = (lat: number, lon: number, radius: number) => {
	const phi = (90 - lat) * (Math.PI / 180);
	const theta = (lon + 180) * (Math.PI / 180);

	const x = -(radius * Math.sin(phi) * Math.cos(theta));
	const z = radius * Math.sin(phi) * Math.sin(theta);
	const y = radius * Math.cos(phi);

	return [x, y, z];
};

const getScreenCoord = (position: Vector3, camera: Camera) => {
	const vector = position.clone();
	vector.project(camera);

	const width = window.innerWidth,
		height = window.innerHeight;
	const widthHalf = width / 2,
		heightHalf = height / 2;

	vector.x = vector.x * widthHalf + widthHalf;
	vector.y = -(vector.y * heightHalf) + heightHalf;

	return vector;
};

export const MoonScene = ({ points, onSelectedItemChange }: MoonSceneProps) => {
	const moonTexture = useLoader(TextureLoader, 'moon_surface.jpg');
	const moonDisplacementMap = useLoader(TextureLoader, 'moon_displacement_map.jpg');
	const discTexture = useLoader(TextureLoader, 'disc.png');

	const [hoveredItemIndex, setHoveredItemIndex] = useState(-1);

	const { vertices, colors } = useMemo(() => {
		return {
			vertices: new Float32BufferAttribute(
				points.map((point) => latLonToCoords(point.lat, point.lon, 1.05)).flat(1),
				3,
			),
			colors: new Float32BufferAttribute(points.map(() => new Color(0xffffff).toArray()).flat(1), 3),
		};
	}, [points]);

	const sizes = useMemo(() => {
		return new Float32BufferAttribute(
			points.map((_, index) => (index === hoveredItemIndex ? 0.3 : 0.2)),
			1,
		);
	}, [points, hoveredItemIndex]);

	const getPoint = useCallback((intersections: Intersection[]) => {
		intersections.sort((a, b) => (a.distanceToRay ?? Infinity) - (b.distanceToRay ?? Infinity));

		const item = intersections[0];
		if (item.index !== undefined && item.distanceToRay !== undefined && item.distanceToRay <= 0.05) {
			return item.index;
		}

		return -1;
	}, []);

	return (
		<scene>
			<CameraController />
			<ambientLight color={0xffffff} intensity={0.05} />
			<directionalLight color={0xffffff} position={[10, 0, 0]} intensity={1} />
			<mesh>
				<sphereGeometry args={[1, 256, 256]} attach="geometry" />
				<meshStandardMaterial
					displacementScale={0.05}
					displacementMap={moonDisplacementMap}
					map={moonTexture}
					color={0xffffff}
				/>
			</mesh>
			<points
				onPointerDown={(e) => {
					if (getPoint(e.intersections) !== -1) {
						e.stopPropagation();
					} else {
						onSelectedItemChange(-1, { top: -1, left: -1 });
					}
				}}
				onClick={(e) => {
					const pointIndex = getPoint(e.intersections);

					let top = 0;
					let left = 0;

					if (pointIndex !== -1) {
						const position = getScreenCoord(e.intersections[pointIndex].point, e.camera);

						top = position.y;
						left = position.x;
						e.stopPropagation();
					}

					onSelectedItemChange(pointIndex, { top, left });
				}}
				onPointerMove={(e) => setHoveredItemIndex(getPoint(e.intersections))}
			>
				<bufferGeometry
					attributes={{
						position: vertices,
						customColor: colors,
						size: sizes,
					}}
				/>
				<shaderMaterial
					uniforms={{
						pointTexture: {
							value: discTexture,
						},
					}}
					transparent
					vertexShader={activityPointVertex}
					fragmentShader={activityPointFragment}
				/>
			</points>
		</scene>
	);
};
