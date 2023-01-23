import { CreateToastProps, RemovePayloadProps, ToastProps } from '../../types/toast.type';

const createToast = (toast: ToastProps): CreateToastProps => {
	return {
		type: 'CREATE_TOAST',
		payload: toast,
	};
};
const removeToast = (toastId: string): RemovePayloadProps => {
	return {
		type: 'REMOVE_TOAST',
		payload: {
			toastId,
		},
	};
};

export const toastActions = {
	createToast,
	removeToast,
};
