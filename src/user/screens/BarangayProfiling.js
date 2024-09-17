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
                <main className="flex-1 p-8 bg-gray-100">
                    <div className="flex items-center mb-7">
                        <h1 className="text-4xl font-bold">Barangay Profiling</h1>
                    </div>
                    <div className="flex">
                        <div className="flex-1">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold mb-4">Accounts to be verified</h2>
                                <div className="mb-4">
                                    <select className="border border-gray-300 rounded-md p-2">
                                        <option>Status</option>
                                        <option>All</option>
                                        <option>To be verified</option>
                                        <option>Processing</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="border text-center px-4 py-2">#</th>
                                            <th className="border text-center px-4 py-2">Name</th>
                                            <th className="border text-center px-4 py-2">Status</th>
                                            <th className="border text-center px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border text-center px-4 py-2">1</td>
                                            <td className="border text-center px-4 py-2">Euclid Lozada Quemada</td>
                                            <td className="border text-center px-4 py-2">
                                                <span className="bg-yellow-500 text-white py-1 px-3 rounded-full">To be verified</span>
                                            </td>
                                            <td className="border text-center px-4 py-2">
                                                <button className="text-blue-500">VIEW</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border text-center px-4 py-2">2</td>
                                            <td className="border text-center px-4 py-2">Katrina Mazo Juan</td>
                                            <td className="border text-center px-4 py-2">
                                                <span className="bg-blue-500 text-white py-1 px-3 rounded-full">Processing</span>
                                            </td>
                                            <td className="border text-center px-4 py-2">
                                                <button className="text-blue-500">VIEW</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border text-center px-4 py-2">3</td>
                                            <td className="border text-center px-4 py-2">Sheyne Duque Dela Cruz</td>
                                            <td className="border text-center px-4 py-2">
                                                <span className="bg-red-500 text-white py-1 px-3 rounded-full">Rejected</span>
                                            </td>
                                            <td className="border text-center px-4 py-2">
                                                <button className="text-blue-500">VIEW</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border text-center px-4 py-2">4</td>
                                            <td className="border text-center px-4 py-2">Gineden Yunice Pineda Gumban</td>
                                            <td className="border text-center px-4 py-2">
                                                <span className="bg-yellow-500 text-white py-1 px-3 rounded-full">To be verified</span>
                                            </td>
                                            <td className="border text-center px-4 py-2">
                                                <button className="text-blue-500">VIEW</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="mt-4">
                                    <select className="border border-gray-300 rounded-md p-2">
                                        <option>10 entries per page</option>
                                        <option>20 entries per page</option>
                                        <option>30 entries per page</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/3 pl-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold mb-4">Filter List</h2>
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
                                <div className="mb-4">
                                    <label className="block mb-1">Additional Filters</label>
                                    <div className="flex flex-wrap">
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
                                <div className="flex justify-between">
                                    <button className="bg-[#4D9669] text-white px-4 py-2 rounded-full font-semibold">View List</button>
                                    <button className="bg-[#4D9669] text-white px-4 py-2 rounded-full font-semibold">Export List as PDF</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BarangayProfiling;
