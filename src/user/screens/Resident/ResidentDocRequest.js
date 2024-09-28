import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResidentNav from '../../../component/Resident/ResidentNav';
import ResidentHeader from '../../../component/Resident/ResidentHeader';
import { useNavigate } from 'react-router-dom';
import ResidentDocumentRequestModal from '../../../component/Resident/ResidentDocumentRequestModal';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import NestedDropdown from '../../../assets/dropdowns/NestedDropdown';
import DocReqDataPrivAgreement from '../../../assets/dataprivacyandtermsandconditions/DocReqDataPrivAgreement';
import DocReqTermsandConditions from '../../../assets/dataprivacyandtermsandconditions/DocReqTermsandConditions';

const ResidentDocRequest = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [residentData, setResidentData] = useState(null);
    const [formData, setFormData] = useState({
        documentType: '',
        otherDocumentType: '',
        purpose: '',
        otherPurpose: '',
        recipient: '',
        validID: [], 
        residentName: '',
    });
    const [errors, setErrors] = useState({});
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(null); 
    const [showError, setShowError] = useState(false);
    const [documentRequests, setDocumentRequests] = useState([]);
    const [filters, setFilters] = useState({ category: 'All', status: 'All', purpose: 'All' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [isRecipientUser, setIsRecipientUser] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [referenceNo, setReferenceNo] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedSortText, setSelectedSortText] = useState('Sort by Date');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            if (user.profilepic) {
                user.profilepic = user.profilepic.replace(/\\/g, '/'); // Adjust the path for correct URL
            }
            setResidentData(user);
            setUserName(`${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '.' : ''} ${user.lastName}`);
            setUserRole(user.roleinHousehold);
            setFormData((prevData) => ({
                ...prevData,
                residentName: `${user.lastName}, ${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '.' : ''}`, 
            }));
            fetchDocumentRequests(); // Fetch requests after setting user info
        }
    }, [filters]);

    const handleSetRecipientAsUser = () => {
        setIsRecipientUser(!isRecipientUser);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!isRecipientUser && user) {
            setFormData({
                ...formData,
                recipient: `${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '.' : ''} ${user.lastName}`,
            });
        } else {
            setFormData({
                ...formData,
                recipient: '' // Clear recipient if checkbox is unchecked
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, validID: [...formData.validID, ...files] }); 
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        Swal.fire({
            title: 'Processing...',
            text: 'Please wait while we process your document request.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); 
            },
        });

        const user = JSON.parse(localStorage.getItem('user'));
        const isAdmin = user.roleinBarangay && ['Barangay Captain', 'Secretary', 'Kagawad'].includes(user.roleinBarangay);
        const requestedByType = isAdmin ? 'Admin' : 'Resident';

        const formDataToSend = new FormData();
        formDataToSend.append('requestedBy', user._id);
        formDataToSend.append('requestedByType', requestedByType);
        formDataToSend.append('documentType', formData.documentType === 'Others' ? formData.otherDocumentType : formData.documentType);
        formDataToSend.append('purpose', formData.purpose === 'Others' ? formData.otherPurpose : formData.purpose);
        formDataToSend.append('recipient', formData.recipient);
        formDataToSend.append('residentName', formData.residentName);

        if (formData.validID) {
            formDataToSend.append('ValidID', formData.validID);
        }

        if (formData.validID && formData.validID.length > 0) {
            formData.validID.forEach((file, index) => {
                formDataToSend.append(`ValidID`, file); 
            });
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/new/document-requests`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setReferenceNo(response.data.request.ReferenceNo);

            Swal.fire({
                icon: 'success',
                title: 'Request Submitted',
                text: `Your Reference Number is: ${response.data.request.ReferenceNo}`,
            });

            setFormData({
                documentType: '',
                otherDocumentType: '',
                purpose: '',
                otherPurpose: '',
                recipient: '',
                validID: [],
                residentName: `${user.lastName}, ${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '.' : ''}`,
            });
            setTermsAccepted(false);
            setIsRecipientUser(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = ''; 
            }

            fetchDocumentRequests();
        } catch (error) {
            console.error('Error creating document request:', error);

            Swal.fire({
                icon: 'error',
                title: 'Request Failed',
                text: 'An error occurred while processing your request. Please try again.',
            });
        } finally {
            Swal.close();
        }
    };    
    
    const resetFilters = () => {
        setFilters({
            category: 'All',
            status: 'All',
            purpose: 'All',
        });
        setSearchTerm('');
        fetchDocumentRequests(); 
    };
    

    const validateForm = () => {
        let newErrors = {};
        if (!formData.documentType) newErrors.documentType = 'Document type is required';
        if (formData.documentType === 'Others' && !formData.otherDocumentType) newErrors.otherDocumentType = 'Please specify the document type';
        if (!formData.purpose) newErrors.purpose = 'Purpose is required';
        if (formData.purpose === 'Others' && !formData.otherPurpose) newErrors.otherPurpose = 'Please specify the purpose';
        if (!formData.recipient) newErrors.recipient = 'Recipient is required';
        if (!formData.validID) newErrors.validID = 'Valid ID is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchDocumentRequests = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
    
        if (!user || !user._id) {
            console.error('User not found or missing _id');
            return;
        }
    
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/document-requests/history/${user._id}`);
    
            console.log('Document requests fetched:', response.data);
            setDocumentRequests(response.data);  // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching document requests:', error);
        }
    };

    const sortedRequests = documentRequests.sort((a, b) => {
        if (sortOrder === 'date') {
            return sortDirection === 'desc' ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at);
        } else if (sortOrder === 'documentType') {
            return a.documentType.localeCompare(b.documentType);
        } else if (sortOrder === 'status') {
            return a.status.localeCompare(b.status);
        }
        return 0;
    });
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Handle opening modal
    const handleOpenModal = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    // Handle closing modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    // Handle opening Terms and Conditions modal
    const openTermsModal = () => {
        setShowTermsModal('terms');
    };

    // Handle opening Data Privacy Agreement modal
    const openPrivacyModal = () => {
        setShowTermsModal('privacy');
    };

       // Handle sort direction change
       const handleSortChange = (direction) => {
        // Reset any status filters when sorting by date
        setFilters({ ...filters, status: 'All' }); // Reset status filter when switching to date sort
        setSortOrder('date'); // Set sort by date
        setSortDirection(direction); // Set sort direction (asc or desc)
        setSelectedSortText(`Sort by Date: ${direction === 'desc' ? 'Latest to Oldest' : 'Oldest to Latest'}`);
    };

    const handleStatusChange = (status) => {
        // Reset any date sorting when sorting by status
        setSortOrder('status'); // Set sort by status
        setFilters({ ...filters, status }); // Update the status filter
        setSelectedSortText(`Status: ${status}`);
    };

    // Handle purpose filter change
    const handlePurposeFilterChange = (e) => {
        setFilters({ ...filters, purpose: e.target.value });
    };
    
 // Handle filters and sorting
 const filteredRequests = documentRequests
 .filter((request) => {
     // Filter by category (documentType)
     if (filters.category !== 'All') {
         if (filters.category === 'Others') {
             return request.documentType && !['Barangay Certification', 'Barangay Business Clearance', 'Certificate of Indigency', 'Certificate of Residency'].includes(request.documentType);
         }
         if (request.documentType !== filters.category) {
             return false;
         }
     }

    // Search by document type (and possibly other fields)
    if (searchTerm && !request.documentType.toLowerCase().includes(searchTerm.toLowerCase())) {
    return false;
}

     // Filter by status
     if (filters.status === 'With Remarks') {
         return request.remarks && request.remarks.trim() !== '';
     } else if (filters.status !== 'All' && request.status !== filters.status) {
         return false;
     }

     // Filter by purpose
     if (filters.purpose !== 'All') {
         if (filters.purpose === 'Others') {
             return request.purpose && !['Work', 'School', 'Business', 'Travel'].includes(request.purpose);
         }
         if (request.purpose !== filters.purpose) {
             return false;
         }
     }

     return true;
 })
 .sort((a, b) => {
     if (sortOrder === 'date') {
         return sortDirection === 'desc' ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at);
     } else if (sortOrder === 'status') {
         return a.status.localeCompare(b.status);
     }
     return 0;
 });

     // Remove a selected file
    const handleRemoveFile = (indexToRemove) => {
        setFormData((prevData) => ({
            ...prevData,
            validID: prevData.validID.filter((_, index) => index !== indexToRemove),
        }));
    };

 const handleUpdateRequest = async (updatedData) => {
    try {
        await axios.put(`${process.env.REACT_APP_BACKEND_API_KEY}/api/document-requests/${selectedRequest._id}`, updatedData);
        Swal.fire('Success', 'Document request updated successfully!', 'success');
        fetchDocumentRequests();  // Refetch the updated document requests
        handleCloseModal();  // Close the modal
    } catch (error) {
        console.error('Error updating document request:', error);
        Swal.fire('Error', 'Failed to update the document request.', 'error');
    }
};

useEffect(() => {
    // Fetch the document requests here and filter/sort as needed
}, [filters, sortDirection]);

    // Handle pagination logic
    const indexOfLastRequest = currentPage * itemsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    return (
        <div className="flex flex-col min-h-screen">
            <ResidentHeader 
                userName={userName} 
                userRole={userRole} 
                handleLogout={handleLogout} 
                profilePic={residentData?.profilepic} 
            />
            <div className="flex flex-1">
            <ResidentNav residentData={residentData}  />
                <main className="flex-1 p-8 bg-gray-100">
                    <h2 className="text-3xl font-bold mb-8">Document Request</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-2xl mb-4">Create Document Request</h3>

                                <div className="mb-4">
                                    <label className="block text-md font-medium text-gray-700">Type of Document</label>
                                    <select
                                        name="documentType"
                                        value={formData.documentType}
                                        onChange={handleInputChange}
                                        className="form-select mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Select Document Type</option>
                                        <option value="Barangay Certification">Barangay Certification</option>
                                        <option value="Barangay Business Clearance">Barangay Business Clearance</option>
                                        <option value="Certificate of Indigency">Certificate of Indigency</option>
                                        <option value="Certificate of Residency">Certificate of Residency</option>
                                        <option value="Others">Others</option>
                                    </select>
                                    {errors.documentType && <p className="text-red-500 text-xs">{errors.documentType}</p>}
                                </div>

                                {formData.documentType === 'Others' && (
                                    <div className="mb-4">
                                        <label className="block text-md font-medium text-gray-700">Specify Other Document Type</label>
                                        <input
                                            type="text"
                                            name="otherDocumentType"
                                            value={formData.otherDocumentType}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                            placeholder="Enter document type"
                                        />
                                        {errors.otherDocumentType && <p className="text-red-500 text-xs">{errors.otherDocumentType}</p>}
                                    </div>
                                )}

                                {/* User Full name */}
                                <div className="mb-4">
                                    <label className="block text-md font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.residentName} // Non-editable field
                                        className="form-input mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                        disabled
                                    />
                                </div>

                                {/* Editable Recipient Full Name */}
                                <div className="mb-4">
                                    <label className="block text-md font-semibold text-black">Recipient Full Name</label>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="text" 
                                            name="recipient" 
                                            value={formData.recipient} 
                                            onChange={handleInputChange} 
                                            className="form-input flex-1 text-black" 
                                            disabled={isRecipientUser} // Disable only when the checkbox is checked
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-md font-semibold text-black">I am the Recipient</span>
                                            <input
                                                type="checkbox"
                                                name="isRecipientUser"
                                                checked={isRecipientUser}
                                                onChange={handleSetRecipientAsUser}
                                                className="form-checkbox"
                                            />
                                        </div>
                                    </div>
                                    {errors.recipient && <p className="text-red-500 text-xs">{errors.recipient}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-md font-medium text-gray-700">Purpose of Request</label>
                                    <select
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleInputChange}
                                        className="form-select mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">Select Purpose</option>
                                        <option value="Work">Work</option>
                                        <option value="School">School</option>
                                        <option value="Business">Business</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Others">Others</option>
                                    </select>
                                    {errors.purpose && <p className="text-red-500 text-xs">{errors.purpose}</p>}
                                </div>

                                {/* Show input for custom purpose if "Others" is selected */}
                                {formData.purpose === 'Others' && (
                                    <div className="mb-4">
                                        <label className="block text-md font-medium text-gray-700">Specify Other Purpose</label>
                                        <input
                                            type="text"
                                            name="otherPurpose"
                                            value={formData.otherPurpose}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                            placeholder="Enter purpose"
                                        />
                                        {errors.otherPurpose && <p className="text-red-500 text-xs">{errors.otherPurpose}</p>}
                                    </div>
                                )}

                                {/* File Upload Field */}
                                <div className="mb-4">
                                    <label className="block text-md font-medium text-gray-700">Valid ID</label>
                                    <input 
                                        type="file" 
                                        name="ValidID" 
                                        onChange={handleFileChange} 
                                        ref={fileInputRef}
                                        className="mt-1 block w-full border border-gray-300 rounded-md" 
                                        multiple 
                                    />
                                    {errors.validID && <p className="text-red-500 text-xs">{errors.validID}</p>}
                                </div>

                                <div className="mb-4">
                                <label className="block text-md font-medium text-gray-700">Attached Files</label>
                                {formData.validID && formData.validID.length > 0 ? (
                                    <ul className="space-y-2">
                                        {formData.validID.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative flex items-center justify-between p-2 border rounded-lg shadow-sm bg-gray-50"
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-[#1346AC] text-white flex items-center justify-center rounded-full mr-3">
                                                        <i className="fas fa-file-alt"></i>
                                                    </div>
                                                    <div className="truncate max-w-xs">
                                                        <span className="text-blue-600 font-semibold truncate">
                                                            {file.name}
                                                        </span>
                                                        <p className="text-gray-500 text-xs">{file.type}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(index)}
                                                    className="absolute right-0 top-0 text-black hover:text-red-600 mr-2"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No files attached.</p>
                                )}
                                </div>

                                <div className="mt-2 mb-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={() => setTermsAccepted(!termsAccepted)}
                                        className="mr-2"
                                    />
                                    <span className="text-md">
                                        I agree to the{' '}
                                        <span
                                            className="text-blue-600 cursor-pointer underline"
                                            onClick={openTermsModal}
                                        >
                                            Terms and Conditions 
                                        </span> 
                                        {' '} and {' '}
                                        <span
                                            className="text-blue-600 cursor-pointer underline"
                                            onClick={openPrivacyModal}
                                        >
                                            Data Privacy Agreement
                                        </span>.
                                    </span>
                                    {showError && !termsAccepted && (
                                        <p className="text-red-500 text-md">You must agree to the Terms and Conditions and Data Privacy Agreement</p>
                                    )}
                                </div>

                                <button type="submit" className="bg-[#1346AC] text-white px-4 py-2 rounded hover:bg-blue-700 mt-2">Request Document</button>
                            </form>
                        </div>

                        {showTermsModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center modal-overlay">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 md:w-2/2 max-h-[80vh] scrollbar-thin overflow-y-auto">
                            {showTermsModal === 'terms' && <DocReqTermsandConditions closeModal={() => setShowTermsModal(null)} />}
                            {showTermsModal === 'privacy' && <DocReqDataPrivAgreement closeModal={() => setShowTermsModal(null)} />}
                            <button
                                onClick={() => setShowTermsModal(null)}
                                className="bg-[#1346AC] text-white w-full px-4 py-2 rounded-full font-semibold hover:bg-blue-700"
                            >
                                Close
                            </button>
                            </div>
                        </div>
                        )}
                        
                        {showSuccessModal && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg w-md">
                                    <h2 className="text-2xl font-semibold mb-4 text-center">Document Request Submitted</h2>
                                    <p className="text-center mb-4">Your Reference Number is: <strong>{referenceNo}</strong></p>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => setShowSuccessModal(false)}
                                            className="bg-[#1346AC] text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700"
                                        >
                                            Okay
                                        </button>
                                        <button
                                            onClick={() => setShowSuccessModal(false)}
                                            className="bg-gray-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-500"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="col-span-1 lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between mb-4">
                            <div>
                            <h2 className="text-2xl font-semibold mb-4">Document Request History</h2>
                            <div className="flex items-center mb-4">
                                <div className="mr-2">
                                    <label htmlFor="Category" className="block text-md font-medium text-gray-700">Document Type</label>
                                    <select
                                        name="filterCategory"
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="border border-gray-300 rounded-md p-2 w-48"
                                    >
                                        <option value="All">All</option>
                                        <option value="Barangay Certification">Barangay Certification</option>
                                        <option value="Barangay Business Clearance">Barangay Business Clearance</option>
                                        <option value="Certificate of Indigency">Certificate of Indigency</option>
                                        <option value="Certificate of Residency">Certificate of Residency</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div className="mr-2">
                                    <label htmlFor="purpose" className="block text-md font-medium text-gray-700">Purpose</label>
                                    <select
                                        name="purpose"
                                        value={filters.purpose}
                                        onChange={handlePurposeFilterChange}
                                        className="border border-gray-300 rounded-md p-2 w-48"
                                    >
                                        <option value="All">All</option>
                                        <option value="Work">Work</option>
                                        <option value="School">School</option>
                                        <option value="Business">Business</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <button
                                    className="mt-4 text-blue-500 hover:text-[#1A50BE] cursor-pointer font-semibold"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </button>
                                </div>
                            </div>
                                <div className="flex-col space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border border-gray-300 rounded-md p-2 w-72"
                                    />
                                    <div className='justify-self-end'>
                                    <NestedDropdown
                                        handleSortChange={handleSortChange} 
                                        handleStatusChange={handleStatusChange} 
                                        selectedSortText={selectedSortText} 
                                    />
                                    </div>
                            </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentRequests.length > 0 ? (
                                    currentRequests.map((request, index) => (
                                        <div
                                            key={index}
                                            className="bg-[#d1d5db] p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                            onClick={() => handleOpenModal(request)}
                                        >
                                            <div
                                                className={`w-fit px-5 py-1 rounded-full font-semibold text-white mb-4
                                                    ${request.remarks ? 'bg-red-500' :
                                                    request.status === 'Pending' ? 'bg-[#FFEA00] text-black' :
                                                    request.status === 'Processing' ? 'bg-[#5C80FF]' :
                                                    request.status === 'Ready to Pickup' ? 'bg-[#EE4D2D]' :
                                                    request.status === 'Released' ? 'bg-[#4D9669]' :
                                                    'bg-red-200'}`}
                                            >
                                                {request.remarks ? 'With Remarks' : request.status}
                                            </div>
                                            <div className="flex items-center mb-4">
                                                <div>
                                                    <h4 className="text-lg font-semibold">{request.documentType}</h4>
                                                    <p className="text-md text-black font-semibold mt-2">{request.purpose}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(request.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No document requests found.</p>
                                )}
                            </div>
                            <div className="flex justify-between items-center mt-auto">
                                <div className="text-md text-gray-600">
                                    Showing {Math.min(indexOfLastRequest, filteredRequests.length)} of {filteredRequests.length} entries
                                </div>
                                <div className="mt-4">
                                    {Array.from({ length: Math.ceil(filteredRequests.length / itemsPerPage) }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => paginate(i + 1)}
                                            className={`px-3 py-1 mr-2 rounded ${currentPage === i + 1 ? 'bg-[#1346AC] text-white' : 'bg-gray-200 hover:bg-[#1346AC] hover:text-white'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                 {/* Show the modal if isModalOpen is true */}
                            {isModalOpen && selectedRequest && (
                                <ResidentDocumentRequestModal
                                documentRequest={selectedRequest}
                                onClose={handleCloseModal}
                                onSave={handleUpdateRequest}
                            />
                            )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ResidentDocRequest;
