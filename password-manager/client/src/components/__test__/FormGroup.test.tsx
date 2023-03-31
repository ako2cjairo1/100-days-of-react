import { FormGroup } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'

describe('FormGroup components', () => {
	it('renders a label with the given properties', () => {
		const props = {
			labelFor: 'input-id',
			label: 'Label text',
			subLabel: 'Sublabel text',
			isOptional: true,
			isFulfilled: false,
		}
		const { getByText } = render(
			<FormGroup onSubmit={() => {}}>
				<FormGroup.Label props={props} />
			</FormGroup>
		)
		expect(getByText('Label text Sublabel text')).toBeInTheDocument()
	})

	it('renders an input with the given properties', () => {
		const { getByDisplayValue } = render(
			<FormGroup onSubmit={() => {}}>
				<FormGroup.Input
					id="input-id"
					type="text"
					value="Input value"
				/>
			</FormGroup>
		)
		expect(getByDisplayValue('Input value')).toBeInTheDocument()
	})

	it('triggers the onSubmit callback when the form is submitted', () => {
		const onSubmit = vi.fn()
		const { getByTestId } = render(
			<FormGroup onSubmit={onSubmit}>
				<button
					data-testid="submit-button"
					type="submit"
				>
					Submit
				</button>
			</FormGroup>
		)
		fireEvent.click(getByTestId('submit-button'))
		expect(onSubmit).toHaveBeenCalled()
	})
})
