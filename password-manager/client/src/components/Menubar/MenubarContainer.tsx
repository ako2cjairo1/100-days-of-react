import React from 'react'
import type { IMenuItem } from '@/types'
import { IsEmpty } from '@/utils'
import { Separator, Menubar } from '@/components'

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
