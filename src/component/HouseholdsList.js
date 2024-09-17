import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HouseholdsList = () => {
    const navigate = useNavigate();
    const [households, setHouseholds] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [filters, setFilters] = useState({
        sex: 'All',
        civilStatus: 'All',
    });
    const [searchQuery, setSearchQuery] = useState(''); 

    useEffect(() => {
        fetchHouseholds();
    }, []);

    const fetchHouseholds = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/all/households`);
            setHouseholds(response.data.households);
        } catch (error) {
            console.error('Error fetching households:', error);
        }
    };

    const formatAddress = (permanentAddress) => {
        let address = [
            permanentAddress.houseNo,
            permanentAddress.lotNo ? `Lot ${permanentAddress.lotNo}` : '',
            permanentAddress.subdivision,
            permanentAddress.street
        ].filter(Boolean).join(', ');
    
        const additionalFields = [
            permanentAddress.unitFloorRoomNo,
            permanentAddress.building,
            permanentAddress.blockNo ? `Block ${permanentAddress.blockNo}` : '',
            permanentAddress.phaseNo ? `Phase ${permanentAddress.phaseNo}` : ''
        ].filter(Boolean).join(', ');
    
        const fullAddress = additionalFields ? `${address}, ${additionalFields}` : address;
        return fullAddress.length > 50 ? `${fullAddress.slice(0, 50)}...` : fullAddress;
    };

    const resetFilters = () => {
        setFilters({
            sex: 'All',
            civilStatus: 'All',
        });
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        let sortedHouseholds = [...households];
        if (e.target.value === 'Household No.') {
            sortedHouseholds.sort((a, b) => a.householdID.localeCompare(b.householdID));
        } else if (e.target.value === 'Household Head Name') {
            sortedHouseholds.sort((a, b) => a.householdHead.lastName.localeCompare(b.householdHead.lastName));
        }
        setHouseholds(sortedHouseholds);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter Households Based on Search Query and Filters
    const filteredHouseholds = households.filter((household) => {
        const matchesSearch = (
            household.householdID.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${household.householdHead.firstName} ${household.householdHead.middleName ? household.householdHead.middleName + ' ' : ''}${household.householdHead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return matchesSearch;
    });

      const handlePrint = () => {
        window.print();
    };

    
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">List of Households</h2>
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
                        className="mt-7 text-blue-500 hover:text-[#1A50BE] cursor-pointer font-semibold"
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </button>
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <div className='flex'>
                        <button
                            className="bg-[#1346AC] text-white px-8 py-2 rounded-full font-semibold"
                            onClick={() => navigate('/AddResident')}
                        >
                            Add Resident
                        </button>
                        <button
                            className="text-[#1346AC] px-8 py-2 rounded-full font-semibold border-[#1346AC] border-2 ml-2"
                            onClick={handlePrint} // Call the handlePrint function
                        >
                            Print List
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search households"
                        className="w-80 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                        value={searchQuery}
                        onChange={handleSearchChange} 
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
                                <option value="Contact Number">Contact Number</option>
                                <option value="Address">Address</option>
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
            
            <div className="overflow-x-auto scrollbar-thin text-center">
                <table className="min-w-full bg-white border border-gray-200" id="printable-area">
                    <thead>
                        <tr>
                            <th className="py-2 border-b border-r border-gray-200">Household No.</th>
                            <th className="py-2 border-b border-r border-gray-200">Household Head Name</th>
                            <th className="py-2 border-b border-r border-gray-200">Sex</th>
                            <th className="py-2 border-b border-r border-gray-200">Civil Status</th>
                            <th className="py-2 border-b border-r border-gray-200">Contact Number</th>
                            <th className="py-2 border-b border-r border-gray-200">Address</th>
                            <th className="py-2 border-b border-gray-200 actions-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredHouseholds.map((household) => (
                        <tr key={household.householdID} className="border-t border-gray-200">
                            <td className="py-2 px-4 border-b border-r border-gray-200 text-center">{household.householdID}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-200">
                                {`${household.householdHead.firstName} ${household.householdHead.middleName ? household.householdHead.middleName + ' ' : ''}${household.householdHead.lastName}`}
                            </td>
                            <td className="py-2 px-4 border-b border-r border-gray-200 text-center">{household.householdHead.sex}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-200">{household.householdHead.civilStatus}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-200">{household.householdHead.contactNumber}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-200">
                                {household.householdHead.permanentAddress 
                                    ? formatAddress(household.householdHead.permanentAddress) 
                                    : 'Address not available'}
                            </td>
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
                    Showing 1 to 10 of {filteredHouseholds.length} entries
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

export default HouseholdsList;