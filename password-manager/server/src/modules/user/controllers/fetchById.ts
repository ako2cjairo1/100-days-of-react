import { getUserById } from "../user.service"

export async function fetchUserById(userId: string) {
	return await getUserById(userId)
}
