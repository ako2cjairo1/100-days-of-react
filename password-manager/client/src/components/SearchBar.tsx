import { useCallback, useEffect, useRef, useState } from 'react'
import type { IChildren, TFunction } from '@/types'
import { CloseIcon, Input } from '@/components'
import { IsEmpty, LocalStorage } from '@/services/Utils/password-manager.helper'

const STATUS = {
	message: '',
	resultCount: 0,
}
interface ISearchBar extends IChildren {
	searchCallback: TFunction<[searchKey: string], number>
}
/**
 * SearchBar component that allows users to search for keychains.
 * param {React.ReactNode} props.children - The children of the SearchBar component.
 * param {TFunction<[searchKey: string], number>} props.searchCallback - The callback function that is triggered when the search input changes. It takes in a searchKey string and returns the number of results found.
 *
 * returns {JSX.Element} - The SearchBar component.
 */
export function SearchBar({ children, searchCallback }: ISearchBar) {
	const [search, setSearch] = useState('')
	const [{ message, resultCount }, setSearchStatus] = useState(STATUS)
	const cachedSearchKeyRef = useRef(true)

	const executeSearch = useCallback(
		(searchKey: string) => {
			// trigger search callbackfn from subscriber
			const resultCount = searchCallback(searchKey)

			// create message base on the resultCount
			const message = resultCount
				? `${resultCount} keychain found`
				: `No results for "${searchKey}"`

			// update status of search action
			setSearchStatus({ message, resultCount })
		},
		[searchCallback]
	)

	const executeSearchRef = useRef(executeSearch)
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const searchValue = event.target.value
		setSearch(searchValue)
		executeSearchRef.current(searchValue)
	}

	const handleClear = () => {
		setSearch('')
		setSearchStatus(STATUS)
		searchCallback('')
		LocalStorage.write('PM_searchkey', '')
	}

	useEffect(() => {
		if (cachedSearchKeyRef.current) {
			const cachedSearchKey = LocalStorage.read('PM_searchkey')
			setSearch(cachedSearchKey)
			executeSearchRef.current(cachedSearchKey)
			cachedSearchKeyRef.current = false
		}
	}, [])

	return (
		<div className="fdc">
			<Input
				id="search"
				type="text"
				inputMode="url"
				placeholder="Search keychains"
				value={search}
				onChange={handleChange}
				onBlur={() => LocalStorage.write('PM_searchkey', search)}
			/>
			<div
				className="fdc"
				style={{ gap: '0' }}
			>
				<label className="small center">{!IsEmpty(search) && message}</label>
				{!IsEmpty(search) && resultCount <= 0 && (
					<label className="x-small center disabled">Check the spelling or try a new search.</label>
				)}
			</div>
			{!IsEmpty(search) && <CloseIcon onClick={handleClear} />}
			{children}
		</div>
	)
}
