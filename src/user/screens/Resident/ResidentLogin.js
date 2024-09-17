import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const ResidentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');
        setLoginError('');

        if (!email) {
            setEmailError('Please input your Email');
            isValid = false;
        }
        if (!password) {
            setPasswordError('Please enter your Password');
            isValid = false;
        }

        return isValid;
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/login/resident`, { email, password });
            console.log('Login Response:', res.data);
    
            if (res.status === 200 && res.data.user) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
    
                // Add a debug log to verify roleinBarangay
                console.log('Logged in as:', res.data.user.roleinBarangay);
    
                // Ensure roleinBarangay is either 'Head of the Family' or 'Family Member'
                const residentRoles = ['Resident'];
                if (residentRoles.includes(res.data.user.roleinBarangay)) {
                    navigate('/Resident/Home', { state: { adminData: res.data.user } });
                } else {
                    setLoginError('You do not have permission to access this page.');
                }
            } else {
                setLoginError('Login failed, please try again.');
            }
        } catch (err) {
            console.error('Error during login request:', err.response || err);
            if (err.response && err.response.data && err.response.data.message) {
                setLoginError(err.response.data.message);
            } else {
                setLoginError('Failed to sign in. Please check your network and try again.');
            }
        }
    };    
    
    return (
        <div className="flex justify-center items-center bg-white font-sans"> 
            <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-8">
                <div className="text-left">
                    <h2 className="text-3xl font-bold mb-6">Resident Login</h2>
                </div>
                <form className="space-y-4" onSubmit={handleSignIn}>
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Email Address:</label>
                        <input
                            type="text"
                            className={`mt-1 block w-full px-4 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Password:</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`mt-1 block w-full px-4 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            />
                        </div>
                        {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 text-sm font-medium text-white bg-[#1346AC] rounded-md shadow-sm hover:bg-[#1A50BE] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A50BE]"
                    >
                        Login
                    </button>
                    {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
                </form>
                <div className="mt-2 text-center">
                    <Link to="/Resident/Register" className="text-sm text-[#1346AC] font-medium ml-2">Forgot Password?</Link>
                </div>
                <div className="mt-2 text-center">
                    <span className="text-sm text-gray-700">Don't have an account?</span>
                    <Link to="/Resident/Register" className="text-sm text-[#1346AC] font-medium ml-2">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default ResidentLogin;
