import { Link } from 'react-router-dom'
import type { TFunction } from '@/types'

interface IMenuItem {
	onClick: TFunction
	navigateTo: string
	name: string
	iconName: string
}
/**
 * Item component
 * param {string} name - The name of the item
 * param {string} navigateTo - The URL to navigate to when the item is clicked
 * param {TFunction} onClick - The callback function to be called when the item is clicked
 * param {string} [iconName='fa fa-bars'] - The name of the icon to be displayed on the item
 *
 * returns {JSX.Element} A Link component with an optional icon
 */
export function Item({
	name,
	navigateTo = '',
	onClick,
	iconName = 'fa fa-bars',
}: Partial<IMenuItem>) {
	return (
		<div>
			<Link
				title={name}
				className="button-style menu descend"
				to={navigateTo}
				onClick={onClick}
			>
				{iconName && (
					<i
						data-testid={iconName}
						className={iconName}
					/>
				)}
			</Link>
		</div>
	)
}
