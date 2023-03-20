import { PasswordStrength, evaluatePassword } from '@/components'
import { PasswordStatus, registerInitState } from '@/services/constants'
import { MergeRegExObj } from '@/services/Utils/password-manager.helper'
import { render } from '@/services/Utils/test.util'
import { IPasswordStrength } from '@/types'

const { weak, mediocre, secure, strong, unbreakable } = PasswordStatus
const evaluateObject: IPasswordStrength = {
	password: '1234567',
	regex: MergeRegExObj(registerInitState.PASSWORD_REGEX),
}

describe('evaluatePassword', () => {
	it('returns "weak" status and score of 1 for password with length less than 8', () => {
		const { score, status } = evaluatePassword({ password: 'short' })
		expect(status).toBe(weak)
		expect(score).toBe(1)
	})

	it('returns "mediocre" status and score of 2 for password that does not match regex', () => {
		const { score, status } = evaluatePassword({ password: 'longbutbad' })
		expect(status).toBe(mediocre)
		expect(score).toBe(2)
	})

	it('returns "secure" status and score of 3 for password with length between 12 and 16', () => {
		const { score, status } = evaluatePassword({ password: 'GoodPass123!' })
		expect(status).toBe(secure)
		expect(score).toBe(3)
	})

	it('returns "strong" status and score of 4 for password with length between 17 and 24', () => {
		const { score, status } = evaluatePassword({ password: 'VeryStrongPass123!!!' })
		expect(status).toBe(strong)
		expect(score).toBe(4)
	})

	it('returns "unbreakable" status and score of 5 for password with length greater than or equal to 25', () => {
		const { score, status } = evaluatePassword({ password: 'UnbreakablePass123!!!1234' })
		expect(status).toBe(unbreakable)
		expect(score).toBe(5)
	})
})

describe('PasswordStrength', () => {
	it('should render password strength status', () => {
		const { getByText } = render(<PasswordStrength password="Abcdefgh1234!" />)
		expect(getByText(secure)).toBeInTheDocument()
	})

	it('should not render password strength status when password is empty', () => {
		const { queryByText } = render(<PasswordStrength password="" />)
		expect(queryByText(secure)).not.toBeInTheDocument()
	})

	it('should render exactly five bullets', () => {
		const { container } = render(<PasswordStrength password="Abcdefgh1234!" />)
		expect(container.querySelectorAll('#bullet').length).toBe(5)
	})

	it('should evaluate password strength using default regex when no regex prop is provided', () => {
		const { getByText } = render(<PasswordStrength password="Abcdefgh1234!" />)
		expect(getByText(secure)).toBeInTheDocument()
	})

	it('should evaluate password strength using provided regex prop when present', () => {
		const { getByText } = render(<PasswordStrength {...{ evaluateObject, password: 'abcdefgh' }} />)

		expect(getByText(mediocre)).toBeInTheDocument()
	})
})
