import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { IChildren } from '@/types'
import { CreateError, IsEmpty } from '@/services/Utils'
import { Header, AnimatedIcon, LinkLabel } from '@/components'
import { useAppSelector } from '@/services/store/hooks'
import { selectAuthentication } from '@/services/store/features'

interface IErrorHandler extends IChildren {
	error?: unknown
}
export function ErrorHandler({ children, error }: IErrorHandler) {
	const [errorMessage, setErrorMessage] = useState('')
	const navigate = useNavigate()
	const { message, success } = useAppSelector(selectAuthentication)

	useEffect(() => {
		if (error instanceof Object && !IsEmpty(Object.keys(error))) {
			return setErrorMessage(CreateError(error).message)
		}
		if (!IsEmpty(error)) {
			return setErrorMessage(error as string)
		}
		if (!success && message) {
			return setErrorMessage(message)
		}
		// error message from redirection url with query params
		const errorFromQueryParam = window.location.search
		if (errorFromQueryParam) {
			// parse error message from query string
			const errorMsg = new URLSearchParams(errorFromQueryParam).get('error')
			if (errorMsg) setErrorMessage(errorMsg)
		}
	}, [error, message, success])

	return (
		<div
			className="form-container"
			role="alert"
		>
			<Header>
				<Header.Logo>
					<AnimatedIcon
						iconName="fa fa-face-sad-cry"
						animation="fa-shake"
						animateOnLoad
					/>
				</Header.Logo>
				<Header.Title
					title="Uh oh!"
					subTitle={errorMessage ? errorMessage : 'Something went wrong.'}
				>
					<LinkLabel
						routeTo=""
						preText="Go"
						onClick={() => navigate(-1)}
					>
						back
					</LinkLabel>
				</Header.Title>
			</Header>
			{children}
		</div>
	)
}
