import { IChildren } from '@/types'
import { Item } from './Item'

/**
 * Toolbar component
 * param {IChildren} children - The children elements to be rendered inside the Toolbar
 *
 * returns {JSX.Element} A section element with the class "form-container vault-menu" containing the children elements
 */
export function Menubar({ children }: IChildren) {
	return <section className="form-container vault-menu">{children}</section>
}

Menubar.Item = Item
