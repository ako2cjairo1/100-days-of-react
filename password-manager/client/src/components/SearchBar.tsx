import { useState } from 'react'
import { Input } from '@/components/FormGroup/Input'
import { CloseIcon } from '@/components/Modal/CloseIcon'
import { IChildren, TFunction } from '@/types'

const STATUS = {
	message: '',
	resultCount: 0,
}
interface ISearchBar extends IChildren {
	searchCallback: TFunction<[searchKey: string], number>
}
export function SearchBar({ children, searchCallback }: ISearchBar) {
	const [search, setSearch] = useState('')
	const [{ message, resultCount }, setSearchStatus] = useState(STATUS)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchValue = event.target.value
		setSearch(searchValue)

		// trigger search callbackfn from subscriber
		const resultCount = searchCallback(searchValue)
		const message = resultCount
			? `${resultCount} keychain found`
			: `No results for "${event.target.value}"`
		setSearchStatus({ message, resultCount })
	}

	const handleClear = () => {
		setSearch('')
		setSearchStatus(STATUS)
		searchCallback('')
	}

	return (
		<div className="fdc">
			<Input
				id="search"
				type="text"
				inputMode="url"
				placeholder="Search keychains"
				value={search}
				onChange={handleChange}
			/>
			<div
				className="fdc"
				style={{ gap: '0' }}
			>
				<label className="small center">{search.length > 0 && message}</label>
				{search.length > 0 && resultCount <= 0 && (
					<label className="x-small center disabled">Check the spelling or try a new search.</label>
				)}
			</div>
			{search.length > 0 && <CloseIcon onClick={handleClear} />}
			{children}
		</div>
	)
}
