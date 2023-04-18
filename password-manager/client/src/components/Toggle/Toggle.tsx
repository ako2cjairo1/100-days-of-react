import '@/assets/modules/Toggle.css'
import { Description } from '@/components/Toggle'
import type { IChildren, IInputElement } from '@/types'

interface IToggle extends IChildren, IInputElement {}
export function Toggle({ children, ...rest }: IToggle) {
	return (
		<div className="toggle-container">
			<input
				type="checkbox"
				{...rest}
				className="input"
			/>
			<label
				htmlFor={rest.id}
				className="label"
			>
				<span className="button" />
			</label>

			<div
				data-testid="description-container"
				className="description-container small"
			>
				{children}
			</div>
		</div>
	)
}

Toggle.Description = Description
