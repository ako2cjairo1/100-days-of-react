import { TFunction } from './global.type'

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

export interface IMenuItem {
	onClick: TFunction
	navigateTo: string
	name: string
	iconName: string
	animation: string
}
