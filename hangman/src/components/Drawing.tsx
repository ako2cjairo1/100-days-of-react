import styles from '../modules/Drawing.module.css'
import { DrawingProps } from '../types/HangMan.type'
import sadEmoji from '../assets/sad.gif'
import smileyEmoji from '../assets/smiley.gif'
import hangEmoji from '../assets/hang.gif'

export const Drawing = ({ wrongGuessCounter, isDone }: DrawingProps) => {
	const {
		drawing,
		normal,
		hang,
		rope,
		topPole,
		pole,
		basePole,
		head,
		body,
		rightArm,
		leftArm,
		rightLeg,
		leftLeg,
	} = styles

	const isHangMan = wrongGuessCounter >= 6
	const isSaved = isDone && wrongGuessCounter < 6
	const isWrongGuess = wrongGuessCounter < 6 && wrongGuessCounter

	const emoji = isHangMan
		? hangEmoji
		: isSaved
			? smileyEmoji
			: isWrongGuess >= 1
				? sadEmoji
				: smileyEmoji

	const bodyParts = [
		<div
			key="head"
			className={head}
		>
			<img
				src={emoji}
				alt="sad emoji"
				style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
			></img>
		</div>,
		<div
			key="body"
			className={body}
		/>,
		<div
			key="rightArm"
			className={rightArm}
		/>,
		<div
			key="leftArm"
			className={leftArm}
		/>,
		<div
			key="rightLeg"
			className={rightLeg}
		/>,
		<div
			key="leftLeg"
			className={leftLeg}
		/>,
	]

	return (
		<div className={drawing}>
			<div className={isHangMan ? hang : normal}>{bodyParts}</div>

			<div className={rope} />
			<div className={topPole} />
			<div className={pole} />
			<div className={basePole} />
		</div>
	)
}
