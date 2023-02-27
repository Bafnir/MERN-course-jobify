import React from 'react'
import Wrapper from '../assets/wrappers/BigSidebar'
import Logo from '../components/Logo'
import { useAppContext } from '../context/appContext'
import NavLinks from './NavLinks'


const BigSidebar = () => {
  const {showSideBar} = useAppContext()
  return (
    <Wrapper>
      <div className={showSideBar ? 'sidebar-container show-sidebar': 'sidebar-container'}>
        <div className='content'>
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  )
}

export default BigSidebar 