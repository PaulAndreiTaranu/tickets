import axios from 'axios'
import { useState } from 'react'

export const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null)

    const doRequest = async (props = {}) => {
        try {
            setErrors(null)
            const response = await axios({ method: method, url: url, data: { ...body, ...props } })
            if (onSuccess) onSuccess(response.data)
            return response.data
        } catch (err) {
            setErrors(
                <div className='alert alert-danger' role='alert'>
                    <h4>Invalid form:</h4>
                    <ul className='my-0'>
                        {err.response.data.errors.map((err, i) => (
                            <li key={i}>{err.message}</li>
                        ))}
                    </ul>
                </div>,
            )
        }
    }

    return { doRequest, errors }
}
