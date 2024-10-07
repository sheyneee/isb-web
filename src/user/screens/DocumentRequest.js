import React, { useEffect, useState } from 'react';
import Navigation from '../../component/Navigation';
import Header from '../../component/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ViewDocumentRequestModal from '../../component/ViewDocumentRequestModal';

const DocumentRequest = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [adminData, setAdminData] = useState(null);
    const [documentRequests, setDocumentRequests] = useState([]); 
    const [filters, setFilters] = useState({
        date: 'All',
        documentType: 'All'
    });
    const [filteredResidents, setFilteredResidents] = useState([]);
    const [sortBy, setSortBy] = useState('Date'); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [itemsPerPage] = useState(10); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedDocument, setSelectedDocument] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');


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
        // Fetch the document requests from the API
        fetchDocumentRequests();
    }, []);

    const fetchDocumentRequests = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/all/document-requests`); 
            setDocumentRequests(response.data.requests);
            setFilteredResidents(response.data.requests);
        } catch (error) {
            console.error("Error fetching document requests", error);
        }
    };

    const handleFilterChange = (e) => {
      const { name, value } = e.target;
  
      if (name === 'date') {
          setFilters(prevFilters => ({
              ...prevFilters,
              date: value, // Set the selected date filter as it is (All, Latest, Oldest)
          }));
      } else {
          setFilters(prevFilters => ({
              ...prevFilters,
              [name]: value, // Handle other filters
          }));
      }
  };
  

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const resetFilters = () => {
        setFilters({
            date: 'All',
            documentType: 'All'
        });
    };

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

    useEffect(() => {
        let filtered = [...documentRequests]; // Copy the documentRequests array
    
        // Filter by document type
        if (filters.documentType !== 'All') {
            filtered = filtered.filter(req => req.documentType === filters.documentType);
        }
    
        // Apply date filter
        if (filters.date === 'Latest') {
            filtered = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by newest first
        } else if (filters.date === 'Oldest') {
            filtered = filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // Sort by oldest first
        }
    
        // Apply sorting based on the selected sortBy option
        if (sortBy === 'Reference No.') {
            filtered = filtered.sort((a, b) => (a.ReferenceNo || '').localeCompare(b.ReferenceNo || ''));
        } else if (sortBy === 'Requestor Name') {
            filtered = filtered.sort((a, b) => 
                (`${a.requestedBy.firstName} ${a.requestedBy.middleName ? a.requestedBy.middleName + ' ' : ''}${a.requestedBy.lastName}`)
                .localeCompare(
                    `${b.requestedBy.firstName} ${b.requestedBy.middleName ? b.requestedBy.middleName + ' ' : ''}${b.requestedBy.lastName}`
                )
            );
        } else if (sortBy === 'Document Type') {
            filtered = filtered.sort((a, b) => (a.documentType || '').localeCompare(b.documentType || ''));
        }
    
        // Filter by requestor name based on search term
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(req => {
                const fullName = `${req.requestedBy.firstName} ${req.requestedBy.middleName ? req.requestedBy.middleName + ' ' : ''}${req.requestedBy.lastName}`.toLowerCase();
                return fullName.includes(searchTerm.toLowerCase());
            });
        }
    
        // Update the filtered residents state
        setFilteredResidents(filtered);
        setCurrentPage(1); // Reset to the first page after filtering
    }, [filters, sortBy, searchTerm, documentRequests]); // Include searchTerm as a dependency
   
        // Calculate the total number of pages
        const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);

        // Get current page's data
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentEntries = filteredResidents.slice(indexOfFirstItem, indexOfLastItem);
    
        // Pagination handlers
        const handleNextPage = () => {
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
        };
    
        const handlePrevPage = () => {
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        };
    
        const handleFirstPage = () => {
            setCurrentPage(1);
        };
    
        const handleLastPage = () => {
            setCurrentPage(totalPages);
        };
    
        const handlePageChange = (pageNum) => {
            setCurrentPage(pageNum);
        };

        const viewDocRequest = (docId) => {
          const selectedDoc = documentRequests.find((doc) => doc._id === docId);
          setSelectedDocument(selectedDoc);
          setIsModalOpen(true); // Show modal
      };

    return (
        <div className="flex flex-col min-h-screen">
            <Header userName={userName} userRole={userRole} handleLogout={handleLogout} getCurrentDate={getCurrentDate} profilePic={adminData?.profilepic}/>
            <div className="flex flex-1">
                <Navigation adminData={adminData} getCurrentDate={getCurrentDate} />
                <main className="flex-1 p-8 bg-gray-100">
                    <h1 className="text-4xl font-bold mb-5 text-gray-700">Document Request</h1>
                    <div className="flex justify-around mb-1">
                        <div className="bg-white p-6 rounded-lg shadow w-full">
                            <div className='flex-col justify-between items-center mb-4'>
                            <div className='flex justify-between items-center text-center mb-2'>
                            <h2 className="text-2xl font-semibold ">List of Document Request</h2>
                            <button
                                className="bg-[#1346AC] text-white px-8 py-2 rounded-full font-semibold"
                                onClick={() => navigate('/Create-Document-Request')}
                            >
                                Add Document Request
                            </button>
                            </div>
                            <div className='flex justify-between'>
                            <div className="flex space-x-4">
                                <div className="w-48">
                                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                                    <select
                                        id="date"
                                        name="date"
                                        value={filters.date}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option>All</option>
                                        <option>Latest</option>
                                        <option>Oldest</option>
                                    </select>
                                  </div>
                                    <div className="w-48">
                                        <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Type</label>
                                        <select
                                            id="documentType"
                                            name="documentType"
                                            value={filters.documentType}
                                            onChange={handleFilterChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="All">All</option>
                                            <option value="Barangay Certification">Barangay Certification</option>
                                            <option value="Barangay Business Clearance">Barangay Business Clearance</option>
                                            <option value="Certificate of Indigency">Certificate of Indigency</option>
                                            <option value="Certificate of Residency">Certificate of Residency</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    </div>
                                    <button className="text-[#1346AC] hover:text-blue-500 cursor-pointer font-semibold" onClick={resetFilters}>
                                        Reset Filters
                                    </button>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                <input
                                    type="text"
                                    placeholder="Search requestor name"
                                    className="w-80 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="flex items-center space-x-1">
                                  <label htmlFor="sortBy" className="text-md font-medium text-gray-700 whitespace-nowrap">
                                    Sort by
                                  </label>
                                  <div className="relative inline-flex items-center">
                                    <select
                                      id="sortBy"
                                      name="sortBy"
                                      className="block appearance-none text-base text-[#1346AC] font-semibold hover:text-blue-500 focus:outline-none focus:ring-0" 
                                      value={sortBy}
                                      onChange={handleSortChange}
                                    >
                                      <option value="Date">Date</option>
                                      <option value="Reference No.">Reference No.</option>
                                      <option value="Requestor Name">Requestor Name</option>
                                      <option value="Document Type">Document Type</option>
                                      <option value="Purpose">Purpose</option>
                                      <option value="Status">Status</option>
                                    </select>
                                      <svg
                                        className="h-5 w-5 text-gray-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                  </div>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="overflow-x-auto scrollbar-thin text-center">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="py-2 border-b border-r border-gray-200">Date Requested</th>
                                            <th className="py-2 border-b border-r border-gray-200">Reference No.</th>
                                            <th className="py-2 border-b border-r border-gray-200">Document Type</th>
                                            <th className="py-2 border-b border-r border-gray-200">Purpose</th>
                                            <th className="py-2 border-b border-r border-gray-200">Requestor Name</th>
                                            <th className="py-2 border-b border-r border-gray-200">Status</th>
                                            <th className="py-2 border-b border-gray-200">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {currentEntries.map((documentrequest) => (
                                    <tr key={documentrequest._id} className="border-t border-gray-200">
                                        <td className="py-2 px-4 border-b border-r border-gray-200 text-center">
                                            {new Date(documentrequest.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 border-b border-r border-gray-200 text-center">
                                            {documentrequest.ReferenceNo}
                                        </td>
                                        <td className="py-2 px-4 border-b border-r border-gray-200 text-center">
                                            {documentrequest.documentType}
                                        </td>
                                        <td className="py-2 px-4 border-b border-r border-gray-200 text-center">
                                            {documentrequest.purpose}
                                        </td>
                                        <td className="py-2 px-4 border-b border-r border-gray-200 text-center">
                                            {`${documentrequest.requestedBy.firstName} ${documentrequest.requestedBy.middleName ? documentrequest.requestedBy.middleName + ' ' : ''}${documentrequest.requestedBy.lastName}`}
                                        </td>
                                        <td className="py-2 px-4 border-b border-r border-gray-200 text-center">
                                          <span className={`px-4 py-1 rounded-full font-semibold 
                                              ${documentrequest.remarks ? 'bg-red-500' : 
                                              documentrequest.status === 'Pending' ? 'bg-[#FFEA00]' : 
                                              documentrequest.status === 'Processing' ? 'bg-[#5C80FF]' : 
                                              documentrequest.status === 'Ready to Pickup' ? 'bg-[#EE4D2D]' : 
                                              documentrequest.status === 'Released' ? 'bg-[#4D9669]' : 
                                              'bg-red-200'}`}>
                                            {/* Show "With Remarks" if there are remarks, otherwise show the status */}
                                            {documentrequest.remarks ? 'With Remarks' : documentrequest.status}
                                          </span>
                                      </td>
                                        <td className="py-2 px-4 border-b border-gray-200 space-x-2 text-center font-semibold">
                                        <div className="flex justify-center space-x-4 items-center">
                                    <div className="border-r border-gray-300 pr-4">
                                        <button
                                            className="text-[#1346AC] hover:text-blue-500"
                                            onClick={() => viewDocRequest(documentrequest._id)}
                                        >
                                            VIEW
                                        </button>
                                    </div>
                                    <div className="border-r border-gray-300 pr-4">
                                        <button
                                            className="text-[#1346AC] hover:text-yellow-500"
                                        >
                                            DENY
                                        </button>
                                    </div>
                                    <div className="pl-4 pr-2">
                                    <button
                                        className="text-[#1346AC] hover:text-red-500"
                                    >
                                        ARCHIVE
                                    </button>
                                </div>
                                </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4 font-semibold">
                        <div className="text-sm text-gray-600">
                            Showing {Math.min(indexOfLastItem, filteredResidents.length)} of {filteredResidents.length} entries
                        </div>
                        <div className="flex space-x-2 font-semibold">
                            <button onClick={handleFirstPage} disabled={currentPage === 1} className="px-2 py-1 bg-gray-200 rounded hover:bg-[#1A50BE]">&lt;&lt;</button>
                            <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-2 py-1 bg-gray-200 rounded hover:bg-[#1A50BE]">&lt;</button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-2 py-1 rounded ${page === currentPage ? 'bg-[#1A50BE] text-white' : 'bg-gray-200 hover:bg-[#1A50BE]'}`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-2 py-1 bg-gray-200 rounded hover:bg-[#1A50BE]">&gt;</button>
                            <button onClick={handleLastPage} disabled={currentPage === totalPages} className="px-2 py-1 bg-gray-200 rounded hover:bg-[#1A50BE]">&gt;&gt;</button>
                        </div>
                    </div>               
              </div>
            </div>
          </main>
        </div>
        {isModalOpen && selectedDocument && (
                <ViewDocumentRequestModal 
                    onClose={() => setIsModalOpen(false)} 
                    documentRequest={selectedDocument} 
                />
            )}
      </div>

    );
};

export default DocumentRequest;