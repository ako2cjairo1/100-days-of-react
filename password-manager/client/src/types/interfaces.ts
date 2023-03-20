import { TStatus } from './global.type'

// Component Interfaces
type TDetailedHTMLProps<T = HTMLElement> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>
export interface IHeaderProps extends TDetailedHTMLProps {
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
	labelFor: string // overrides "htmlFor" attribute
	label: string
	subLabel?: string
	isFulfilled?: boolean
	isOptional?: boolean
}

type TButtonAttrs = TDetailedHTMLProps<HTMLButtonElement>
export interface ISubmitButton extends Omit<TButtonAttrs, 'type' | 'disabled'> {
	submitted: boolean
	disabled?: boolean
	textStatus?: string
	iconName?: string
}

export interface IValidationMessage<T> {
	isVisible: boolean
	title?: string
	validations: Array<T>
}

// Helper function interfaces
export interface IPasswordStrength {
	password: string
	regex?: RegExp
}
