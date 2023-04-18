import type { IInputElement } from '@/types'
/**
 * Renders an input element
 * param linkRef - A ref to be attached to the input element
 * param rest - The remaining props to be passed to the input element
 *
 * returns An input element with the given props and ref
 */
export function Input({ linkRef, ...rest }: IInputElement) {
	return (
		<input
			{...rest}
			ref={linkRef}
			autoFocus={false}
		/>
	)
}
