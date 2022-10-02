import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

import classes from './IconButton.module.css';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = ({ className, ...props }: IconButtonProps) => (
	<button className={clsx(className, classes['root'])} {...props} />
);
