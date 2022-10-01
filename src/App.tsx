import './App.css';
import { Canvas } from '@react-three/fiber';
import { Fragment, Suspense, useRef, useState } from 'react';
import { MoonScene } from './MoonScene';

function App() {
	const position = useRef({ top: -1, left: -1 });
	const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

	const onSelectedChange = (selectedIndex: number, newPosition: { top: number; left: number }) => {
		setSelectedItemIndex(selectedIndex);
		position.current = newPosition;
	};

	return (
		<Fragment>
			<div
				style={{
					position: 'absolute',
					top: position.current.top,
					left: position.current.left,
					background: 'red',
					zIndex: 1000,
				}}
			>
				Helo world
			</div>
			<Canvas>
				<Suspense fallback={null}>
					<MoonScene
						points={[
							{
								lat: 0,
								latError: 0,
								lon: 0,
								lonError: 0,
								amplitude: 10,
							},
							{
								lat: 10,
								latError: 0,
								lon: 10,
								lonError: 0,
								amplitude: 10,
							},
						]}
						onSelectedItemChange={onSelectedChange}
					/>
				</Suspense>
			</Canvas>
		</Fragment>
	);
}

export default App;
