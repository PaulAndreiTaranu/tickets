import jwt from 'jsonwebtoken'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[]
        }
    }
}

let mongo: any

jest.mock('../nats-wrapper')
// TODO: SET UP AND ENV VARIABLE FOR STRIPE_KEY

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfa'
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    mongo = new MongoMemoryServer()
    const monogUri = await mongo.getUri()

    await mongoose.connect(monogUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
})

beforeEach(async () => {
    jest.clearAllMocks()

    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) await collection.deleteMany({})
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin = (id?: string) => {
    // Build a JWT payload. {id, email}
    const payload = { id: id || new mongoose.Types.ObjectId().toHexString(), email: 'test@test.com' }
    // Create a JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!)
    // Build session object. {jwt: MY_JWT}
    const session = { jwt: token }
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session)
    // Take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64')
    // Return a cookie with the econded data
    return [`express:sess=${base64}`]
}
