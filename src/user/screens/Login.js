import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ loginType }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    // Reset the loginError when loginType changes
    useEffect(() => {
        setLoginError('');
        setEmail('');
        setPassword('');
        setEmailError('');
        setPasswordError('');
    }, [loginType]);

    // Determine API URL and redirect path based on login type
    const apiUrl = loginType === 'Resident'
        ? `${process.env.REACT_APP_BACKEND_API_KEY}/api/login/resident`
        : `${process.env.REACT_APP_BACKEND_API_KEY}/api/admin/login`;

    const redirectPath = loginType === 'Resident' ? '/Resident/Home' : '/home';
    const validRoles = loginType === 'Resident'
        ? ['Resident']
        : ['Barangay Captain', 'Secretary', 'Kagawad'];

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
            const res = await axios.post(apiUrl, { email, password });
    
            if (res.status === 200 && res.data.user) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
    
                // Verify if the user's role matches the valid roles
                if (validRoles.includes(res.data.user.roleinBarangay)) {
                    navigate(redirectPath, { state: { adminData: res.data.user } });
                } else {
                    setLoginError('You do not have permission to access this page.');
                }
            } else {
                setLoginError('Login failed, please try again.');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setLoginError(err.response.data.message);
            } else {
                setLoginError('Failed to sign in. Please check your network and try again.');
            }
        }
    };

    return (
        <div className="flex flex-col justify-between min-h-[400px] w-full p-6"> 
            <div className="flex flex-col justify-between items-center w-full max-w-lg"> 
                <div className="flex text-start justify-start w-full">
                    <h2 className="text-3xl font-bold mb-4 text-start">{loginType} Login</h2>
                </div> 
                <form className="space-y-4 w-full" onSubmit={handleSignIn}>
                    <div className="w-full"> 
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
                    <div className="w-full"> 
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
                        className="w-full py-3 px-4 text-lg font-medium text-white bg-[#1346AC] rounded-lg shadow-sm hover:bg-[#1A50BE] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A50BE]"
                    >
                        Login
                    </button>
                    {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
                </form>
                
                <div className="text-center mt-2"> 
                    <Link to={loginType === 'Resident' ? "/Resident/ForgotPassword" : "/Admin/ForgotPassword"} className="text-sm text-[#1346AC] font-medium">
                        Forgot Password?
                    </Link>
                </div>
            </div>

            {/* Conditional rendering for Register link (only for Resident) */}
            {loginType === 'Resident' && (
                <div className="text-center mt-2">
                    <span className="text-sm text-gray-700">Don't have an account?</span>
                    <Link to="/Resident/Register" className="text-sm text-[#1346AC] font-medium ml-2">Register here</Link>
                </div>
            )}
        </div>
    );
};

export default Login;
