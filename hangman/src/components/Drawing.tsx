import styles from '../modules/Drawing.module.css'
import { DrawingProps } from '../types/HangMan.type'
import sadEmoji from '../assets/sad.gif'
import smileyEmoji from '../assets/smiley.gif'
import hangEmoji from '../assets/hang.gif'

export const Drawing = ({ wrongGuessCounter: wrongGuessCount, isDone }: DrawingProps) => {
	const {
		drawing,
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

	const isHangMan = wrongGuessCount >= 6
	const isSaved = isDone && wrongGuessCount < 6
	const isWrongGuess = wrongGuessCount < 6 && wrongGuessCount

	const emoji =
		isHangMan
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
			style={isHangMan ? { rotate: "60deg", right: "-95px" } : {}}
		/>,
		<div
			key="leftArm"
			className={leftArm}
			style={isHangMan ? { rotate: "20deg", right: "4px" } : {}}
		/>,
		<div
			key="rightLeg"
			className={rightLeg}
		/>,
		<div
			key="leftLeg"
			className={leftLeg}
			style={isHangMan ? { rotate: "-70deg" } : {}}
		/>,
	]

	return (
		<div className={drawing}>
			{/* <div style={positionToHang}>{bodyParts.slice(0, wrongGuessCount)}</div> */}
			<div style={isHangMan ? {} : { position: 'relative', top: '90px', left: '100px' }}>{bodyParts}</div>

			<div className={rope} />
			<div className={topPole} />
			<div className={pole} />
			<div className={basePole} />
		</div>
	)
}
