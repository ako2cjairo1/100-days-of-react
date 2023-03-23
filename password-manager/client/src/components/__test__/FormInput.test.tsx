import { FormInput } from '@/components'
import { render, userEvent, screen } from '@/services/Utils/test.util'

describe('FormInput', () => {
	it('renders validation message if input is invalid', () => {
		render(
			<FormInput
				label="Password"
				validations={[{ isValid: false, message: 'Password is required' }]}
				id="password"
				type="password"
			/>
		)
		userEvent.tab()
		expect(screen.getByText('Password is required')).toBeInTheDocument()
	})

	it('does not render validation message if input is valid', () => {
		render(
			<FormInput
				label="Email"
				validations={[{ isValid: true, message: 'Email is required' }]}
				id="name"
				type="email"
			/>
		)
		userEvent.tab()
		expect(screen.getByText('Email is required')).toBeInTheDocument()
	})

	it('does not render optional label if isOptional is false', () => {
		render(
			<FormInput
				label="Name"
				id="name"
				type="text"
				validations={[]}
			/>
		)
		expect(screen.queryByText('(required)')).toBeInTheDocument()
	})
})
