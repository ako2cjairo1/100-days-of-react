import { Request, Response } from "express"

export interface IReqExt<T> extends Request {
	body: T
}

export interface IResExt<T> extends Response {
	user?: T
}
