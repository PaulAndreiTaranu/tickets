import Link from 'next/link'

const header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
        currentUser && { label: 'My Orders', href: '/orders' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' },
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href }, i) => {
            return (
                <li key={i} className='nav-item'>
                    <Link href={href}>
                        <a href='' className='nav-link'>
                            {label}
                        </a>
                    </Link>
                </li>
            )
        })
    return (
        <nav className='navbar navbar-light bg-light'>
            <Link href='/'>
                <a href='' className='navbar-brand'>
                    Tickets
                </a>
            </Link>
            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>{links}</ul>
            </div>
        </nav>
    )
}

export default header
