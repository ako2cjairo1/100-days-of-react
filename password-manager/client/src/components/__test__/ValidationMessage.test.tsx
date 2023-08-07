import { ValidationMessage } from '@/components'
import { act, render } from '@/services/Utils/test.util'

describe('ValidationMessage', () => {
	it('should render title when isVisible is true', () => {
		const { getByText } = render(
			<ValidationMessage
				isVisible={true}
				title="Test Title"
				validations={[]}
			/>
		)
		expect(getByText('Test Title')).toBeInTheDocument()
	})

	it('should not render title when isVisible is false', async () => {
		vi.useFakeTimers()
		const { queryByText } = render(
			<ValidationMessage
				isVisible={false}
				title="Test Title"
				validations={[]}
			/>
		)
		await act(async () => {
			vi.advanceTimersByTime(3000)
		})
		expect(queryByText('Test Title')).not.toBeInTheDocument()
	})

	it('should render validation messages when isVisible is true', () => {
		const validations = [
			{ isValid: true, message: 'Valid Message' },
			{ isValid: false, message: 'Invalid Message' },
		]
		const { getByText } = render(
			<ValidationMessage
				isVisible={true}
				title=""
				validations={validations}
			/>
		)
		expect(getByText('Valid Message')).toBeInTheDocument()
		expect(getByText('Invalid Message')).toBeInTheDocument()
	})

	it('should not render validation messages when isVisible is false', async () => {
		vi.useFakeTimers()
		const validations = [
			{ isValid: true, message: 'Valid Message' },
			{ isValid: false, message: 'Invalid Message' },
		]
		const { queryByText } = render(
			<ValidationMessage
				isVisible={false}
				title=""
				validations={validations}
			/>
		)
		await act(async () => {
			vi.advanceTimersByTime(3000)
		})
		expect(queryByText('Valid Message')).not.toBeInTheDocument()
		expect(queryByText('Invalid Message')).not.toBeInTheDocument()
	})

	it('should render a success icon for valid validations', () => {
		const validations = [{ isValid: true, message: 'Valid Message' }]
		const { container } = render(
			<ValidationMessage
				isVisible={true}
				title=""
				validations={validations}
			/>
		)
		expect(container.querySelector('.fa-circle-check')).toBeInTheDocument()
	})

	it('should render an error icon for invalid validations', () => {
		const validations = [{ isValid: false, message: 'Invalid Message' }]
		const { container } = render(
			<ValidationMessage
				isVisible={true}
				title=""
				validations={validations}
			/>
		)
		expect(container.querySelector('.fa-close')).toBeInTheDocument()
	})
})
