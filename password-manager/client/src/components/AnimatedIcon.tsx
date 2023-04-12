import { IChildren, TFunction } from '@/types'
import { useState } from 'react'

type TAnimation =
	| 'fa-shake'
	| 'fa-spin'
	| 'fa-beat-fade'
	| 'spinner'
	| 'pulse'
	| 'scale-up'
	| 'scale-down'
	| 'fade-in'
	| 'spins'
	| 'descend'
interface IAnimatedIcon extends IChildren {
	className?: string
	iconName?: string
	animation?: TAnimation | (string & { animation?: string })
	animateOnLoad?: boolean
	onClick?: TFunction
}
export function AnimatedIcon({
	children,
	className = '',
	iconName = '',
	animation = '',
	animateOnLoad = false,
	onClick,
}: IAnimatedIcon) {
	const [hover, setHover] = useState(false)

	const disabled = className?.includes('disabled')

	return (
		<i
			data-testid="animated-icon"
			className={`${className} ${iconName} ${(animateOnLoad || hover) && animation}`}
			onClick={onClick}
			onMouseOver={() => !disabled && setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			{children}
		</i>
	)
}
