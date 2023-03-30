import { FCProps, IChildren, IVaultItem, TFunction } from '@/types'
import { VaultItem } from './VaultItem'

interface IVaultList {
	securedList: Array<IVaultItem>
	listEvent: TFunction<string>
}

const List: FCProps<IVaultList> = ({ securedList, listEvent }) => {
	return (
		<>
			{securedList.map(({ logo, link, username }, idx) => (
				<VaultItem
					key={idx}
					onClick={listEvent}
					{...{ logo, link, username }}
				/>
			))}
		</>
	)
}

export const MainVault = ({ children }: IChildren) => {
	return <section className="form-container">{children}</section>
}

MainVault.List = List
