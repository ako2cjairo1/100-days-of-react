import { ComponentProps } from 'react'
import { Header, Title } from './Header'
import { AnimatedIcon } from './AnimatedIcon'

export function ProcessIndicator({ title, subTitle }: ComponentProps<typeof Title>) {
	return (
		<div className="form-container">
			<Header>
				<AnimatedIcon
					iconName="fa fa-cog"
					animation="fa-spin"
					animateOnLoad
				/>
				<Header.Title {...{ title, subTitle }} />
			</Header>
		</div>
	)
}
