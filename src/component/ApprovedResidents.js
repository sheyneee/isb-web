import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApprovedResidents = () => {
    const navigate = useNavigate();
    const [residents, setResidents] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [filters, setFilters] = useState({
        sex: 'All',
        civilStatus: 'All',
    });
    const [searchQuery, setSearchQuery] = useState(''); 

    useEffect(() => {
        fetchResidents();
    }, []);

    const fetchResidents = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/residents`);
            const approvedResidents = response.data.residents.filter(resident => resident.accountStatus === 'Approved');
            setResidents(approvedResidents);
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
        const sortOption = e.target.value;
        setSortBy(sortOption);
    
        let sortedResidents = [...residents];
    
        if (sortOption === 'Resident No.') {
            sortedResidents.sort((a, b) => {
                // Extract numerical part of residentID for sorting
                const numA = parseInt(a.residentID.replace(/[^0-9]/g, ''), 10);
                const numB = parseInt(b.residentID.replace(/[^0-9]/g, ''), 10);
                return numA - numB;
            });
        } else if (sortOption === 'Name') {
            sortedResidents.sort((a, b) => {
                const nameA = a.firstName.toLowerCase() + a.lastName.toLowerCase();
                const nameB = b.firstName.toLowerCase() + b.lastName.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        } else if (sortOption === 'Sex') {
            sortedResidents.sort((a, b) => {
                // Sort Male before Female
                if (a.sex === b.sex) return 0;
                return a.sex === 'Male' ? -1 : 1;
            });
        } else if (sortOption === 'Civil Status') {
            const civilStatusOrder = ['Single', 'Married', 'Separated', 'Divorced', 'Widowed', 'Annulled'];
            sortedResidents.sort((a, b) => {
                const statusA = civilStatusOrder.indexOf(a.civilStatus);
                const statusB = civilStatusOrder.indexOf(b.civilStatus);
                return statusA - statusB;
            });
        }
    
        setResidents(sortedResidents);
    };
    

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

      const handlePrint = () => {
        window.print();
    };

        // Handle Search Input
        const handleSearchChange = (e) => {
            setSearchQuery(e.target.value);
        };


    // Filter Residents Based on Search Query and Filters
    const filteredResidents = residents.filter((resident) => {
        const matchesSearch = (
            resident.residentID.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${resident.firstName} ${resident.middleName ? resident.middleName + ' ' : ''}${resident.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resident.sex.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resident.civilStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resident.contactNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resident.permanentAddress.street.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesFilters = (filters.sex === 'All' || resident.sex === filters.sex) &&
            (filters.civilStatus === 'All' || resident.civilStatus === filters.civilStatus);

        return matchesSearch && matchesFilters;
    });
    
    return (
        <div className="bg-white p-6 rounded-lg">
            <div className='flex-col justify-between items-center mb-2'>
            <div className='flex justify-between items-center text-center mb-2'>       
            <h2 className="text-2xl font-semibold text-center">List of Barangay Residents</h2>
            <div className='flex justify-between space-x-2 min-h-10 min-w-12'>
                <button
                    className="bg-[#1346AC] text-white px-8 py-2 rounded-full font-semibold min-h-10 min-w-12"
                    onClick={() => navigate('/AddResident')}
                >
                    Add Resident
                </button>
                <button
                    className="text-[#1346AC] px-8 py-2 rounded-full font-semibold border-[#1346AC] border-2 min-h-10 min-w-12"
                    onClick={handlePrint} 
                >
                    Print List
                </button>
            </div>
            </div> 
            <div className='flex justify-between'>
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
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 0 01-1.414 0l-4-4a1 0 010-1.414z" clipRule="evenodd" />
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
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 0 01-1.414 0l-4-4a1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <button
                        className="text-blue-500 hover:text-[#1A50BE] cursor-pointer font-semibold"
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </button>
                </div>
                <div className="flex flex-col items-end justify-between space-y-2">
                    <input
                        type="text"
                        placeholder="Search residents"
                        className="w-80 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                        value={searchQuery}
                        onChange={handleSearchChange} 
                        onFocus={(e) => e.target.placeholder = ""}
                        onBlur={(e) => e.target.placeholder = "Search residents"}
                    />
                <div className="flex items-center space-x-2">
                    <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by</label>
                    <div className="relative w-full">
                        <select
                            id="sortBy"
                            name="sortBy"
                            className="block py-1 text-base text-[#1346AC] font-semibold appearance-none focus:outline-none focus:ring-0"
                            value={sortBy}
                            onChange={handleSortChange}
                        >
                            <option value="Resident No.">Resident No.</option>
                            <option value="Name">Name</option>
                            <option value="Sex">Sex</option>
                            <option value="Civil Status">Civil Status</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg className="h-5 w-5 text-gray-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 0 01-1.414 0l-4-4a1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </div>

            <div className="overflow-x-auto scrollbar-thin text-center">
                <table className="min-w-full bg-white border border-gray-200" id="printable-area">
                    <thead>
                        <tr>
                            <th className="py-2 border-b border-r border-gray-200">Resident No.</th>
                            <th className="py-2 border-b border-r border-gray-200">Name</th>
                            <th className="py-2 border-b border-r border-gray-200">Sex</th>
                            <th className="py-2 border-b border-r border-gray-200">Civil Status</th>
                            <th className="py-2 border-b border-r border-gray-200">Contact Number</th>
                            <th className="py-2 border-b border-r border-gray-200">Address</th>
                            <th className="py-2 border-b border-gray-200 actions-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResidents.map((resident) => (
                            <tr key={resident.id} className="border-t border-gray-200">
                                <td className="py-2 px-4 border-b border-r border-gray-200 text-center">{resident.residentID}</td>
                                <td className="py-2 px-4 border-b border-r border-gray-200">{`${resident.firstName} ${resident.middleName ? resident.middleName + ' ' : ''}${resident.lastName}`}</td>
                                <td className="py-2 px-4 border-b border-r border-gray-200 text-center">{resident.sex}</td>
                                <td className="py-2 px-4 border-b border-r border-gray-200">{resident.civilStatus}</td>
                                <td className="py-2 px-4 border-b border-r border-gray-200">{resident.contactNumber}</td>
                                <td className="py-2 px-4 border-b border-r border-gray-200">{resident.permanentAddress.street}</td>
                                <td className="py-2 px-4 border-b border-gray-200 space-x-2 text-center font-semibold actions-column">
                                    <button className="text-[#1346AC] hover:text-blue-500">VIEW</button> ||
                                    <button className="text-[#1346AC] hover:text-yellow-500">EDIT</button> ||
                                    <button className="text-[#1346AC] hover:text-red-500">ARCHIVE</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                    Showing 1 to 10 of {filteredResidents.length} entries
                </div>
                <div className="flex space-x-2 font-semibold">
                    <button className="px-2 py-1 bg-gray-200 rounded hover:bg-[#1A50BE]">1</button>
                    <button className="px-2 py-1 bg-gray-200 rounded hover:bg-[#1A50BE]">2</button>
                    <button className="px-2 py-1 bg-gray-200 rounded hover:bg-[#1A50BE]">3</button>
                    <button className="px-2 py-1 bg-gray-200 rounded hover:bg-[#1A50BE]">4</button>
                </div>
            </div>
        </div>
    );
};

export default ApprovedResidents;