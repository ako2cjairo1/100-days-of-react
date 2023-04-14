import { IChildren } from './base.type'
import { TFunction, TValidation } from './global.type'

// Component Interfaces
export type TDetailedHTMLProps<T = HTMLElement> = React.DetailedHTMLProps<
	React.HTMLAttributes<T>,
	T
>

type TLabelAttrs = TDetailedHTMLProps<HTMLLabelElement>
export interface IRequiredLabelProps extends Omit<TLabelAttrs, 'htmlFor' | 'form'> {
	labelFor?: string // overrides "htmlFor" attribute
	label?: string
	subLabel?: string
	isFulfilled?: boolean
	isOptional?: boolean
}
export interface IInputElement
	extends Omit<
		React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
		'type' | 'id' | 'ref' | 'itemRef' | 'autoFocus'
	> {
	id: string // override id as required
	type?: React.HTMLInputTypeAttribute
	linkRef?: React.Ref<HTMLInputElement>
}
export interface IValidationMessage<T = TValidation> {
	isVisible: boolean
	title?: string
	validations: T[]
}

// Helper function interfaces
export interface IPasswordStrength {
	password?: string
	regex?: RegExp
}

export interface IRegExObj {
	[key: string]: RegExp
}

export interface IModal extends IChildren {
	isOpen: boolean
	noBackdrop?: boolean
	clickBackdropToClose?: boolean
	onClose?: TFunction
	hideCloseButton?: boolean
}
