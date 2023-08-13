import { AnchorWrapper } from '@/components'
import { render } from '@/utils/test.util'

describe('AnchorWrapper', () => {
	it('renders an anchor element with the provided href and children', () => {
		const { getByText } = render(
			<AnchorWrapper href="https://www.example.com">
				<span>Child Element</span>
			</AnchorWrapper>
		)
		expect(getByText('Child Element').closest('a')).toHaveAttribute(
			'href',
			'https://www.example.com'
		)
	})

	it('sets the textDecoration style to none if the children is a valid ReactNode', () => {
		const { getByText } = render(
			<AnchorWrapper href="https://www.example.com">
				<span>Child Element</span>
			</AnchorWrapper>
		)
		expect(getByText('Child Element').closest('a')).toHaveStyle('text-decoration: none')
	})

	it('does not set the textDecoration style if the children is a string', () => {
		const { getByText } = render(
			<AnchorWrapper href="https://www.example.com">Child Element</AnchorWrapper>
		)
		expect(getByText('Child Element').closest('a')).not.toHaveStyle('text-decoration: none')
	})
})
