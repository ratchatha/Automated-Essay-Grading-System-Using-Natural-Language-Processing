import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';

function Login() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <LoginForm />
            <Footer />
        </div>
    );
}

export default Login;
