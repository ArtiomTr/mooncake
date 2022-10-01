import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import classes from './App.module.css';
import { Footer } from './Footer';
import { Header } from './Header';
import { MoonScene } from './MoonScene';

export const App = () => {
	const [, setSelectedItemIndex] = useState(-1);

	const onSelectedChange = (selectedIndex: number) => {
		setSelectedItemIndex(selectedIndex);
	};

	return (
		<div className={classes['app']}>
			<Header />
			<Canvas>
				<Suspense fallback={undefined}>
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
			<Footer />
		</div>
	);
};

export default App;
