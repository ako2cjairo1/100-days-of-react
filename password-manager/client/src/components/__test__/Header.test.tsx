import { render } from '@/services/Utils/test.util'
import { Header } from '@/components/Header'

describe('Header', () => {
	it('should render a header element with given "title" and "subtitle"', () => {
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

	it('should render a animated Logo component"', () => {
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

	it('should render success icon when status.success is true and have a message', () => {
		const { container } = render(
			<Header>
				<Header.Status status={{ success: true, message: 'success message' }} />
			</Header>
		)
		expect(container.querySelector('.fa.fa-check-circle')).toBeInTheDocument()
	})

	it('should not render success icon when either success and message are not truthy', () => {
		const { container } = render(
			<Header>
				<Header.Status status={{ success: true, message: '' }} />
			</Header>
		)
		expect(container.querySelector('.fa.fa-check-circle')).not.toBeInTheDocument()
	})

	it('should render error icon and message when "success" is false and "errMsg" is defined', () => {
		const props = { success: false, message: 'Error message' }
		const { container, getByText } = render(
			<Header>
				<Header.Status status={props} />
			</Header>
		)
		expect(container.querySelector('.fa-solid.fa-triangle-exclamation')).toBeInTheDocument()
		expect(getByText(props.message)).toBeInTheDocument()
	})
})
