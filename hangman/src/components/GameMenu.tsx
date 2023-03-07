import { memo, useEffect, useRef } from 'react'
import styles from '../modules/Menu.module.css'
import { MenuProps } from '../types/HangMan.type'

export const GameMenu = memo(
	({
		isDone,
		category,
		handleStartGame,
		categoryName,
		setCategoryName,
		handleFetchWords,
	}: MenuProps) => {
		const { menu, capitalize, label, newcat } = styles
		const inputRef = useRef<HTMLInputElement>(null)

		const handleClickFetch = () => {
			if (categoryName.trim().length <= 2) inputRef.current?.focus()
			else handleFetchWords()
		}

		useEffect(() => {
			inputRef.current?.focus()
			inputRef.current?.select()
		}, [])

		return (
			<div className={menu}>
				{isDone ? (
					<>
						<p>
							Category: <q className={`${label} ${capitalize}`}>{category.category}</q>
						</p>
						<button onClick={() => handleStartGame()}>Play Next</button>
					</>
				) : (
					<>
						<div className={newcat}>
							<input
								type="text"
								ref={inputRef}
								value={categoryName}
								placeholder="Enter Category here..."
								onKeyUp={e => (e.key === 'Enter' ? handleClickFetch() : null)}
								onChange={e => setCategoryName(e.target.value)}
							/>
							<button onClick={handleClickFetch}>Play Now</button>
						</div>
						<cite>i.e.: World History, Native Irish Words, Pokemon, Translation, etc.</cite>
					</>
				)}
			</div>
		)
	}
)
