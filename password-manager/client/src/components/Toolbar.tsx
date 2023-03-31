import { IChildren, TFunction } from '@/types'
import { SubmitButton } from './SubmitButton'

interface IMenuItem {
	menuCb?: TFunction
	name: string
	iconName?: string
}

/**
 * Item component
 * param {string} name - The name of the item
 * param {TFunction} [menuCb] - The callback function for the menu
 * param {string} [iconName='fa fa-bars'] - The name of the icon
 * returns {JSX.Element} SubmitButton component
 */
const Item = ({ name, menuCb, iconName = 'fa fa-bars' }: IMenuItem) => {
	return (
		<SubmitButton
			title={name}
			onClick={menuCb}
			className="menu descend"
			submitted={false}
			iconName={iconName}
		/>
	)
}

/**
 * Toolbar component
 * param {IChildren} children - The children of the Toolbar component
 * returns {JSX.Element} section element with class "form-container vault-menu"
 */
export const Toolbar = ({ children }: IChildren) => {
	return <section className="form-container vault-menu">{children}</section>
}
Toolbar.Item = Item
