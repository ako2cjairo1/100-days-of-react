import { IChildren, TFunction } from '@/types'
import { SubmitButton } from './SubmitButton'

interface IMenuItem {
	menuCb?: TFunction
	name: string
	iconName?: string
}

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

export const VaultMenu = ({ children }: IChildren) => {
	return <section className="form-container vault-menu">{children}</section>
}
VaultMenu.Item = Item
