import { useEffect, useRef } from 'react'
import styles from '../modules/Menu.module.css'
import { MenuProps } from '../types/HangMan.type'

export const Menu = ({
    isDone,
    category,
    initGame,
    catName,
    setCatName,
    fetchInitialGame,
}: MenuProps) => {
    const { menu, capitalize, label, newcat } = styles
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFetchClick = () => {
        if (catName.trim().length <= 2) inputRef.current?.focus()
        else fetchInitialGame()
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
                        Category: <q className={capitalize}>{category.category}</q>
                    </p>
                    <button onClick={() => initGame()}>Play Again</button>
                </>
            ) : (
                <>
                    <div className={newcat}>
                        {/* <p className={label}>Category:</p> */}
                        <input
                            type="text"
                            ref={inputRef}
                            value={catName}
                            placeholder='Enter Category here...'
                            onChange={e => setCatName(e.target.value)}
                        />
                        <button onClick={handleFetchClick}>Play this Category</button>
                    </div>
                    <cite>i.e.: World History, Native Irish Words, Pokemon, Translation, etc.</cite>
                </>
            )}
        </div>
    )
}
