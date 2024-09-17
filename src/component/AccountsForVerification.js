import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AccountsForVerification = () => {
    const [residents, setResidents] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [filters, setFilters] = useState({
        sex: 'All',
        civilStatus: 'All',
    });
    const [currentPage, setCurrentPage] = useState(1);  // Pagination state
    const itemsPerPage = 10;  // Number of residents to show per page
    const [showDenyModal, setShowDenyModal] = useState(false); // State to control modal visibility
    const [selectedResidentId, setSelectedResidentId] = useState(null); // State to hold the ID of the resident being denied
    const [remarks, setRemarks] = useState(''); // State to hold the input remarks

    const navigate = useNavigate();

    useEffect(() => {
        fetchResidents();
    }, []);

    const fetchResidents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/residents`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const pendingResidents = response.data.residents.filter(resident => resident.accountStatus === 'Pending');
            setResidents(pendingResidents);
        } catch (error) {
            console.error('Error fetching residents:', error);
        }
    };

    const resetFilters = () => {
        setFilters({
            sex: 'All',
            civilStatus: 'All',
        });
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        let sortedResidents = [...residents];
        if (e.target.value === 'Resident No.') {
            sortedResidents.sort((a, b) => a.residentID - b.residentID);
        } else if (e.target.value === 'Name') {
            sortedResidents.sort((a, b) => a.lastName.localeCompare(b.lastName));
        } else if (e.target.value === 'Sex') {
            sortedResidents.sort((a, b) => a.sex.localeCompare(b.sex));
        } else if (e.target.value === 'Civil Status') {
            sortedResidents.sort((a, b) => a.civilStatus.localeCompare(b.civilStatus));
        } else if (e.target.value === 'Contact Number') {
            sortedResidents.sort((a, b) => a.contactNumber.localeCompare(b.contactNumber));
        } else if (e.target.value === 'Address') {
            sortedResidents.sort((a, b) => formatAddress(a.permanentAddress).localeCompare(formatAddress(b.permanentAddress)));
        }
        setResidents(sortedResidents);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    

    const approveResident = async (residentID) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_API_KEY}/api/residents/approve/${residentID}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchResidents(); // Refresh the list after approval
        } catch (error) {
            console.error('Error approving resident:', error.response ? error.response.data : error.message);
        }
    };
    
    const denyResident = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_API_KEY}/api/residents/deny/${selectedResidentId}`, {
                remarks
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setShowDenyModal(false); // Close modal on success
            fetchResidents(); // Refresh the list after denial
        } catch (error) {
            console.error('Error denying resident:', error.response ? error.response.data : error.message);
        }
      };      

    const openDenyModal = (residentID) => {
        setSelectedResidentId(residentID);
        setShowDenyModal(true);
    };

    const filteredResidents = residents.filter((resident) => {
        return (filters.sex === 'All' || resident.sex === filters.sex) &&
            (filters.civilStatus === 'All' || resident.civilStatus === filters.civilStatus);
    });

    // Pagination calculations
    const indexOfLastResident = currentPage * itemsPerPage;
    const indexOfFirstResident = indexOfLastResident - itemsPerPage;
    const currentResidents = filteredResidents.slice(indexOfFirstResident, indexOfLastResident);
    const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);

    const formatAddress = (permanentAddress) => {
        // Extract and concatenate the primary address components
        let address = [
            permanentAddress.houseNo,
            permanentAddress.lotNo ? `Lot ${permanentAddress.lotNo}` : '',
            permanentAddress.subdivision,
            permanentAddress.street
        ].filter(Boolean).join(', ');
    
        // Append additional components if they exist
        const additionalFields = [
            permanentAddress.unitFloorRoomNo,
            permanentAddress.building,
            permanentAddress.blockNo ? `Block ${permanentAddress.blockNo}` : '',
            permanentAddress.phaseNo ? `Phase ${permanentAddress.phaseNo}` : ''
        ].filter(Boolean).join(', ');
    
        // Combine primary and additional fields, then truncate if too long
        const fullAddress = additionalFields ? `${address}, ${additionalFields}` : address;
        return fullAddress.length > 50 ? `${fullAddress.slice(0, 50)}...` : fullAddress;
    };
    
    
    const deleteResident = async (residentID) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_API_KEY}/api/residents/${residentID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchResidents(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting resident:', error.response ? error.response.data : error.message);
        }
    };    

    const handlePrint = () => {
        window.print();
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">List of Accounts for Verification</h2>
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    <div className="w-48">
                        <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex</label>
                        <div className="relative">
                            <select
                                id="sex"
                                name="sex"
                                value={filters.sex}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md appearance-none focus:ring-0 focus:border-gray-300"
                            >
                                <option>All</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 10l5 5 5-5H7z" />
                            </svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-48">
                        <label htmlFor="civilStatus" className="block text-sm font-medium text-gray-700">Civil Status</label>
                        <div className="relative">
                            <select
                                id="civilStatus"
                                name="civilStatus"
                                value={filters.civilStatus}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md appearance-none focus:ring-0 focus:border-gray-300"
                            >
                                <option>All</option>
                                <option>Single</option>
                                <option>Married</option>
                                <option>Separated</option>
                                <option>Widowed</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <button
                        className="mt-7 text-[#1346AC] hover:text-blue-500 cursor-pointer font-semibold"
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </button>
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <button
                        className="text-[#1346AC] px-8 py-2 rounded-full font-semibold border-[#1346AC] border-2 ml-2"
                        onClick={handlePrint} // Call the handlePrint function
                    >
                        Print List
                    </button>
                    <input
                        type="text"
                        placeholder="Search residents"
                        className="w-80 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                        onFocus={(e) => e.target.placeholder = ""}
                        onBlur={(e) => e.target.placeholder = "Search residents"}
                    />
                    <div className="flex items-center space-x-2">
                        <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by</label>
                        <div className="relative w-full">
                            <select
                                id="sortBy"
                                name="sortBy"
                                className="block py-1 text-base hover:text-blue-500 text-[#1346AC] font-semibold appearance-none focus:outline-none focus:ring-0"
                                value={sortBy}
                                onChange={handleSortChange}
                            >
                                <option value="Resident No.">Resident No.</option>
                                <option value="Name">Name</option>
                                <option value="Sex">Sex</option>
                                <option value="Civil Status">Civil Status</option>
                                <option value="Contact Number">Contact Number</option>
                                <option value="Address">Address</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <svg className="h-5 w-5 text-gray-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
            <table className="min-w-full bg-white border border-gray-200" id="printable-area">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-r border-gray-300 rounded-tl-lg">Resident No.</th>
                        <th className="py-2 px-4 border-b border-r border-gray-300">Name</th>
                        <th className="py-2 px-4 border-b border-r border-gray-300">Sex</th>
                        <th className="py-2 px-4 border-b border-r border-gray-300">Civil Status</th>
                        <th className="py-2 px-4 border-b border-r border-gray-300">Contact Number</th>
                        <th className="py-2 px-4 border-b border-r border-gray-300">Address</th>
                        <th className="py-2 px-4 border-b border-r border-gray-300 status-column">Status</th>
                        <th className="py-2 px-4 border-b border-gray-300 rounded-tr-lg actions-column">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {currentResidents.map((resident, index) => (
                        <tr key={resident._id} className={`border-t border-gray-200 text-center ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                            <td className="py-2 px-4 border-l border-b border-r border-gray-300 cursor-pointer text-blue-500 hover:underline font-normal hover:font-semibold" onClick={() => navigate(`/view-request/${resident._id}`)}>{resident.residentID}</td>
                            <td className="py-2 px-2 w-52 border-b border-r border-gray-300 cursor-pointer text-blue-500 hover:underline font-normal hover:font-semibold" onClick={() => navigate(`/view-request/${resident._id}`)}>
                                {`${resident.firstName} ${resident.middleName ? resident.middleName + ' ' : ''}${resident.lastName}`}
                            </td>
                            <td className="py-2 px-4 border-l border-b border-r border-gray-300 cursor-pointer text-blue-500 hover:underline font-normal hover:font-semibold" onClick={() => navigate(`/view-request/${resident._id}`)}>{resident.sex}</td>
                            <td className="py-2 px-4 border-l border-b border-r border-gray-300 cursor-pointer text-blue-500 hover:underline font-normal hover:font-semibold" onClick={() => navigate(`/view-request/${resident._id}`)}>{resident.civilStatus}</td>
                            <td className="py-2 px-4 border-l border-b border-r border-gray-300 cursor-pointer text-blue-500 hover:underline font-normal hover:font-semibold" onClick={() => navigate(`/view-request/${resident._id}`)}>{resident.contactNumber}</td>
                            <td className="py-2 px-2 w-56 border-l border-b border-r border-gray-300 cursor-pointer text-blue-500 hover:underline font-normal hover:font-semibold" onClick={() => navigate(`/view-request/${resident._id}`)}>{formatAddress(resident.permanentAddress)}</td>
                            <td className="py-2 px-4 border-l border-b border-r border-gray-300 status-column">
                                <span className={`px-2 py-1 rounded-full font-semibold ${resident.accountStatus === 'Pending' ? 'bg-yellow-200' : resident.accountStatus === 'Approved' ? 'bg-green-200' : 'bg-red-200'}`}>
                                    {resident.accountStatus}
                                </span>
                            </td>
                            <td className="px-2 w-72 border-b border-r border-gray-300 text-center font-semibold actions-column">
                                <div className="flex justify-center space-x-4 items-center">
                                    <div className="border-r border-gray-300 pr-4">
                                        <button className="text-[#1346AC] hover:text-blue-500" onClick={() => approveResident(resident._id)}>APPROVE</button>
                                    </div>
                                    <div className="border-r border-gray-300 pr-4">
                                        <button className="text-[#1346AC] hover:text-yellow-500" onClick={() => openDenyModal(resident._id)}>DENY</button>
                                    </div>
                                    <div className="pl-4 pr-2">
                                        <button className="text-[#1346AC] hover:text-red-500" onClick={() => deleteResident(resident._id)}>ARCHIVE</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                    Showing {indexOfFirstResident + 1} to {Math.min(indexOfLastResident, filteredResidents.length)} of {filteredResidents.length} entries
                </div>
                <div className="flex space-x-2 font-semibold">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`px-2 py-1 rounded ${currentPage === index + 1 ? 'bg-[#1346AC] text-white' : 'bg-gray-200 hover:bg-[#1346AC]'}`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Deny Modal */}
            {showDenyModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded shadow-lg items-center w-2/12 max-w-lg">
                        <h2 className="text-lg font-semibold mb-4">Remarks Resident</h2>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full border border-gray-300 p-6 rounded mb-4"
                            placeholder="Enter remarks for denying this resident"
                        />
                    <div className="flex justify-center space-x-4">
                        <button
                            className="bg-[#d5d8dd] hover:bg-[#d9dbe0] px-4 py-2 rounded"
                            onClick={() => setShowDenyModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-[#1346AC] hover:bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={denyResident}
                        >
                            Submit
                        </button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountsForVerification;
