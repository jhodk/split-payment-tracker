import { RedisStore } from 'connect-redis'
import { RedisClient } from 'redis'

const client = RedisClient.create({
	url: 'redis://127.0.0.1:6379',
})

const redisStore = new RedisStore({
	client,
	prefix: 'split-payment-tracker:',
})

export const getRedisStore = async (): Promise<RedisStore> => {
	await client.connect()

	return redisStore
}
