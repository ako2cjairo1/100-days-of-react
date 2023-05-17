import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateError } from '@/services/Utils'
import { Header, AnimatedIcon, LinkLabel } from '../components'

export function ErrorHandler(error: unknown) {
	const [message, setMessage] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		if (error instanceof Object && Object.keys(error).some(Boolean)) {
			return setMessage(CreateError(error).message)
		}

		// error message from redirection url with query params
		const errorFromQueryParam = window.location.search
		if (errorFromQueryParam) {
			// decode error message
			const errorMsg = new URLSearchParams(errorFromQueryParam).get('error')
			if (errorMsg) setMessage(errorMsg)
		}
	}, [error])

	return (
		<div
			className="form-container"
			role="alert"
		>
			<Header>
				<Header.Logo>
					<AnimatedIcon
						iconName="fa fa-face-rolling-eyes"
						animation="fa-shake"
						animateOnLoad
					/>
				</Header.Logo>
				<Header.Title
					title="Something went wrong"
					subTitle={message}
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
		</div>
	)
}
