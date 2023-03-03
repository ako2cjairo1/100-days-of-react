import requestConfig from '../request_config.json'

export const API_KEY = import.meta.env.VITE_API_KEY
export const URL = import.meta.env.VITE_API_URL

export const fetchOptions = ({
	itemCount,
	category,
}: {
	itemCount?: number
	category?: string
} = {}) => ({
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${API_KEY}`,
	},
	body: JSON.stringify({
		...requestConfig,
		prompt: requestConfig.prompt
			.replace('<item count here>', itemCount ? itemCount.toString() : '10')
			.replace('<category here>', category ? category : 'random words'),
	}),
})
