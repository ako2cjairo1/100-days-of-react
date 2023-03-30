import { FCProps, IChildren, IInputElement, IRequiredLabelProps } from '@/types'
import { RequiredLabel } from './RequiredLabel'

interface ILabel extends IChildren {
	props: Pick<IRequiredLabelProps, 'label' | 'labelFor' | 'subLabel' | 'isOptional' | 'isFulfilled'>
}
const Label = ({ children, props }: ILabel) => {
	const { labelFor, label, subLabel, isOptional, isFulfilled } = props

	return (
		<div className="password-label">
			<RequiredLabel
				label={label}
				labelFor={labelFor}
				subLabel={subLabel}
				isOptional={isOptional}
				isFulfilled={isFulfilled}
			/>
			{children}
		</div>
	)
}
const Input: FCProps<
	IInputElement & {
		id: string
		type: React.HTMLInputTypeAttribute
		linkRef?: React.Ref<HTMLInputElement>
	}
> = ({ linkRef, ...rest }) => {
	return (
		<input
			{...rest}
			ref={linkRef}
			autoFocus={false}
		/>
	)
}

interface IPMForm extends IChildren {
	onSubmit: (e: React.FormEvent) => unknown
}
export const PMForm = ({ children, onSubmit }: IPMForm) => {
	return <form onSubmit={onSubmit}>{children}</form>
}

PMForm.Label = Label
PMForm.Input = Input
