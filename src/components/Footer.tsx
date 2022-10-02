import classes from './Footer.module.css';
import { BackwardIcon } from './icons/BackwardIcon';
import { ForwardIcon } from './icons/ForwardIcon';
import { PlayIcon } from './icons/PlayIcon';
import { Slider } from './Slider';

export const Footer = () => {
	return (
		<header className={classes['footer']}>
			<div className={classes['footer__content']}>
				<Slider />
				<div className={classes['controls']}>
					<button className={classes['button']}>
						<BackwardIcon className={classes['backward']} />
					</button>
					<button className={classes['button']}>
						<PlayIcon className={classes['play']} />
					</button>
					<button className={classes['button']}>
						<ForwardIcon className={classes['forward']} />
					</button>
				</div>
			</div>
		</header>
	);
};
