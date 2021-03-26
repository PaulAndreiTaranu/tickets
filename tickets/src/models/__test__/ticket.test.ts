import { Ticket } from '../ticket'

it('implements optimistic concurrency control', async done => {
    // Create an instance of a ticket
    const ticket = Ticket.build({ title: 'validTitle', price: 10, userId: '123123q' })
    // Save the ticket to the db
    await ticket.save()
    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)
    // Make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 10 })
    secondInstance!.set({ price: 15 })
    // Save the first fetched ticket
    await firstInstance!.save()
    // Save the second fetched ticket and expect an error
    try {
        await secondInstance!.save()
        done()
    } catch (err) {
        return done()
    }
    throw new Error('Should not reach this point')
})

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({ title: 'validTitle', price: 10, userId: '123123q' })
    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
})
