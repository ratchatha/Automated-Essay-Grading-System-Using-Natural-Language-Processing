import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GuideDetails from '../components/GuideDetails'

function Guide() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 flex items-start justify-center px-4 py-15">
                <GuideDetails />
            </main>
            <Footer />

        </div>
    )
}

export default Guide