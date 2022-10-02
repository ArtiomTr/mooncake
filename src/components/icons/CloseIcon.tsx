import clsx from 'clsx';
import { SVGAttributes } from 'react';

import classes from './Icon.module.css';

export const CloseIcon = ({ className, ...props }: SVGAttributes<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		className={clsx(className, classes['root'])}
		{...props}
	>
		<path
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="32"
			d="M368 368L144 144M368 144L144 368"
		/>
	</svg>
);
