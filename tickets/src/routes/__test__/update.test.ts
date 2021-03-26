import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('returns a 404 if the provided id does not exist', async () => {
    const [title, price] = ['validTitle', 20]
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app).put(`/api/tickets/${id}`).set('Cookie', global.signin()).send({ title, price }).expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
    const [title, price] = ['validTitle', 20]
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app).put(`/api/tickets/${id}`).send({ title, price }).expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
    const [title, price] = ['validTitle', 20]
    const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title, price })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({ title: 'updatedTitle', price })
        .expect(401)
})

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin()
    const [title, price] = ['validTitle', 20]
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title, price })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: '', price })
        .expect(400)
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title, price: -10 })
        .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin()
    const [title, price] = ['validTitle', 20]
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title, price })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'newTitle', price: 100 })
        .expect(200)
    const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send()
    expect(ticketResponse.body.title).toEqual('newTitle')
    expect(ticketResponse.body.price).toEqual(100)
})

it('publishes an event', async () => {
    const cookie = global.signin()
    const [title, price] = ['validTitle', 20]
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title, price })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'newTitle', price: 100 })
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects updates if the ticket is reserved', async () => {
    const cookie = global.signin()
    const [title, price] = ['validTitle', 20]
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title, price })
    const ticket = await Ticket.findById(response.body.id)
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
    await ticket!.save()
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'newTitle', price: 100 })
        .expect(400)
})
