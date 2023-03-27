import { Header } from '@/components'
import { render } from '@/services/Utils/test.util'

describe('Header', () => {
	it('should render a header element with given "title" and "subtitle"', () => {
		const props = { title: 'Example Title', subTitle: 'Example Subtitle' }
		const { getByText } = render(<Header {...props} />)
		expect(getByText(props.title)).toBeInTheDocument()
		expect(getByText(props.subTitle)).toBeInTheDocument()
	})

	it('should render children when given', () => {
		const childElement = 'Example content'
		const { getByText } = render(
			<Header>
				<p>{childElement}</p>
			</Header>
		)
		expect(getByText(childElement)).toBeInTheDocument()
	})

	it('should render success icon when status.success is true', () => {
		const { container } = render(<Header status={{ success: true }} />)
		expect(container.querySelector('.fa.fa-check')).toBeInTheDocument()
	})

	it('should render error icon and message when "success" is false and "errMsg" is defined', () => {
		const props = { success: false, errMsg: 'Error message' }
		const { container, getByText } = render(<Header status={props} />)
		expect(container.querySelector('.fa.fa-exclamation-triangle')).toBeInTheDocument()
		expect(getByText(props.errMsg)).toBeInTheDocument()
	})
})
