import { useState } from 'react'

interface IAnimatedIcon {
	className?: string
	iconName: string
	animation?: 'fa-shake' | 'fa-spin' | 'fa-beat-fade'
	animateOnLoad?: boolean
	onClick?: () => void
}
export function AnimatedIcon({
	className,
	iconName,
	animation,
	animateOnLoad = false,
	onClick,
}: IAnimatedIcon) {
	const [hover, setHover] = useState(false)

	const disabled = className?.includes('disabled')

	return (
		<i
			className={`${className} ${iconName} ${(animateOnLoad || hover) && animation}`}
			onClick={onClick}
			onMouseOver={() => !disabled && setHover(true)}
			onMouseLeave={() => setHover(false)}
		/>
	)
}
