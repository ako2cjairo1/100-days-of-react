export const PasswordStatus = {
	weak: 'weak',
	mediocre: 'mediocre',
	secure: 'secure',
	strong: 'strong',
	unbreakable: 'unbreakable',
	none: 'strength',
} as const

export const RequestType = {
	add: 'add',
	modify: 'modify',
	remove: 'remove',
} as const

export const VaultContent = {
	vault: 'vault',
	keychain: 'keychain',
} as const
