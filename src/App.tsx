import classes from './App.module.css';
import { Canvas } from '@react-three/fiber';
import { Fragment, Suspense } from 'react';
import { MoonScene } from './MoonScene';
import { Header } from './Header';
import { Footer } from './Footer';

function App() {
	return (
		<div className={classes['app']}>
			<Header />
			<Canvas>
				<Suspense fallback={null}>
					<MoonScene />
				</Suspense>
			</Canvas>
			<Footer />
		</div>
	);
}

export default App;
