import React, { useEffect, useRef, useState } from 'react';
import { ToastProps } from '../../types/toast.type';
import { Body, ProgressBar, Title, Toast } from './styles';

type ToastProp = ToastProps & Partial<OptionalToastProps>;

type OptionalToastProps = {
	children: React.ReactNode;
	callback: (toastId: string) => void;
};
export default ({ children, toastId, itemType, title, message, callback }: ToastProp) => {
	const [progress, setProgress] = useState(0);
	const [isOpen, setIsOpen] = useState(true);
	const [isPaused, setIsPaused] = useState(false);
	let timerId = useRef<number | null>(null);

	useEffect(() => {
		if (isOpen && !isPaused) {
			timerId.current = setInterval(() => setProgress((prev) => prev + 0.5), 20);

			if (progress >= 100) {
				handleClose();
			}
		}
		// cleanup
		return () => stopTimer();
	}, [isOpen, isPaused, progress]);

	const stopTimer = () => {
		// make sure the interval ref is not undefined
		if (timerId.current) clearInterval(timerId.current);
	};

	const handleClose = () => {
		setIsOpen(false);
		stopTimer();
		setTimeout(() => callback && callback(toastId), 200);
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
			key={toastId}
			id={toastId}
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
