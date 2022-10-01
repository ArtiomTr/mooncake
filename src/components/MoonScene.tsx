import { useLoader } from '@react-three/fiber';
import { useCallback, useMemo, useState } from 'react';
import { Camera, Color, Float32BufferAttribute, Intersection, TextureLoader, Vector3 } from 'three';
import activityPointFragment from '../shaders/activityPointFragment.glsl?raw';
import activityPointVertex from '../shaders/activityPointVertex.glsl?raw';
import { useCameraController } from './useCameraController';

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
	useCameraController();

	const moonTexture = useLoader(TextureLoader, 'moon_surface.jpg');
	const moonDisplacementMap = useLoader(TextureLoader, 'moon_displacement_map.jpg');
	const discTexture = useLoader(TextureLoader, 'disc.png');

	const [hoveredItemIndex, setHoveredItemIndex] = useState(-1);

	const { vertices, colors } = useMemo(() => {
		return {
			vertices: new Float32BufferAttribute(
				points.flatMap((point) => latLonToCoords(point.lat, point.lon, 1.05)),
				3,
			),
			colors: new Float32BufferAttribute(
				points.flatMap(() => new Color(0xffffff).toArray()),
				3,
			),
		};
	}, [points]);

	const sizes = useMemo(() => {
		return new Float32BufferAttribute(
			points.map((_, index) => (index === hoveredItemIndex ? 0.3 : 0.2)),
			1,
		);
	}, [points, hoveredItemIndex]);

	const getPoint = useCallback((intersections: Intersection[]) => {
		intersections.sort(
			(a, b) => (a.distanceToRay ?? Number.POSITIVE_INFINITY) - (b.distanceToRay ?? Number.POSITIVE_INFINITY),
		);

		const item = intersections[0];
		if (item.index !== undefined && item.distanceToRay !== undefined && item.distanceToRay <= 0.05) {
			return item.index;
		}

		return -1;
	}, []);

	return (
		<scene>
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
				onPointerDown={(event) => {
					if (getPoint(event.intersections) !== -1) {
						event.stopPropagation();
					} else {
						onSelectedItemChange(-1, { top: -1, left: -1 });
					}
				}}
				onClick={(event) => {
					const pointIndex = getPoint(event.intersections);

					let top = 0;
					let left = 0;

					if (pointIndex !== -1) {
						const position = getScreenCoord(event.intersections[pointIndex].point, event.camera);

						top = position.y;
						left = position.x;
						event.stopPropagation();
					}

					onSelectedItemChange(pointIndex, { top, left });
				}}
				onPointerMove={(event) => setHoveredItemIndex(getPoint(event.intersections))}
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
