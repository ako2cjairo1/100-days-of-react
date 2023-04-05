import { ReactNode } from 'react'
import { IChildren } from './base.type'
import { TFunction, TStatus, TValidation } from './global.type'

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
	labelFor?: string // overrides "htmlFor" attribute
	label?: string
	subLabel?: string
	isFulfilled?: boolean
	isOptional?: boolean
}

type TButtonAttrs = TDetailedHTMLProps<HTMLButtonElement>
export interface ISubmitButton extends Omit<TButtonAttrs, 'type' | 'disabled'> {
	variant?: 'primary' | 'cancel' | 'default'
	submitted: boolean
	disabled?: boolean
	textStatus?: string
	iconName?: string
}
export interface IInputElement
	extends Omit<
		React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
		'type' | 'id' | 'ref' | 'itemRef'
	> {
	id: string // override id as required
}
export interface IValidationMessage<T = TValidation> {
	isVisible: boolean
	title?: string
	validations: Array<T>
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
	validations?: Array<TValidation>
}

// Helper function interfaces
export interface IPasswordStrength {
	password?: string
	regex?: RegExp
}

export interface IRegExObj {
	[key: string]: RegExp
}

export interface IKeychainItem {
	keychainId: number
	logo?: string
	website?: string
	username: string
	password?: string
	onClick?: TFunction<number>
}

export interface IModal extends IChildren {
	props: {
		isOpen: boolean
		noBackdrop?: boolean
		clickBackdropToClose?: boolean
		onClose?: TFunction
		hideCloseButton?: boolean
	}
}

// import { Header } from '@/components'
// import { render, cleanup } from '@/services/Utils/test-utils'
// afterEach(() => cleanup())
// 1. Generate function comments (/** * short description here... * param ... * param ... * returns ... */)
// 2. Generate automated tests (react-testing i.e.: describe, it, expected tobe, etc.), create test cases for all possible input parameters (required and optional)
// describe('Simple working test', () => {
// it('the title is visible', () => { // render(<App />) // expect(screen.getByText(/Hello Vite \+ React!/i)).toBeInTheDocument() // }) // it('should increment count on click', async () => { // render(<App />) // userEvent.click(screen.getByRole('button')) // expect(await screen.findByText(/count is: 1/i)).toBeInTheDocument() // }) // it('uses flexbox in app header', async () => { // render(<App />) // const element = screen.getByRole('banner') // expect(element.className).toEqual('App-header') // expect(getComputed
