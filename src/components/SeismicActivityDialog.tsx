import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconButton } from './IconButton';
import { CloseIcon } from './icons/CloseIcon';

import classes from './SeismicActivityDialog.module.css';

export const SeismicActivityDialog = () => (
	<DialogPrimitive.Root open={true}>
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className={classes['overlay']} />
			<DialogPrimitive.Content className={classes['content']}>
				<DialogPrimitive.Title className={classes['title']}>Seismic activity</DialogPrimitive.Title>
				<DialogPrimitive.Description className={classes['description']}></DialogPrimitive.Description>
				<DialogPrimitive.Close asChild>
					<IconButton className={classes['close']}>
						<CloseIcon />
					</IconButton>
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	</DialogPrimitive.Root>
);
