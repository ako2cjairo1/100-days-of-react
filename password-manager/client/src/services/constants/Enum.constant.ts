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
	vault_content: 'vault_content',
	keychain_content: 'keychain_content',
} as const
