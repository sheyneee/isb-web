import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResidentNav from '../../../component/Resident/ResidentNav';
import ResidentHeader from '../../../component/Resident/ResidentHeader';
import { useNavigate } from 'react-router-dom';
import ResidentDocumentRequestModal from '../../../component/Resident/ResidentDocumentRequestModal';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const ResidentDocRequest = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Create a reference for the file input
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [residentData, setResidentData] = useState(null);
    const [formData, setFormData] = useState({
        documentType: '',
        purpose: '',
        recipient: '',
        validID: null,
        residentName: '',
    });
    const [errors, setErrors] = useState({});
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [documentRequests, setDocumentRequests] = useState([]);
    const [filters, setFilters] = useState({ category: 'All' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('date');
    const [isRecipientUser, setIsRecipientUser] = useState(false); // Track checkbox state

    const [showSuccessModal, setShowSuccessModal] = useState(false); // State to track success modal visibility
    const [referenceNo, setReferenceNo] = useState(''); // State to store the generated ReferenceNo

    const [isModalOpen, setIsModalOpen] = useState(false); // For controlling modal
    const [selectedRequest, setSelectedRequest] = useState(null); // Store the selected request

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setResidentData(user);
            setUserName(`${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '.' : ''} ${user.lastName}`);
            setUserRole(user.roleinHousehold);
            setFormData((prevData) => ({
                ...prevData,
                residentName: `${user.lastName}, ${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '.' : ''} `, 
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
        setFormData({ ...formData, validID: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate form data before sending the request
        if (!validateForm()) {
            return;
        }
    
        // Display loading spinner using SweetAlert
        Swal.fire({
            title: 'Processing...',
            text: 'Please wait while we process your document request.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); // Show the loading spinner
            },
        });
    
        const user = JSON.parse(localStorage.getItem('user'));
        const isAdmin = user.roleinBarangay && ['Barangay Captain', 'Secretary', 'Kagawad'].includes(user.roleinBarangay);
        const requestedByType = isAdmin ? 'Admin' : 'Resident';
    
        const formDataToSend = new FormData();
        formDataToSend.append('requestedBy', user._id);
        formDataToSend.append('requestedByType', requestedByType);
        formDataToSend.append('documentType', formData.documentType);
        formDataToSend.append('purpose', formData.purpose);
        formDataToSend.append('recipient', formData.recipient);
        formDataToSend.append('residentName', formData.residentName);
    
        if (formData.validID) {
            formDataToSend.append('ValidID', formData.validID);
        }
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/new/document-requests`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Set the generated ReferenceNo from the response
            setReferenceNo(response.data.request.ReferenceNo);
    
            // Show success alert and close the loading spinner
            Swal.fire({
                icon: 'success',
                title: 'Request Submitted',
                text: `Your Reference Number is: ${response.data.request.ReferenceNo}`,
            });
    
            // Clear form fields after successful submission
            setFormData({
                documentType: '',
                purpose: '',
                recipient: '',
                validID: null,
                residentName: `${user.lastName}, ${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '.' : ''}`,
            });
            setTermsAccepted(false);
            setIsRecipientUser(false);
    
            // Clear the file input using ref
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset file input
            }
    
            // Refetch document requests to update the history
            fetchDocumentRequests();
        } catch (error) {
            console.error('Error creating document request:', error);
    
            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Request Failed',
                text: 'An error occurred while processing your request. Please try again.',
            });
        } finally {
            Swal.close(); // Close the loading spinner in case it was not automatically closed
        }
    };
    

    const resetFilters = () => {
        setFilters({
            sortBy: 'Date',
            category: 'All',
        });
        setSearchTerm('');
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.documentType) newErrors.documentType = 'Document type is required';
        if (!formData.purpose) newErrors.purpose = 'Purpose is required';
        if (!formData.recipient) newErrors.recipient = 'Recipient is required';
        if (!formData.validID) newErrors.validID = 'Valid ID is required';
    
        console.log('Form data being sent:', formData); 
    
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
            return new Date(b.created_at) - new Date(a.created_at);
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
    return (
        <div className="flex flex-col min-h-screen">
            <ResidentHeader userName={userName} userRole={userRole} handleLogout={handleLogout} residentData={residentData} />
            <div className="flex flex-1">
            <ResidentNav residentData={residentData}  />
                <main className="flex-1 p-8 bg-gray-100">
                    <h2 className="text-3xl font-bold mb-8">Document Request</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-2xl mb-4">Create Document Request</h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Type of Document</label>
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

                                {/* User Full name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.residentName} // Non-editable field
                                        className="form-input mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                        disabled
                                    />
                                </div>

                                {/* Editable Recipient Full Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-black">Recipient Full Name</label>
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
                                            <span className="text-sm font-semibold text-black">I am the Recipient</span>
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
                                    <label className="block text-sm font-medium text-gray-700">Purpose of Request</label>
                                    <select name="purpose" value={formData.purpose} onChange={handleInputChange} className="form-select mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md">
                                        <option value="">Select Purpose</option>
                                        <option value="Work">Work</option>
                                        <option value="School">School</option>
                                        <option value="Business">Business</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Others">Others</option>
                                    </select>
                                    {errors.purpose && <p className="text-red-500 text-xs">{errors.purpose}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Valid ID</label>
                                    <input 
                                        type="file" 
                                        name="ValidID" 
                                        onChange={handleFileChange} 
                                        ref={fileInputRef}
                                        className="mt-1 block w-full border border-gray-300 rounded-md" 
                                    />
                                    {errors.validID && <p className="text-red-500 text-xs">{errors.validID}</p>}
                                </div>

                                <div className="mt-2 mb-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={() => setTermsAccepted(!termsAccepted)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">
                                        I agree to the{' '}
                                        <span
                                            className="text-blue-600 cursor-pointer underline"
                                            onClick={() => setShowTermsModal(true)}
                                        >
                                            Terms and Conditions
                                        </span>.
                                    </span>
                                    {showError && !termsAccepted && (
                                        <p className="text-red-500 text-sm">You must agree to the Terms and Conditions</p>
                                    )}
                                </div>

                                <button type="submit" className="bg-[#1346AC] text-white px-4 py-2 rounded hover:bg-blue-700">Request Document</button>
                            </form>
                        </div>

                        {showTermsModal && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 md:w-2/2 max-h-[80vh] scrollbar-thin overflow-y-auto">
                                    <h2 className="text-2xl font-semibold mb-4 text-center">Terms and Conditions</h2>
                                    <div className="overflow-y-auto max-h-96 mb-4">
                                        <p className='m-2 text-start'>
                                            This Data Privacy Agreement outlines how we handle, process, and protect your personal information when submitting a document request through our services. By submitting a request, you agree to the terms of this agreement.
                                        </p>
                                        <p><strong>1. Collection of Personal Data:</strong> We collect the following personal information for the purpose of processing your document request:</p>
                                        <ul className="list-disc list-inside ml-4">
                                            <li>Full name</li>
                                            <li>Contact details (email address, phone number)</li>
                                            <li>Address</li>
                                            <li>Government-issued ID</li>
                                            <li>Other relevant information necessary for your request</li>
                                        </ul>
                                        <p><strong>2. Purpose of Data Collection:</strong> The data we collect is used solely for:</p>
                                        <ul className="list-disc list-inside ml-4">
                                            <li>Verifying your identity</li>
                                            <li>Processing your document request</li>
                                            <li>Communicating with you regarding the status of your request</li>
                                            <li>Complying with legal obligations</li>
                                        </ul>
                                        <p><strong>3. Data Storage and Retention:</strong> We store your personal information securely in our systems. Your data will be retained only for as long as necessary to process your request and comply with legal obligations. Afterward, it will be securely deleted.</p>
                                        <p><strong>4. Data Sharing:</strong> We will not share your personal data with third parties unless:</p>
                                        <ul className="list-disc list-inside ml-4">
                                            <li>Required by law</li>
                                            <li>You have provided explicit consent</li>
                                            <li>It is necessary to fulfill your request (e.g., sharing with government agencies for processing documents)</li>
                                        </ul>
                                        <p><strong>5. Security Measures:</strong> We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
                                        <p><strong>6. Your Rights:</strong> You have the right to:</p>
                                        <ul className="list-disc list-inside ml-4">
                                            <li>Access the personal data we hold about you</li>
                                            <li>Request corrections or updates to your data</li>
                                            <li>Request the deletion of your personal data, subject to legal requirements</li>
                                            <li>Withdraw consent for data processing at any time</li>
                                        </ul>
                                        <p>By submitting your document request, you confirm that you have read, understood, and agreed to this Data Privacy Agreement.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowTermsModal(false)}
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
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Document Request History</h2>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border border-gray-300 rounded-md p-2 w-80"
                                    />
                                    <div className="flex items-center">
                                        <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by</label>
                                        <div className="relative">
                                            <select
                                                id="sortBy"
                                                name="sortBy"
                                                className="block appearance-none w-full bg-white text-[#1346AC] font-semibold py-2 px-1 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                value={sortOrder}
                                                onChange={(e) => setSortOrder(e.target.value)}
                                            >
                                                <option value="date">Date</option>
                                                <option value="title">Title</option>
                                                <option value="status">Status</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10l5 5 5-5H7z"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center mb-4">
                                <div className="mr-2">
                                    <label htmlFor="Category" className="block text-sm font-medium text-gray-700">Document Type</label>
                                    <select
                                        name="filterCategory"
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="All">All</option>
                                        <option value="Barangay Certification">Barangay Certification</option>
                                        <option value="Barangay Business Clearance">Barangay Business Clearance</option>
                                        <option value="Certificate of Indigency">Certificate of Indigency</option>
                                        <option value="Certificate of Residency">Certificate of Residency</option>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sortedRequests.length > 0 ? (
                                    sortedRequests.map((request, index) => (
                                        <div
                                            key={index}
                                            className="bg-[#d1d5db] p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                            onClick={() => handleOpenModal(request)} // Open modal on click
                                        >
                                            <div
                                                className={`w-fit px-5 py-1 rounded-full font-semibold text-white mb-4
                                                    ${request.remarks
                                                        ? 'bg-red-500'
                                                        : request.status === 'Pending'
                                                        ? 'bg-[#FFEA00] text-black'
                                                        : request.status === 'Processing'
                                                        ? 'bg-[#5C80FF]'
                                                        : request.status === 'Ready to Pickup'
                                                        ? 'bg-[#EE4D2D]'
                                                        : request.status === 'Released'
                                                        ? 'bg-[#4D9669]'
                                                        : 'bg-red-200'}`}
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
                            {/* Show the modal if isModalOpen is true */}
                            {isModalOpen && selectedRequest && (
                                <ResidentDocumentRequestModal
                                    documentRequest={selectedRequest}
                                    onClose={handleCloseModal}
                                />
                            )}
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-600">
                                    Showing {sortedRequests.length} entries
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ResidentDocRequest;
