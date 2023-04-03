import { IChildren, TFunction } from '@/types'
import { Link } from 'react-router-dom'

interface IMenuItem {
	menuCb: TFunction
	navigateTo: string
	name: string
	iconName: string
}

/**
 * Item component
 * param {string} name - The name of the item
 * param {string} navigateTo - The URL to navigate to when the item is clicked
 * param {TFunction} menuCb - The callback function to be called when the item is clicked
 * param {string} [iconName='fa fa-bars'] - The name of the icon to be displayed on the item
 *
 * returns {JSX.Element} A Link component with an optional icon
 */
const Item = ({ name, navigateTo, menuCb, iconName = 'fa fa-bars' }: Partial<IMenuItem>) => {
	return (
		<Link
			title={name}
			className="button-style menu descend"
			to={navigateTo ?? ''}
			onClick={menuCb}
		>
			{iconName && (
				<i
					data-testid={iconName}
					className={iconName}
				/>
			)}
		</Link>
	)
}

/**
 * Toolbar component
 * param {IChildren} children - The children elements to be rendered inside the Toolbar
 *
 * returns {JSX.Element} A section element with the class "form-container vault-menu" containing the children elements
 */
export const Toolbar = ({ children }: IChildren) => {
	return <section className="form-container vault-menu">{children}</section>
}
Toolbar.Item = Item
