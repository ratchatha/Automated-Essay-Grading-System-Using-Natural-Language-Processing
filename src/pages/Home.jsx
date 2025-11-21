import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Home() {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <Header />
        <Footer />
    </div>
  )
}


export default Home
