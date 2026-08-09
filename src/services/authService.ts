import { config } from '../config.js'
import { prisma } from '../database/prisma.js'
import type { RequestSession } from '../session/session.js'

type HandleAuthorisationCodeArgs = { session: RequestSession; code: string }
type UserIdentity = { picture?: string; verified_email?: boolean; id?: string; email?: string }

const exchangeCodeForToken = async (code: string): Promise<string | null> => {
	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			code,
			client_id: config.oauth.gcp.clientId,
			client_secret: config.oauth.gcp.clientSecret,
			redirect_uri: config.oauth.redirectUri,
			grant_type: 'authorization_code',
		}),
	})

	const json: { access_token?: string } = await response.json()

	return json.access_token ?? null
}

const getUserIdentity = async (bearerToken: string): Promise<UserIdentity> => {
	const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Bearer ${bearerToken}`,
		},
	})

	const json: UserIdentity = await response.json()

	return {
		picture: json.picture,
		verified_email: json.verified_email,
		id: json.id,
		email: json.email,
	}
}

export const authService = {
	getGoogleOauthLoginUri: () => {
		const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')

		url.searchParams.set('redirect_uri', config.oauth.redirectUri)
		url.searchParams.set('prompt', 'consent')
		url.searchParams.set('response_type', 'code')
		url.searchParams.set('client_id', config.oauth.gcp.clientId)
		url.searchParams.set('scope', 'openid https://www.googleapis.com/auth/userinfo.email')
		url.searchParams.set('access_type', 'offline')

		return url.toString()
	},
	handleAuthorisationCode: async ({ session, code }: HandleAuthorisationCodeArgs): Promise<void> => {
		const accessToken = await exchangeCodeForToken(code)
		if (!accessToken) {
			console.info('Could not get access token from authorisation code')
			return
		}

		const userIdentity = await getUserIdentity(accessToken)
		if (!userIdentity.email) {
			console.info('User identity information did not contain email')
			return
		}

		const user = await prisma.user.findUnique({ where: { email: userIdentity.email } })
		if (user === null) {
			console.info(`Could not find user with email: ${userIdentity.email} in db`)
			return
		}

		session.userId = user.id
		console.info(`Saved user id ${user.id} to session`)
	},
}
