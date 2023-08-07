import React from 'react'
import { IsEmpty } from '@/services/Utils'
import { Separator } from '../Separator'
import { Menubar } from './Menubar'
import { IMenuItem } from '@/types'

interface IMenubarContainer {
	menus: Partial<IMenuItem>[]
}

export function MenubarContainer({ menus }: IMenubarContainer) {
	return (
		<aside>
			<Menubar>
				{menus.map(({ name, iconName, navigateTo, animation, onClick }) => (
					<React.Fragment key={name}>
						{name?.toLowerCase().includes('logout') && <Separator />}
						{!IsEmpty(name) && (
							<Menubar.Item {...{ name, iconName, navigateTo, animation, onClick }} />
						)}
					</React.Fragment>
				))}
			</Menubar>
		</aside>
	)
}
