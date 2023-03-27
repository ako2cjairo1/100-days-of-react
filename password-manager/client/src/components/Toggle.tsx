import { FCWithChildren, IChildren, IInputElement } from '@/types'
import '@/assets/modules/Toggle.css'

const Description: FCWithChildren<{ checked?: boolean }> = ({ children, checked }) => {
	return <span className={`description ${checked ? 'description-active' : ''}`}>{children}</span>
}

export const Toggle = ({ children, ...inputProps }: IInputElement & IChildren) => {
	return (
		<div className="container">
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
