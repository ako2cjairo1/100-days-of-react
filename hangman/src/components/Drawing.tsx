import styles from '../modules/HangMan.module.css'
import { DrawingProps } from '../types/HangMan.type'

export const Drawing = ({ wrongGuessCount }: DrawingProps) => {
  const { drawing, rope, topPole, pole, basePole, head, body, rightArm, leftArm, rightLeg, leftLeg } = styles
  const bodyParts = [
    <div key="head" className={head} style={{ borderRadius: "100%" }} />,
    <div key="body" className={body} />,
    <div key="rarm" className={rightArm} />,
    <div key="larm" className={leftArm} />,
    <div key="rleg" className={rightLeg} />,
    <div key="lleg" className={leftLeg} />
  ]
  return (
    <div className={drawing}>
      {bodyParts.slice(0, wrongGuessCount)}
      <div className={rope} />
      <div className={topPole} />
      <div className={pole} />
      <div className={basePole} />
    </div>
  )
}