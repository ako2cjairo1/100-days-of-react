import type { IUserModel } from "./user.type"

export type TToken = {
	accessToken?: string
	refreshToken?: string
}

export type TTokenPayload = Pick<IUserModel, "userId" | "email" | "version">
export type TVerifiedToken = Omit<IUserModel, "password">
