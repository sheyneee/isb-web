import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
import Header from './Header';

const ViewRequest = () => {
    const [resident, setResident] = useState(null);
    const [householdMembers, setHouseholdMembers] = useState([]);
    const [householdHead, setHouseholdHead] = useState('');
    const [householdHeadContactNumber, setHouseholdHeadContactNumber] = useState('');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [adminData, setAdminData] = useState(null);
    const { residentID } = useParams(); // Get residentID from route parameters
    const navigate = useNavigate();

    useEffect(() => {
        fetchResidentDetails();
    }, []);

    const fetchResidentDetails = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/residents/${residentID}`);
            setResident(response.data); // Set the resident data from the response
            console.log('Resident data:', response.data); // Debugging line
    
            // Check if householdNo exists and is a valid type
            if (response.data.householdNo) {
                const householdID = response.data.householdNo._id || response.data.householdNo; // Use householdNo directly if it's an object, otherwise convert to string
                console.log('Fetching household with householdNo:', householdID); // Debugging line
                fetchHouseholdById(householdID); // Use the correct function name
            } else {
                console.warn('No householdNo found for resident'); // Debugging line
            }
        } catch (error) {
            console.error('Error fetching resident details:', error);
        }
    };

    const fetchHouseholdById = async (householdId) => {
        try {
            console.log('Fetching household info with ID:', householdId); // Debugging line
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/household/id/${householdId}`);
            if (response.data) {
                const { householdHead, members, contactNumber } = response.data;
                setHouseholdHead(`${householdHead.firstName} ${householdHead.middleName ? householdHead.middleName + ' ' : ''}${householdHead.lastName}`);
                setHouseholdHeadContactNumber(contactNumber);
                setHouseholdMembers(members);
            } else {
                alert('Household information not found');
                setHouseholdHead('');
                setHouseholdHeadContactNumber('');
                setHouseholdMembers([]);
            }
        } catch (error) {
            console.error('Error fetching household info:', error.response || error.message); // Enhanced error logging
            alert('Error fetching household information');
        }
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            const firstName = capitalizeWords(user.firstName);
            const lastName = capitalizeWords(user.lastName);
            const middleInitial = user.middleName ? capitalizeWords(user.middleName.charAt(0)) + '.' : '';
            setUserName(`${firstName} ${middleInitial} ${lastName}`);
            setAdminData(user);
            setUserRole(user.roleinHousehold);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleBackClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    if (!resident) return <div>Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Header userName={userName} userRole={userRole} handleLogout={handleLogout} />
            <div className="flex flex-1">
                <Navigation adminData={adminData} getCurrentDate={getCurrentDate} />
                <main className="flex-1 p-8 bg-gray-100">
                    <div className="flex items-center mb-7">
                        <button
                            className="text-xl text-gray-500 hover:text-[#1346AC] cursor-pointer font-semibold mr-10"
                            onClick={handleBackClick}
                        >
                            &lt; Back
                        </button>
                        <h1 className="text-4xl font-bold">View Resident Request</h1>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-6">Household Information</h2>
                        <div className="mb-4">
                            <div><span className="font-medium">Household Head:</span> {householdHead}</div>
                            <div><span className="font-medium">Contact Number:</span> {householdHeadContactNumber}</div>
                        </div>
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="border text-center">
                                    <th className="py-2 border-r">Resident No.</th>
                                    <th className="py-2 border-r">Name</th>
                                    <th className="py-2 border-r">Sex</th>
                                    <th className="py-2 border-r">Age</th>
                                    <th className="py-2 border-r">Role</th>
                                    <th className="py-2 border-r">Contact Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {householdMembers.map((member, index) => (
                                    <tr key={index} className="border text-center">
                                        <td className="py-2 border-r">{member.residentID}</td>
                                        <td className="py-2 border-r">{`${member.firstName} ${member.middleName ? member.middleName + ' ' : ''}${member.lastName}`}</td>
                                        <td className="py-2 border-r">{member.sex}</td>
                                        <td className="py-2 border-r">{member.age}</td>
                                        <td className="py-2 border-r">{member.roleinHousehold}</td>
                                        <td className="py-2 border-r">{member.contactNumber}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h2 className="text-2xl font-semibold mt-6 mb-6">Personal Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="font-medium">Last Name:</span> {resident.lastName}</div>
                            <div><span className="font-medium">First Name:</span> {resident.firstName}</div>
                            <div><span className="font-medium">Middle Name:</span> {resident.middleName}</div>
                            <div><span className="font-medium">Suffix:</span> {resident.suffix}</div>
                            <div><span className="font-medium">Birthdate:</span> {formatDate(resident.birthday)}</div> 
                        </div>

                        <h2 className="text-2xl font-semibold mt-6 mb-6">Address</h2>
                            <div className="p-4 rounded-md ">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-medium">Unit/Floor/Room No.:</span> {resident.permanentAddress.unitFloorRoomNo || '-'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Building:</span> {resident.permanentAddress.building || '-'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Block No.:</span> {resident.permanentAddress.blockNo ? `Block ${resident.permanentAddress.blockNo}` : '-'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Lot No.:</span> {resident.permanentAddress.lotNo ? `Lot ${resident.permanentAddress.lotNo}` : '-'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Phase No.:</span> {resident.permanentAddress.phaseNo || '-'}
                                    </div>
                                    <div>
                                        <span className="font-medium">House No.:</span> {resident.permanentAddress.houseNo || '-'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Street:</span> {resident.permanentAddress.street || '-'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Subdivision:</span> {resident.permanentAddress.subdivision || '-'}
                                    </div>
                                </div>
                            </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Deny</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ViewRequest;
