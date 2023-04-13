import '@/assets/modules/AuthProviderSection.css'
import google from '@/assets/google.png'
import apple from '@/assets/apple.png'
import github from '@/assets/github.png'
import { TFunction } from '@/types'
import { Log } from '@/services/Utils/password-manager.helper'
/**
 * Renders a section with buttons for external authentication providers.
 */
interface IAuthProviderSection {
	cb?: TFunction
}
export function AuthProviderSection({ cb = () => null }: IAuthProviderSection) {
	const handleExternalAuth = () => {
		cb()
		Log('TODO: Implement external authentication.')
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
