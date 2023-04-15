import '@/assets/modules/RotatingBackdrop.css'
/**
 * RotatingBackdrop component
 * Renders a rotating backdrop with two shapes
 */
export function RotatingBackdrop() {
	return (
		<div className="background">
			<div
				data-testid="shape"
				className="shape lg"
			></div>
			<div
				data-testid="shape"
				className="shape lg"
			></div>
		</div>
	)
}
