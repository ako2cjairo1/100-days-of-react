import { fireEvent, render } from '@/services/Utils/test.util'
import { FormGroup, Input, Label } from '@/components/FormGroup'

describe('FormGroup', () => {
	it('renders the form with children', () => {
		const { getByText, getByTestId } = render(
			<FormGroup onSubmit={() => {}}>
				<Label
					data-testid="LabelId"
					props={{ label: 'Test Label' }}
				/>
				<Input
					data-testid="InputId"
					id="testid"
				/>
			</FormGroup>
		)
		expect(getByText('Test Label')).toBeInTheDocument()
		expect(getByTestId('InputId')).toBeInTheDocument()
	})

	it('calls the onSubmit function when the form is submitted', () => {
		const mockOnSubmit = vi.fn()
		const { getByTestId } = render(
			<FormGroup onSubmit={mockOnSubmit}>
				<Label props={{ label: 'Test Label' }}>Test Label</Label>
				<Input id="testid" />
				<button
					data-testid="submit-button"
					type="submit"
				>
					Submit
				</button>
			</FormGroup>
		)
		fireEvent.click(getByTestId('submit-button'))
		expect(mockOnSubmit).toHaveBeenCalled()
	})
})
