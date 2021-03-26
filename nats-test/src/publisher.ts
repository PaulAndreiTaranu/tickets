import nats from "node-nats-streaming"
import { TicketCreatedPubliser } from "./events/ticket-created-publisher"
console.clear()

const stan = nats.connect("tickets", "abc", { url: "http://localhost:4222" })

stan.on("connect", async () => {
    console.log("Publisher connect to NATS")

    const publisher = new TicketCreatedPubliser(stan)
    try {
        await publisher.publish({ id: "123123123", title: "Tcieafds", price: 20 })
    } catch (err) {
        console.log(err)
    }

    // const data = JSON.stringify({ id: "afsdf2312", title: "concert", price: 20 })

    // stan.publish("ticket:created", data, () => {
    //     console.log("Event published")
    // })
})
