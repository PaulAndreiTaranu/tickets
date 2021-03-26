import { useState } from 'react'
import Router from 'next/router'
import { useRequest } from '../../hooks/use-request'

const NewTicket = () => {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price,
        },
        onSuccess: () => Router.push('/'),
    })

    const onBlur = () => {
        const value = parseFloat(price)
        if (isNaN(value)) return
        setPrice(value.toFixed(2))
    }

    const onSubmit = event => {
        event.preventDefault()
        doRequest()
    }

    return (
        <div className='mt-5'>
            <h1>Create new Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className='mb-3'>
                    <label htmlFor='title' className='form-label'>
                        Title
                    </label>
                    <input
                        type='text'
                        value={title}
                        onChange={e => {
                            setTitle(e.target.value)
                        }}
                        className='form-control'
                        id='title'
                        aria-describedby='title'
                    />

                    <label htmlFor='price' className='form-label'>
                        Price
                    </label>
                    <input
                        type='text'
                        value={price}
                        onBlur={onBlur}
                        onChange={e => {
                            setPrice(e.target.value)
                        }}
                        className='form-control'
                        id='price'
                        aria-describedby='price'
                    />
                </div>
                {errors}
                <button type='submit' className='btn btn-primary'>
                    Submit
                </button>
            </form>
        </div>
    )
}

export default NewTicket
