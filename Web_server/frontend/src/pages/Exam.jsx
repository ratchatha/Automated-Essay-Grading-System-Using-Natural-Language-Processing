import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ExamForm from '../components/ExamForm'

function Exam() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <ExamForm />
            {/* <Footer /> */}
        </div>
    )
}

export default Exam