import React from 'react';
import classes from './Header.module.css';

export const Header = () => {
	return (
		<header className={classes['header']}>
			<div className={classes['header__content']}>
				<h1>MoonQuake Map</h1>
			</div>
		</header>
	);
};
