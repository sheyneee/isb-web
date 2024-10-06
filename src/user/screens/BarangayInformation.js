import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for fetching data
import Header from '../../component/Header';
import Navigation from '../../component/Navigation';

const BarangayInformation = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [adminData, setAdminData] = useState(null);
    const [barangay, setBarangay] = useState(null); // State to hold barangay data

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            const firstName = capitalizeWords(user.firstName);
            const lastName = capitalizeWords(user.lastName);
            const middleInitial = user.middleName ? capitalizeWords(user.middleName.charAt(0)) + '.' : '';
            setUserName(`${firstName} ${middleInitial} ${lastName}`);
            setAdminData(user);
            setUserRole(user.roleinBarangay);
        }
    }, []);

    useEffect(() => {
        const fetchBarangay = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/barangay`); // Fetch the only barangay
                setBarangay(response.data.barangay); // Assuming the response contains the barangay data
            } catch (error) {
                console.error("Error fetching barangay data:", error);
            }
        };

        fetchBarangay(); // Fetch barangay data when the component mounts
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const getCurrentDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header userName={userName} userRole={userRole} handleLogout={handleLogout} />
            <div className="flex flex-1">
                <Navigation adminData={adminData} getCurrentDate={getCurrentDate} />
                <main className="flex-1 p-6 bg-gray-100">
                    <div className="flex items-center mb-7">
                        <h1 className="text-4xl font-bold">Barangay Information</h1>
                    </div>
                    <div className="flex justify-center items-center space-x-4">
                        {/* Barangay Information Card */}
                        <div className="bg-white flex flex-col p-6 rounded-lg shadow-md w-1/4 space-y-5">
                            <div className='flex w-full items-center justify-center'>
                                {barangay && <img src={barangay.logo} alt="Barangay Logo" className="w-64 h-64 object-cover mb-4" />}
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">Barangay</h2>
                                <p>Barangay {barangay?.barangayName || 'Loading...'}</p>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">Municipality</h2>
                                <p>{barangay?.municipality || 'Loading...'}</p>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">Province</h2>
                                <p>{barangay?.province || 'Loading...'}</p>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">Email</h2>
                                <p>{barangay?.email || 'Loading...'}</p>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">Phone</h2>
                                <p>{barangay?.contactnumber || 'Loading...'}</p>
                            </div>
                        </div>


                        <div className="bg-white flex flex-col p-6 rounded-lg shadow-md w-3/4">
                            <h2>More Information </h2>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BarangayInformation;
