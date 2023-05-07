import '@/assets/modules/AuthProviderSection.css'
import google from '@/assets/google.png'
import apple from '@/assets/apple.png'
import github from '@/assets/github.png'
import type { TFunction } from '@/types'
import { githubPassportService } from '@/api'

/**
 * Renders a section with buttons for external authentication providers.
 */
interface IAuthProviderSection {
	callbackFn?: TFunction
}
const { VITE_PUBLIC_GITHUB_AUTH_URL, VITE_PUBLIC_GITHUB_CLIENT_ID } = import.meta.env
export function AuthProviderSection({ callbackFn = () => null }: IAuthProviderSection) {
	const handleExternalAuth = async () => {
		console.log('TODO: Implement Passport for Apple, Google and Github')
		callbackFn()
	}
	const githubSignIn = () => {
		githubPassportService(
			`${VITE_PUBLIC_GITHUB_AUTH_URL}?client_id=${VITE_PUBLIC_GITHUB_CLIENT_ID}`
		)
		callbackFn()
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
			<button onClick={githubSignIn}>
				<img
					src={github}
					alt="github"
				/>{' '}
				Github
			</button>
		</div>
	)
}
