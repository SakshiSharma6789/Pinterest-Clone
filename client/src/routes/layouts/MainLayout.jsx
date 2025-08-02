import React from 'react'
import LeftBar from '../../components/leftBar/leftBar'
import TopBar from '../../components/topBar/topBar'
import { Outlet } from 'react-router'

function MainLayout() {
  return (
    <div className='app'>
      <LeftBar/>
      <div className='content'>
        <TopBar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout
