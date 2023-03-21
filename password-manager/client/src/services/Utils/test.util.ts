/* eslint-disable import/export */
import { cleanup, render } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@testing-library/jest-dom'
import matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
	cleanup()
})

const customRender = (ui: React.ReactElement, options = {}) =>
	render(ui, {
		// wrap provider(s) here if needed
		wrapper: ({ children }) => children,
		...options,
	})

// override render export
export { customRender as render }
export { default as userEvent } from '@testing-library/user-event'
export * from '@testing-library/react'
export * from 'vitest'
