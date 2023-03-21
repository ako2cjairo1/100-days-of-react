/**
 * Use this utility to create a new object type by mapping the keys of an existing object type to a specified value type.
 *
 * @template T - The type of the object to map.
 * @template VType - The value type to use for all properties in the resulting object.
 */
export type TConvertKeysOf<T, VType extends any> = {
	[TKey in keyof T]: VType
}

/**
 * Use this utility to create the keys of a constant object to a union of string literals.
 *
 * @template T - The type of the constant object. i.e.: typeof MyObject
 */
export type TConvertToStringUnion<T> = keyof T
