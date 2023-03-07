import React from 'react'
import { ProgressProps, TWords } from '../types/HangMan.type'

export const Progress = ({ cssModule, progressList }: ProgressProps) => {
	return (
		<div className={cssModule.progress}>
			{progressList.map(item => {
				switch (item.result) {
					case 'Win':
						return <span key={item.id}>⭐️</span>
					case 'Lose':
						return <span key={item.id}>❌</span>
					default:
						return <span key={item.id}>⊙</span>
				}
			})}
		</div>
	)
}
