import Router from "next/router"
import { useState } from "react"
import { useRequest } from "../../hooks/use-request"

const signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { doRequest, errors } = useRequest({
        url: "/api/users/signup",
        method: "POST",
        body: { email, password },
        onSuccess: () => Router.push("/"),
    })

    const onSubmit = async event => {
        event.preventDefault()
        doRequest()
    }

    return (
        <div className="container mt-5">
            <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        aria-describedby="emailHelp"
                    />
                    <div id="emailHelp" className="form-text">
                        We'll never share your email with anyone else.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {errors}
                <button type="submit" className="btn btn-primary">
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default signup
