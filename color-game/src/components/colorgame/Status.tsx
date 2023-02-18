import { useColorGameContext } from '../../contexts/ColorGameContext';
import { ColorGameStyles as styles } from '../../modules'
import {smiley, loading } from '../../assets/index'
import { Emoji } from './Emoji';

export const Status = () => {
    const { stat, highlight, close } = styles;
	// custom hook for ColorGame
	const { colorGameState, handleEndGame } = useColorGameContext();
	// extract individual states from context using provided custom hook
	const { correctCounter, gameCounter, isWin, start, isReveal } = colorGameState;

  return (
    <div>
        {start && (
            <button className={close} onClick={handleEndGame}>
                end
            </button>
        )}
        {gameCounter <= 0 ? <img src={smiley} /> : <Emoji isWin={isWin} />}
        <p className={stat}>
            {isReveal && <img src={loading} />}
            {isReveal ? (
                <a>
                    Loading game <span className={highlight}>#{gameCounter + 1}</span>
                </a>
            ) : gameCounter > 0 ? (
                <a>
                    You got <span className={highlight}>{correctCounter}</span> correct guess(es)
                    out of <span className={highlight}>{gameCounter}</span>
                </a>
            ) : (
                ''
            )}
        </p>
    </div>
  )
}
