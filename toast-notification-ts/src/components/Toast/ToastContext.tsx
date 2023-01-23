import React, { createContext, useReducer } from 'react';
import Toast from './Toast';
import { ActionProps, ProviderProps, ToastProps } from '../../types/toast.type';
import { toastActions } from './toastActions';

export const initialState = [];

const toastReducer = (toasts: ToastProps[], { type, payload }: ActionProps) => {
	switch (type) {
		case 'CREATE_TOAST':
			const { toastId, itemType, title, message } = payload;
			return [...toasts, { toastId, itemType, title, message }];
		case 'REMOVE_TOAST':
			return toasts.filter((item) => item.toastId !== payload.toastId);
		default:
			return toasts;
	}
};

export const ToastContext = createContext<React.Dispatch<ActionProps> | any>([]);
export const ToastProvider = ({ children }: ProviderProps) => {
	const [toasts, dispatch] = useReducer(toastReducer, initialState);

	const handleRemove = (toastId: string) => {
		dispatch(toastActions.removeToast(toastId));
	};

	return (
		<ToastContext.Provider value={dispatch}>
			<div className='notification-wrapper'>
				{toasts.map((toast) => {
					return <Toast key={toast.toastId} {...toast} callback={handleRemove} />;
				})}
			</div>
			{children}
		</ToastContext.Provider>
	);
};
