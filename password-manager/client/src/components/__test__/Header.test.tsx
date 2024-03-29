import { render } from '@/utils/test.util'
import { Header } from '@/components'

describe('Header', () => {
	it('should render a Header.Title with given "title" and "subtitle"', () => {
		const props = { title: 'Example Title', subTitle: 'Example Subtitle' }
		const { getByText } = render(
			<Header>
				<Header.Title
					title={props.title}
					subTitle={props.subTitle}
				/>
			</Header>
		)
		expect(getByText(props.title)).toBeInTheDocument()
		expect(getByText(props.subTitle)).toBeInTheDocument()
	})

	it('should render a Header.Logo component"', () => {
		const { container } = render(
			<Header>
				<Header.Logo />
			</Header>
		)
		expect(container.querySelector('.logo-key.fade-in.fa.fa-key')).toBeInTheDocument()
		expect(container.querySelector('.logo-shield.scale-up.fa.fa-shield')).toBeInTheDocument()
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

	it('should render Header.Status success icon when status.success is true and have a message', () => {
		const { container } = render(
			<Header>
				<Header.Status status={{ success: true, message: 'success message' }} />
			</Header>
		)
		expect(container.querySelector('.fa.fa-circle-check')).toBeInTheDocument()
	})

	it('should not render Header.Status when either success and message are not truthy', () => {
		const { container } = render(
			<Header>
				<Header.Status status={{ success: true, message: '' }} />
			</Header>
		)
		expect(container.querySelector('.fa.fa-circle-check')).not.toBeInTheDocument()
	})

	it('should render Header.Status error icon and message when "success" is false and "errMsg" is defined', () => {
		const props = { success: false, message: 'Error message' }
		vi.useFakeTimers()
		const { container, getByText } = render(
			<Header>
				<Header.Status status={props} />
			</Header>
		)
		vi.advanceTimersByTime(3000)
		expect(container.querySelector('.fa-solid.fa-triangle-exclamation')).toBeInTheDocument()
		expect(getByText(props.message)).toBeInTheDocument()
		vi.useRealTimers()
	})
})
