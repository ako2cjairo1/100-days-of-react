import { IChildren } from '@/types'

interface IDescription extends IChildren {
	checked?: boolean
}
export function Description({ children, checked }: IDescription) {
	return (
		<span
			data-testid="toggle-description"
			className={`description ${checked ? 'description-active' : ''}`}
		>
			{children}
		</span>
	)
}
