import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Header';
import Navigation from '../../component/Navigation';

const BarangayProfiling = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [adminData, setAdminData] = useState(null);

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
                        <h1 className="text-4xl font-bold">Barangay Profiling</h1>
                    </div>
                    <div className="flex justify-evenly items-center space-x-10">
                            <div className="bg-white flex flex-col p-6 rounded-lg shadow-md w-1/3">
                                <h2 className="text-2xl font-bold mb-4">Filter List</h2>
                                <div className="mb-4">
                                    <label className="block mb-1">Profiling Year</label>
                                    <select className="border border-gray-300 rounded-md p-2 w-full">
                                        <option>Select Profiling Year</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Sex</label>
                                    <select className="border border-gray-300 rounded-md p-2 w-full">
                                        <option>Select Sex</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Age Range</label>
                                    <div className="flex">
                                        <input type="number" className="border border-gray-300 rounded-md p-2 w-1/2 mr-2" placeholder="From" />
                                        <input type="number" className="border border-gray-300 rounded-md p-2 w-1/2" placeholder="To" />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Civil Status</label>
                                    <select className="border border-gray-300 rounded-md p-2 w-full">
                                        <option>Select Civil Status</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Nationality</label>
                                    <select className="border border-gray-300 rounded-md p-2 w-full">
                                        <option>Select Nationality</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Religion</label>
                                    <select className="border border-gray-300 rounded-md p-2 w-full">
                                        <option>Select Religion</option>
                                    </select>
                                </div>
                                <div className="mb-4 flex flex-col text-lg">
                                    <div className='flex justify-between items-center px-4'>
                                        <div className="mr-2 mb-2">
                                            <input type="checkbox" id="voter" className="mr-1" />
                                            <label htmlFor="voter">Voter</label>
                                        </div>
                                        <div className="mr-2 mb-2">
                                            <input type="checkbox" id="indigent" className="mr-1" />
                                            <label htmlFor="indigent">Indigent</label>
                                        </div>
                                        <div className="mr-2 mb-2">
                                            <input type="checkbox" id="4ps" className="mr-1" />
                                            <label htmlFor="4ps">4Ps</label>
                                        </div>
                                        </div>
                                        <div className='flex items-center w-full px-4 justify-evenly'>
                                        <div className="mr-2 mb-2">
                                            <input type="checkbox" id="soloParent" className="mr-1" />
                                            <label htmlFor="soloParent">Solo Parent</label>
                                        </div>
                                        <div className="mr-2 mb-2">
                                            <input type="checkbox" id="pwd" className="mr-1" />
                                            <label htmlFor="pwd">PWD</label>
                                        </div>
                                        </div>
                                </div>
                                <div className="flex flex-col w-full px-6 space-y-2">
                                    <button className="bg-[#1346AC] text-white px-4 py-2 rounded-full font-semibold">View List</button>
                                    <button className="bg-[#1346AC] text-white px-4 py-2 rounded-full font-semibold">Export List as PDF</button>
                                </div>
                            </div>
                        <div className="bg-white flex flex-col p-6 rounded-lg shadow-md w-2/3">
                        <h2 className="text-2xl font-bold mb-4">Charts</h2>
                        <select
                            name="status"
                            className="border border-gray-400 rounded-md p-2 w-full"
                        >
                            <option value="Select Chart" className='text-gray-200'>Select Chart</option>
                            <option value="Pie">Age Distribution Chart</option>
                            <option value="Active">Active</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Settled">Settled</option>
                        </select>
                        <h3 className='text-center font font-semibold p-4 text-lg'> Age Distribution Chart </h3>
                        
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BarangayProfiling;
