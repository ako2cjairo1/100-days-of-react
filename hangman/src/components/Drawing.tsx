import styles from '../modules/Drawing.module.css'
import { DrawingProps } from '../types/HangMan.type'
import sad from '../assets/sad.gif'
import cry from '../assets/cry.gif'
import smiley from '../assets/smiley.gif'

export const Drawing = ({ wrongGuessCount, isHang }: DrawingProps) => {
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

  const emoji =
    wrongGuessCount >= 6
      ? cry
      : isHang && wrongGuessCount < 6
        ? smiley
        : wrongGuessCount <= 6 && wrongGuessCount >= 1
          ? sad
          : smiley

  const positionToHang: React.CSSProperties | undefined =
    wrongGuessCount >= 6 ? {} : { position: 'relative', top: '90px', left: '100px' }

  const bodyParts = [
    <div
      key="head"
      className={head}
      style={{ borderRadius: '100%' }}
    >
      <img
        src={emoji}
        alt="sad emoji"
        style={{ width: '100px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
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
      {/* <div style={positionToHang}>{bodyParts.slice(0, wrongGuessCount)}</div> */}
      <div style={positionToHang}>{bodyParts}</div>

      <div className={rope} />
      <div className={topPole} />
      <div className={pole} />
      <div className={basePole} />
    </div>
  )
}
