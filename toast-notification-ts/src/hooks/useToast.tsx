import { useContext } from 'react';
import { toastActions } from '../components/Toast/toastActions';
import { ToastContext } from '../components/Toast/ToastContext';
import { v4 } from 'uuid';
import { ToastProps } from '../types/toast.type';

type UseToastProps = Omit<ToastProps, 'toastId'>;

export const useToast = () => {
	const toastDispatcher = useContext(ToastContext);

	return (toast: UseToastProps) => {
		toastDispatcher(toastActions.createToast({ toastId: v4(), ...toast }));
	};
};
