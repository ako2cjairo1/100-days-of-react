import { IChildren } from '@/types'
import React from 'react'

interface IAnchorWrapper extends IChildren {
	href?: string
}

/**
 * Renders an AnchorWrapper component
 * param href - The URL that the anchor element links to
 * param children - The children elements to be rendered inside the anchor element
 *
 * returns A React element representing an AnchorWrapper component
 */
export function AnchorWrapper({ href = '#', children }: IAnchorWrapper) {
	const isNode = React.isValidElement(children)

	return (
		<a
			style={{ textDecoration: isNode ? 'none' : '' }}
			href={href}
			rel="noreferrer"
			target="_blank"
		>
			{children}
		</a>
	)
}
