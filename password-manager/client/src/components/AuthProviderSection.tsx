import '@/assets/modules/AuthProviderSection.css'
import google from '@/assets/google.png'
import apple from '@/assets/apple.png'
import github from '@/assets/github.png'
import { FCProps } from '@/types'
/**
 * Renders a section with buttons for external authentication providers.
 */
export const AuthProviderSection: FCProps<{ cb?: () => void }> = ({ cb }) => {
	const handleExternalAuth = () => {
		alert('TODO: Implement external authentication.')
		cb && cb()
	}
	return (
		<div
			data-testid="social"
			className="social"
		>
			<button onClick={handleExternalAuth}>
				<img
					src={apple}
					alt="apple"
				/>{' '}
				Apple
			</button>
			<button onClick={handleExternalAuth}>
				<img
					src={google}
					alt="google"
				/>{' '}
				Google
			</button>
			<button onClick={handleExternalAuth}>
				<img
					src={github}
					alt="github"
				/>{' '}
				Github
			</button>
		</div>
	)
}
