import { Request, Response, NextFunction } from "express"
import { IReqExt } from "../../type"
import { CreateError } from "../../utils"

export async function googlePassport(
	req: IReqExt<Request>,
	res: Response,
	next: NextFunction
) {
	try {
		// expected "code" from Github OAuth as callback url
		const code = req.query.code || res.locals.code || ""
		// const verifiedGithubUser = await getGithubUser(code)

		// if (verifiedGithubUser) {
		// 	const githubEmail =
		// 		verifiedGithubUser.email || verifiedGithubUser.login
		// 	const existingUser = await getUserByEmail(githubEmail)

		// 	if (existingUser) {
		// 		/** user is already registered proceed to login */
		// 		userId = existingUser._id.toString()
		// 		email = existingUser.email
		// 		version = existingUser.version || ""
		// 	} else {
		// 		/** register github user and generate user._id */
		// 		const newUser = await createUser({
		// 			email: githubEmail,
		// 			// format of password for OAuth Users (id + email)
		// 			password: `${verifiedGithubUser.id}:${githubEmail}`,
		// 		})

		// 		userId = newUser._id.toString()
		// 		email = newUser.email
		// 		version = newUser.version || ""

		// 		await createVault({ userId })
		// 	}

		// 	// get Vault of User from db
		// 	const vault = await getVaultByUserId(userId)
		// 	if (!vault) {
		// 		return res
		// 			.status(405) // method not allowed
		// 			.json({ message: "We can't find your Vault" })
		// 	}

		// 	// generate pair of tokens using authenticated Github User(_Id, email, version, etc.)
		// 	const { accessToken, refreshToken } = buildTokens({
		// 		userId,
		// 		email,
		// 		version, // required to generate refreshToken
		// 	})
		// 	// store signed tokens into cookies
		// 	createCookies(res, { accessToken, refreshToken })
		// 	// update user as loggedIn (optional)
		// 	await loginUserById(userId)

		// 	return res.redirect(GITHUB_REDIRECT_URL)
		// }

		return next()
	} catch (err) {
		// something went wrong, rollback registration
		// rollbackGithubPassportActions(res, userId)
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Github Passport Error"
		error.status = 400
		// send formatted error to error handler plugin
		next(error)
	}
}
