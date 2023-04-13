import { ReactNode } from 'react'
import { IChildren } from './base.type'
import { TFunction, TKeychain, TStatus, TValidation } from './global.type'

// Component Interfaces
type TDetailedHTMLProps<T = HTMLElement> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>
export interface IHeaderProps extends IChildren, TDetailedHTMLProps {
	title?: string
	subTitle?: string
	status?: TStatus
}

export interface ILinkLabel extends Pick<TDetailedHTMLProps, 'className' | 'onClick' | 'children'> {
	linkRef?: React.Ref<HTMLAnchorElement>
	routeTo: string
	preText: string
}

type TLabelAttrs = TDetailedHTMLProps<HTMLLabelElement>
export interface IRequiredLabelProps extends Omit<TLabelAttrs, 'htmlFor' | 'form'> {
	labelFor?: string // overrides "htmlFor" attribute
	label?: string
	subLabel?: string
	isFulfilled?: boolean
	isOptional?: boolean
}

export interface ISubmitButton
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'> {
	props: {
		variant?: 'primary' | 'cancel' | 'default'
		submitted?: boolean
		disabled?: boolean
		textStatus?: string
		iconName?: string
	}
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

export interface IFormInput
	extends IInputElement,
		Pick<IRequiredLabelProps, 'label' | 'subLabel' | 'isOptional'>,
		Partial<Pick<IValidationMessage, 'title' | 'validations'>> {
	id: string
	type: React.HTMLInputTypeAttribute
	linkRef?: React.Ref<HTMLInputElement>
	LabelComponent?: ReactNode
	havePasswordMeter?: boolean
	isValid?: boolean
	isFocused?: boolean
	validations?: TValidation[]
}

// Helper function interfaces
export interface IPasswordStrength {
	password?: string
	regex?: RegExp
}

export interface IRegExObj {
	[key: string]: RegExp
}

export interface IKeychain extends Partial<TKeychain> {
	actionCallback: TFunction<[keychainId?: string]>
}

export interface IModal extends IChildren {
	isOpen: boolean
	noBackdrop?: boolean
	clickBackdropToClose?: boolean
	onClose?: TFunction
	hideCloseButton?: boolean
}
