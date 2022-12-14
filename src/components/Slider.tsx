import * as SliderPrimitive from '@radix-ui/react-slider';
import classes from './Slider.module.css';

export const Slider = () => {
	return (
		<SliderPrimitive.Root className={classes['slider']}>
			<SliderPrimitive.Track className={classes['slider__track']}>
				<SliderPrimitive.Range className={classes['slider__range']} />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb className={classes['slider__thumb']} />
		</SliderPrimitive.Root>
	);
};
