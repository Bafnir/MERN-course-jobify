import { Logo } from '../components'
import main from '../assets/images/main.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import { Link } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import React from 'react'

const Landing = () => {
    const { user } = useAppContext();
  return (
    <React.Fragment>
     {user && <Navigate to="/" />}
    <Wrapper >
        <nav>
            <Logo />
        </nav>
        <div className='container page'>
            <div className='info'>
                <h1>
                    job <span>tracking</span> app
                    <p>
                    Id posse atqui oportere sit. Pri et patrioque reformidans, vim ex zril nemore patrioque.
                     Nemore vocent et has.
                     Mel no vide platonem. Nulla solet pertinax nec at.
                    </p>
                    <Link to='/register' className='btn btn-hero'>Login/Register</Link>
                </h1>
            </div>
            <img src={main} alt="job hunt" className='img main-img'></img>
        </div>
    </Wrapper>
    </React.Fragment>
  )
}

export default Landing
