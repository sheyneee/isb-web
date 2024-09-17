import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
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

    const handleSignIn = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        console.log('Submitting login form...');
        
        axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/admin/login`, { email, password })
            .then(res => {
                console.log('Login response received:', res.data);
    
                // Explicitly log the user object to verify its structure
                console.log('User object:', res.data.user);
    
                if (!res.data.user || !res.data.user.roleinBarangay) {
                    setLoginError('Login failed, please try again.');
                    console.log('User or user role is missing in the response:', res.data);
                    return;
                }
    
                // Set token and user role in local storage
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
    
                // Check for valid admin roles
                const validAdminRoles = ['Barangay Captain', 'Secretary', 'Kagawad'];
                const isAdmin = validAdminRoles.includes(res.data.user.roleinBarangay);
    
                if (isAdmin) {
                    // Navigate to home page upon successful login
                    navigate('/home', { state: { adminData: res.data.user } });
                } else {
                    // If role does not match, set login error
                    setLoginError('You do not have permission to access this page.');
                }
            })
            .catch(err => {
                console.error('Error during login request:', err.response || err);
                if (err.response) {
                    setLoginError(err.response.data.message);
                } else {
                    setLoginError('Failed to sign in. Please check your network and try again.');
                }
            });
    };

    return (
        <div className="flex justify-center items-center bg-white font-sans"> 
            <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-8">
                <div className="text-left">
                    <h2 className="text-2xl font-bold mb-6"> Barangay Official Login</h2>
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
                    <Link to="/" className="text-sm text-[#1346AC] font-medium ml-2">Forgot Password?</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
