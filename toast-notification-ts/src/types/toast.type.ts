export type ItemTypes = 'default' | 'SUCCESS' | 'ERROR' | string;
export type ToastProps = {
	itemType: ItemTypes;
	title: string;
	message: string;
	toastId: string;
};

export type ProviderProps = {
	children: React.ReactNode;
};

export type CreateToastProps = {
	type: 'CREATE_TOAST';
	payload: ToastProps;
};

export type RemovePayloadProps = {
	type: 'REMOVE_TOAST';
	payload: {
		toastId: string;
	};
};

export type ActionProps = CreateToastProps | RemovePayloadProps;
