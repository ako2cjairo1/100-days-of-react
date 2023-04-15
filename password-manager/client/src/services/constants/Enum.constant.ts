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
	view: 'view',
	remove: 'remove',
} as const

export const FormContent = {
	vault_component: 'vault_component',
	keychain_component: 'keychain_component',
} as const
