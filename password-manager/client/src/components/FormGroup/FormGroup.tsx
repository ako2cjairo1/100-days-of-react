import { Label, Input } from '@/components'
import type { IChildren, TFunction } from '@/types'

interface IFormGroup extends IChildren {
	onSubmit: TFunction<[e: React.FormEvent]>
}
/**
 * Renders a form element
 * param children - The child components to be rendered inside the form
 * param onSubmit - A callback function that is triggered when the form is submitted
 *
 * returns A form element with an onSubmit event handler containing the child components
 */
export function FormGroup({ children, onSubmit }: IFormGroup) {
	return <form onSubmit={onSubmit}>{children}</form>
}

FormGroup.Label = Label
FormGroup.Input = Input
