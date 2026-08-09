import type { RequestSession } from '../session/session.js'

export const isLoggedIn = (session: RequestSession) => session.userId !== undefined

export const destroySession = (session: RequestSession): Promise<void> =>
	new Promise((resolve, reject) => {
		session.destroy((err) => {
			if (err) {
				return reject(err)
			}

			resolve()
		})
	})
