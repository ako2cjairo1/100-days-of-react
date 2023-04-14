import { IChildren, TDetailedHTMLProps } from '@/types'
import { Logo } from './Logo'
import { Title } from './Title'
import { Status } from './Status'

interface IHeaderProps extends IChildren, TDetailedHTMLProps {}

/**
The `Header` component is a React functional component that renders a header element with optional title, subtitle, and status.

* parameter `children?: ReactNode`: Optional children to be rendered inside the header element.
*/
export function Header({ children, ...props }: IHeaderProps) {
	return <header {...props}>{children}</header>
}

Header.Logo = Logo
Header.Title = Title
Header.Status = Status
