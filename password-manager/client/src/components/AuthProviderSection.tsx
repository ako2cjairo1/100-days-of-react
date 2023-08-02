import '@/assets/modules/AuthProviderSection.css'
import google from '@/assets/google.png'
import github from '@/assets/github.png'
import meta from '@/assets/facebook.png'
import type { TFunction } from '@/types'
import type { TProvider } from '@shared'

/**
 * Renders a section with buttons for external authentication providers.
 */
interface IAuthProviderSection {
	callbackFn: TFunction<[provider: TProvider], void>
}
export function AuthProviderSection({ callbackFn }: IAuthProviderSection) {
	return (
		<div
			data-testid="social"
			className="social"
		>
			<button onClick={() => callbackFn('facebook')}>
				<img
					src={meta}
					alt="Meta"
				/>{' '}
				Meta
			</button>
			<button onClick={() => callbackFn('google')}>
				<img
					src={google}
					alt="Google"
				/>{' '}
				Google
			</button>
			<button onClick={() => callbackFn('github')}>
				<img
					src={github}
					alt="Github"
				/>{' '}
				Github
			</button>
		</div>
	)
}
