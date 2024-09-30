import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Header';
import Navigation from '../../component/Navigation';
import ApprovedResidents from '../../component/ApprovedResidents';
import AccountsForVerification from '../../component/AccountsForVerification';
import HouseholdsList from '../../component/HouseholdsList';

const ResidentManagement = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [adminData, setAdminData] = useState(null);
    const [activeTab, setActiveTab] = useState('Residents'); 
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            if (user.profilepic) {
                user.profilepic = user.profilepic.replace(/\\/g, '/');
            }
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
            <Header userName={userName} userRole={userRole} handleLogout={handleLogout} profilePic={adminData?.profilepic}/>
            <div className="flex flex-1">
                <Navigation adminData={adminData} getCurrentDate={getCurrentDate} />
                <main className="flex-1 p-6 bg-gray-100">
                    <h1 className="text-4xl font-bold mb-10 text-gray-700">Resident and Household Management</h1>
                    <div className="join">
                        <button
                            className={`btn join-item ${activeTab === 'Residents' ? 'bg-[#1346AC] text-white' : 'bg-white text-gray-700 hover:bg-[#1346AC] hover:text-white'} text-md font-bold`}
                            onClick={() => setActiveTab('Residents')}
                        >
                            Residents
                        </button>
                        <button
                            className={`btn join-item ${activeTab === 'Households' ? 'bg-[#1346AC] text-white' : 'bg-white text-gray-700 hover:bg-[#1346AC] hover:text-white'} text-md font-bold`}
                            onClick={() => setActiveTab('Households')}
                        >
                            Households
                        </button>
                        <button
                            className={`btn join-item ${activeTab === 'Accounts for Verification' ? 'bg-[#1346AC] text-white' : 'bg-white text-gray-700 hover:bg-[#1346AC] hover:text-white'} text-md font-bold`}
                            onClick={() => setActiveTab('Accounts for Verification')}
                        >
                            Accounts for Verification
                        </button>
                        <button
                            className={`btn join-item ${activeTab === 'Profile Update Requests' ? 'bg-[#1346AC] text-white' : 'bg-white text-gray-700 hover:bg-[#1346AC] hover:text-white'} text-md font-bold`}
                            onClick={() => setActiveTab('Profile Update Requests')}
                        >
                            Profile Update Requests
                        </button>
                    </div>
                    <div className="bg-white rounded-lg shadow">
                        {activeTab === 'Residents' && <ApprovedResidents />}
                        {activeTab === 'Accounts for Verification' && <AccountsForVerification />}
                        {activeTab === 'Households' && <HouseholdsList/>}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ResidentManagement;
