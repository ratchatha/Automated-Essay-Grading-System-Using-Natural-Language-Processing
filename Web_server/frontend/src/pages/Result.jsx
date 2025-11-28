import React from 'react'
import Navbar from '../components/Navbar'
import ResultDetails from '../components/ResultDetails'
import Footer from '../components/Footer'

function Result() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <ResultDetails />
            {/* <Footer /> */}
        </div>
    )
}

export default Result
