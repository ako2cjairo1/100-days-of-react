import { TFunction } from '@/types'

interface IProvider {
	label: string
	src: string
	actionHandler: TFunction
}
export function Provider({ label, src, actionHandler }: IProvider) {
	return (
		<button onClick={actionHandler}>
			<img
				src={src}
				alt={label}
			/>{' '}
			{label}
		</button>
	)
}
