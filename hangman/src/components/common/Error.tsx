import styles from '../../modules/Error.module.css'
import { ErrorProps } from '../../types/HangMan.type'

export const Error = ({ message }: ErrorProps) => {
	const { error, emoji } = styles
	console.warn(message)
	return (
		<div className={error}>
			{' '}
			<h2>
				<span className={emoji}>😩</span> Something went wrong!
			</h2>
			<p>Try to refresh the page</p>
		</div>
	)
}
