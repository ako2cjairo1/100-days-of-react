import React, { useEffect, useRef, useState } from 'react';
import { Body, ProgressBar, Title, Toast } from './styles';

export type ToastProps = {
	children?: React.ReactNode;
	itemType?: string;
	title?: string;
	message?: string;
	id: string;
	callback?: (id: string) => void;
};

export default ({ children, id, itemType, title, message, callback }: ToastProps) => {
	const [progress, setProgress] = useState(0);
	const [isOpen, setIsOpen] = useState(true);
	const [isPaused, setIsPaused] = useState(false);
	let timerId = useRef<number | null>(null);
	let timer = useRef<number | null>(null);

	useEffect(() => {
		if (isOpen && !isPaused) {
			timerId.current = setInterval(() => setProgress((prev) => prev + 0.5), 20);

			if (progress >= 100) {
				handleClose();
			}
		}
		// cleanup
		return () => {
			if (timer.current) clearTimeout(timer.current);
			stopTimer();
		};
	}, [isOpen, isPaused, progress]);

	const stopTimer = () => {
		// make sure the interval ref is not undefined
		if (timerId.current) clearInterval(timerId.current);
	};

	const handleClose = () => {
		stopTimer();
		setIsOpen(false);
		timer.current = setTimeout(() => console.log('Initial timeout!'), 1000);
		// clearTimeout(timer);
	};

	const handleMouseEnter = () => {
		if (isOpen) {
			stopTimer();
			setIsPaused(true);
		}
	};

	const handleMouseLeave = () => {
		if (isOpen) setIsPaused(false);
	};

	return (
		<Toast
			id={id}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClose}
			datatype={isOpen ? 'slide-left' : 'slide-right'}>
			<Title>{title}</Title>
			{children ? children : <Body>{message}</Body>}
			<ProgressBar itemType={itemType} style={{ width: `${progress}%` }} />
		</Toast>
	);
};
