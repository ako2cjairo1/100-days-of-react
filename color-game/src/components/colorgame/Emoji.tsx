import { memo } from 'react';
import { cry, sad, wink, wink2 } from '../../assets';

export const Emoji =  memo(({ isWin }: { isWin: boolean }) => {
	let reactions = [wink2, wink];

	if (!isWin) {
		reactions = [sad, cry];
	}
	return <img alt='wink/sad emoji' src={reactions[Math.floor(Math.random() * 2)]} />;
});
