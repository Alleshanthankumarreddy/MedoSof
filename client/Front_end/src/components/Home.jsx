import React from 'react'
import Footer from './Footer';
import Roles from './Roles';
import Services from './Services';
import RoleWorkflows from './RoleWorkflows';

function Home() {
  return (
    <>
        <Services/>
        <RoleWorkflows/>
        <Roles/>
        <Footer/>
    </>
  )
}

export default Home
