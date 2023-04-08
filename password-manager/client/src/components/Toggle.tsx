import { IChildren, IInputElement } from '@/types'
import '@/assets/modules/Toggle.css'

interface IDescription extends IChildren {
	checked?: boolean
}
function Description({ children, checked }: IDescription) {
	return <span className={`description ${checked ? 'description-active' : ''}`}>{children}</span>
}

interface IToggle extends IChildren, IInputElement {}
export function Toggle({ children, ...inputProps }: IToggle) {
	return (
		<div className="toggle-container">
			<input
				type="checkbox"
				className="input"
				{...inputProps}
			/>
			<label
				htmlFor={inputProps.id}
				className="label"
			>
				<span className="button" />
			</label>

			<div className="description-container small">{children}</div>
		</div>
	)
}

Toggle.Description = Description
