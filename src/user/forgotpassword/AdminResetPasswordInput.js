import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import background from '../../assets/images/isb-bg.png'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AdminResetPasswordInput = () => {
    const [newPassword, setNewPassword] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); 
    const location = useLocation(); 
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

       // Get the email passed from EnterSecurityCode component via location state
       const email = location.state?.email || localStorage.getItem('resetEmail'); // Fallback to localStorage

       // List of common weak passwords
       const weakPasswords = ['123456', 'password', '123456789', '12345678', 'qwerty', 'abc123', '111111'];
   
       // If email is missing, fetch from localStorage if not available in location.state
       useEffect(() => {
           if (!email) {
               setError('Email is missing. Please try again.');
           } else {
               localStorage.setItem('resetEmail', email); // Store email in case of page refresh
           }
       }, [email]);
   
       const handleSubmit = async (e) => {
           e.preventDefault();
       
           // Validation: Check if password is blank
           if (!newPassword) {
               setError('You cannot use a blank password.');
               return;
           }
       
           // Validation: Check if password is less than 6 characters
           if (newPassword.length < 6) {
               setError('Password must be at least 6 characters long.');
               return;
           }
       
           // Validation: Check if password is weak (matches one of the weak passwords)
           if (weakPasswords.includes(newPassword.toLowerCase())) {
               setError('Please choose a more secure password.');
               return;
           }
       
           setLoading(true);
           setError(''); // Clear any previous error
       
           try {
               const resetToken = localStorage.getItem('resetPasswordToken'); // Use the token from localStorage
       
               if (!resetToken || !email) {
                   setError('Invalid or missing password reset token or email.');
                   setLoading(false);
                   return;
               }
       
               // Send the new password to the server to reset
               await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/admin/reset-password`, {
                   email, // Ensure email is available
                   resetCode: resetToken, // Use the token from localStorage
                   newPassword
               });
       
               Swal.fire({
                   title: 'Success!',
                   text: 'Your password has been successfully reset.',
                   icon: 'success',
                   confirmButtonText: 'OK',
               });
       
               // Clear the reset token and email from localStorage after successful password reset
               localStorage.removeItem('resetPasswordToken');
               localStorage.removeItem('resetEmail');
       
               navigate('/'); // Navigate back to the login page or home page
           } catch (error) {
               const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
               setError(errorMessage);
           } finally {
               setLoading(false);
           }
       };
  return (
    <div
    className="min-h-screen w-full flex items-center justify-center px-4 md:px-32 bg-cover"
    style={{ backgroundImage: `url(${background})` }}
>
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-start p-4 px-4">Choose a new password</h2>
            <hr/>

            <div className='flex flex-col justify-center p-4 px-4'>
            {error && (
                <div className={`bg-red-100 border text-red-700 px-4 py-3 rounded relative mb-4`} role="alert">
                    <strong className="font-bold">Error</strong>
                    <br/>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <p className="text-lg text-start mb-4">
                Create a new password that is at least 6 characters long.<br/>
                A strong password is a combination of letters, numbers, <br/>and punctuation marks.
            </p>
            <label className="block text-lg font-medium text-gray-700 mb-2">Password</label>
            <div className="flex mb-4 space-x-2 relative">                      
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
                />
                 <FontAwesomeIcon
                    icon={showPassword ? faEye : faEyeSlash}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                />
            </div>
            </div>
            <hr />
            <div className='flex items-end justify-evenly font-semibold mt-4 p-4'>
                <button
                    type="submit"
                    className={`w-full py-2 mr-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Reset Password'}
                </button>
                <button
                    type="button"
                    className="w-full py-2 rounded-md text-black bg-gray-300 hover:bg-gray-400"
                    onClick={() => navigate('/')}
                    disabled={loading}
                >
                    Cancel
                </button>
            </div>
        </div>
    </form>
</div>
);
};

export default AdminResetPasswordInput;
