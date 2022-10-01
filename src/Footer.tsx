import classes from './Footer.module.css';
import { Slider } from './Slider';
import { PlayIcon } from './PlayIcon';
import { ForwardIcon } from './ForwardIcon';
import { BackwardIcon } from './BackwardIcon';

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
