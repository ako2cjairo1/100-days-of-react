/**
 * Extends a ReactNode type with an optional `children` property.
 *
 * @template TNode - The type of the ReactNode to extend. Must extend `ReactNode`.
 */
export interface IChildren<TNode = React.ReactNode> {
	children?: TNode
}

/**
 * Extends the `FC` type with a `children` property of type `IChildren`.
 */
export type FCChildProp = React.FC<IChildren>

/**
 * Extends the `FC` type with generic properties.
 */
export type FCProps<IProps> = React.FC<IProps>
