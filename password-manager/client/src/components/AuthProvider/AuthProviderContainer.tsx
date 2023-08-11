import '@/assets/modules/AuthProviderSection.css'
import type { IChildren } from '@/types'
import { Provider } from './Provider'

/**
 * Renders a section with buttons for external authentication providers.
 */
export function AuthProviderContainer({ children }: IChildren) {
	return (
		<div
			data-testid="social"
			className="social"
		>
			{children}
		</div>
	)
}

AuthProviderContainer.Provider = Provider
