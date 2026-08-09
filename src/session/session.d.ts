import type { Session, SessionData } from 'express-session'

declare module 'express-session' {
	interface SessionData {
		userId?: number
	}
}

export type RequestSession = Session & Partial<SessionData>
