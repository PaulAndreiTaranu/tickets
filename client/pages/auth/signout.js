import { useEffect } from "react"
import Router from "next/router"
import { useRequest } from "../../hooks/use-request"

const signout = () => {
    const { doRequest } = useRequest({
        url: "/api/users/signout",
        method: "POST",
        body: {},
        onSuccess: () => Router.push("/"),
    })

    useEffect(() => {
        doRequest()
    }, [])

    return (
        <div>
            <h1 className="bg-dark">Signing you out!</h1>
        </div>
    )
}

export default signout
