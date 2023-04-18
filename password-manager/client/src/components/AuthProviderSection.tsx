import '@/assets/modules/AuthProviderSection.css'
import google from '@/assets/google.png'
import apple from '@/assets/apple.png'
import github from '@/assets/github.png'
import type { TFunction } from '@/types'
import { Log } from '@/services/Utils/password-manager.helper'
/**
 * Renders a section with buttons for external authentication providers.
 */
interface IAuthProviderSection {
	callbackFn?: TFunction
}
export function AuthProviderSection({ callbackFn = () => null }: IAuthProviderSection) {
	const handleExternalAuth = () => {
		callbackFn()
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
