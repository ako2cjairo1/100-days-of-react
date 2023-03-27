import { FCWithChildren, IChildren, IInputElement } from '@/types'
import '@/assets/modules/Toggle.css'

const Label: FCWithChildren = ({ children }) => {
	return <div className="toggle-description-container small">{children}</div>
}

export const Toggle = ({ children, ...inputProps }: IInputElement & IChildren) => {
	return (
		<div className="toggle-container">
			<input
				type="checkbox"
				className="toggle-input"
				{...inputProps}
			/>
			<label
				htmlFor={inputProps.id}
				className="toggle-label"
			>
				<span className="toggle-button" />
			</label>
			{children}
		</div>
	)
}

Toggle.Label = Label
