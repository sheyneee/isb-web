import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ResidentNav from '../../../component/Resident/ResidentNav';
import ResidentHeader from '../../../component/Resident/ResidentHeader';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router-dom';
import IncidentReportDataPrivAgreement from '../../../assets/dataprivacyandtermsandconditions/IncidentReportDataPrivAgreement';
import IncidentReportTermsandConditions from '../../../assets/dataprivacyandtermsandconditions/IncidentReportTermsandConditions';
import IncidentReportNestedDropdown from '../../../assets/dropdowns/IncidentReportNestedDropdown';

const ResidentIncidentReport = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [residentData, setResidentData] = useState(null);
    const [incidentReports, setIncidentReports] = useState([]);
    const [formData, setFormData] = useState({
        complainantID: '',
        complainantByType: 'Resident',
        complainantname: '',
        typeofcomplaint: '',
        otherComplaintType: '', 
        incidentdescription: '',
        dateAndTimeofIncident: '',
        attachments: []
    });
    const [filters, setFilters] = useState({ category: 'All', status: 'All' });
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState({});
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(null);
    const [showError, setShowError] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 4;  

    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedSortText, setSelectedSortText] = useState('Sort by Date');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setResidentData(user);
            setUserName(`${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '.' : ''} ${user.lastName}`);
            setUserRole(user.roleinHousehold);
            setFormData((prevData) => ({
                ...prevData,
                complainantID: user._id, 
                complainantname: `${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '.' : ''} ${user.lastName}`
            }));
            
            // Fetch history once resident data is set
            fetchIncidentHistory(user._id); 
        }
    }, []);

    // Fetch incident history for the logged-in user
    const fetchIncidentHistory = async (userId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/incident-reports/history/${userId}`);
            if(response.data) {
                setIncidentReports(response.data); // Set the fetched incident reports
            }
        } catch (error) {
            console.error('Error fetching incident history:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            attachments: [...formData.attachments, ...files]
        });
    };

    const handleRemoveFile = (indexToRemove) => {
        setFormData((prevData) => ({
            ...prevData,
            attachments: prevData.attachments.filter((_, index) => index !== indexToRemove)
        }));
    };

    // Search and filter logic for incident reports
    const filteredReports = incidentReports.filter(report => {
        const predefinedCategories = ['Utility Interruptions', 'Noise Complaint', 'Public Disturbance', 'Waste Management'];

        const matchesCategory = filters.category === 'All' ||
            (filters.category === 'Others' && !predefinedCategories.includes(report.typeofcomplaint)) || 
            (filters.category !== 'Others' && report.typeofcomplaint === filters.category);

        const matchesStatus = filters.status === 'All' || report.status === filters.status;
        const matchesSearch = report.typeofcomplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                report.incidentdescription.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesStatus && matchesSearch;
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSortChange = (direction) => {
        setSortOrder(direction);
        setSelectedSortText(`Sort by Date: ${direction === 'desc' ? 'Latest to Oldest' : 'Oldest to Latest'}`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const resetFilters = () => {
        setFilters({ category: 'All', status: 'All' });
        setSearchTerm('');
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.typeofcomplaint && formData.typeofcomplaint !== 'Others') {
            newErrors.typeofcomplaint = 'Type of complaint is required';
        }
        if (formData.typeofcomplaint === 'Others' && !formData.otherComplaintType) {
            newErrors.otherComplaintType = 'Please specify the complaint type';
        }
        if (!formData.incidentdescription) {
            newErrors.incidentdescription = 'Incident description is required';
        }
        if (!formData.dateAndTimeofIncident) {
            newErrors.dateAndTimeofIncident = 'Date and time of incident are required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) {
            return;
        }
    
        if (!termsAccepted) {
            setShowError(true);
            return;
        }
    
        Swal.fire({
            title: 'Submitting...',
            text: 'Please wait while we submit your incident report.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        const formDataToSend = new FormData();
        formDataToSend.append('complainantID', formData.complainantID);
        formDataToSend.append('complainantByType', formData.complainantByType);
        formDataToSend.append('complainantname', formData.complainantname);
        formDataToSend.append('typeofcomplaint', formData.typeofcomplaint === 'Others' ? formData.otherComplaintType : formData.typeofcomplaint);
        formDataToSend.append('incidentdescription', formData.incidentdescription);
        formDataToSend.append('dateAndTimeofIncident', formData.dateAndTimeofIncident);
    
        formData.attachments.forEach((file) => {
            formDataToSend.append('attachments', file);
        });
    
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/new/incident-report`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            Swal.fire({
                icon: 'success',
                title: 'Report Submitted',
                text: 'Your incident report has been successfully submitted.'
            });
    
            // Reset the form data
            setFormData({
                complainantID: formData.complainantID,
                complainantByType: 'Resident',
                complainantname: formData.complainantname,
                typeofcomplaint: '',
                otherComplaintType: '',
                incidentdescription: '',
                dateAndTimeofIncident: '',
                attachments: []
            });
    
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
    
            // Fetch updated incident history without page reload
            await fetchIncidentHistory(formData.complainantID);
    
        } catch (error) {
            console.error('Error submitting incident report:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'An error occurred while submitting your report. Please try again.'
            });
        }
    };
    

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Modal handlers
    const openTermsModal = () => setShowTermsModal('terms');
    const openPrivacyModal = () => setShowTermsModal('privacy');
    const closeModal = () => setShowTermsModal(null);

    return (
        <div className="flex flex-col min-h-screen">
            <ResidentHeader 
                userName={userName} 
                userRole={userRole} 
                handleLogout={handleLogout} 
                profilePic={residentData?.profilepic} 
            />
            <div className="flex flex-1">
                <ResidentNav residentData={residentData} />
                <main className="flex-1 p-8 bg-gray-100">
                    <h2 className="text-3xl font-bold mb-8">Incident Report</h2>
                    
                    {/* Flex container to display form and history side by side */}
                    <div className="flex space-x-8">
                        
                        <div className="w-full lg:w-6/12 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between" style={{ minHeight: '600px' }}>
                            <form className="flex flex-col flex-grow" onSubmit={handleSubmit}>
                                {/* Form Fields */}
                                <div className="mb-4">
                                    <label className="block text-md font-medium text-gray-700">Type of Complaint</label>
                                    <select
                                        type="text"
                                        name="typeofcomplaint"
                                        value={formData.typeofcomplaint}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="">Select Type of Complaint</option>
                                        <option value="Utility Interruptions">Utility Interruptions</option>
                                        <option value="Noise Complaint">Noise Complaint</option>
                                        <option value="Public Disturbance">Public Disturbance</option>
                                        <option value="Waste Management">Waste Management</option>
                                        <option value="Others">Others</option>
                                    </select>
                                    {errors.typeofcomplaint && <p className="text-red-500 text-xs">{errors.typeofcomplaint}</p>}
                                </div>

                                {/* Other Complaint Type */}
                                {formData.typeofcomplaint === 'Others' && (
                                    <div className="mb-4">
                                        <label className="block text-md font-medium text-gray-700">Specify Other Complaint Type</label>
                                        <input
                                            type="text"
                                            name="otherComplaintType"
                                            value={formData.otherComplaintType}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            placeholder="Enter complaint type"
                                        />
                                        {errors.otherComplaintType && <p className="text-red-500 text-xs">{errors.otherComplaintType}</p>}
                                    </div>
                                )}

                                {/* Incident Description */}
                                <div className="mb-4">
                                    <label className="block text-md font-medium text-gray-700">Incident Description</label>
                                    <textarea
                                        name="incidentdescription"
                                        value={formData.incidentdescription}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    ></textarea>
                                    {errors.incidentdescription && <p className="text-red-500 text-xs">{errors.incidentdescription}</p>}
                                </div>

                                {/* Date and Time of Incident */}
                                <div className="mb-4 w-full lg:w-6/12">
                                    <label className="block text-md font-medium text-gray-700">Date and Time of Incident</label>
                                    <input
                                        type="datetime-local"
                                        name="dateAndTimeofIncident"
                                        value={formData.dateAndTimeofIncident}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    />
                                    {errors.dateAndTimeofIncident && <p className="text-red-500 text-xs">{errors.dateAndTimeofIncident}</p>}
                                </div>

                                {/* File Attachments */}
                                <div className="mb-4">
                                    <label className="block text-md font-medium text-gray-700">Attachments</label>
                                    {formData.attachments.length > 0 && (
                                        <ul className="mt-2 space-y-2">
                                            {formData.attachments.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="relative flex items-center justify-between p-2 border rounded-lg shadow-sm bg-gray-50"
                                                >
                                                    <div className="flex items-center w-full">
                                                        <div className="w-10 h-10 bg-[#1346AC] text-white flex items-center justify-center rounded-full mr-3">
                                                            <i className="fas fa-file-alt"></i>
                                                        </div>
                                                        <div className="flex-grow truncate">
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
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        name="attachments"
                                        multiple
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div className='flex-col justify-between'>
                                <div className="mt-2 mb-8 flex items-center">
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

                                <button type="submit" className="w-1/3 bg-[#1346AC] text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-auto">
                                    Submit Report
                                </button>
                                </div>
                            </form>
                        </div>

                        {showTermsModal && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg w-full">
                                    {showTermsModal === 'terms' && (
                                        <IncidentReportTermsandConditions closeModal={closeModal} />
                                    )}
                                    {showTermsModal === 'privacy' && (
                                        <IncidentReportDataPrivAgreement closeModal={closeModal} />
                                    )}
                                </div>
                            </div>
                        )}


                        <div className="w-full lg:w-8/12 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between" style={{ minHeight: '600px' }}>
                            <div>
                                <div className="flex justify-between">
                                    <div className='flex-col col-auto justify-between'>
                                    <h2 className="text-2xl font-semibold mb-4">Incident Report History</h2>
                                    <div className="flex items-center mb-4">
                                    <div className="mr-2">
                                        <label htmlFor="Category" className="block text-sm font-medium text-gray-700">Complaint Type</label>
                                        <select
                                            name="category"
                                            value={filters.category}
                                            onChange={handleFilterChange}
                                            className="border border-gray-300 rounded-md p-2 w-48"
                                        >
                                            <option value="All">All</option>
                                            <option value="Utility Interruptions">Utility Interruptions</option>
                                            <option value="Noise Complaint">Noise Complaint</option>
                                            <option value="Public Disturbance">Public Disturbance</option>
                                            <option value="Waste Management">Waste Management</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    </div>
                                    <div className="mr-2">
                                        <label htmlFor="Status" className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            name="status"
                                            value={filters.status}
                                            onChange={handleFilterChange}
                                            className="border border-gray-300 rounded-md p-2 w-48"
                                        >
                                            <option value="All">All</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Resolved">Resolved</option>
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
                                    <div>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="border border-gray-300 rounded-md p-2 w-72"
                                    />
                                     <IncidentReportNestedDropdown
                                    handleSortChange={handleSortChange}
                                    selectedSortText={selectedSortText}
                                />
                                </div>
                                </div>
                                

                                {/* Display Incident History */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                    {currentReports.length > 0 ? (
                                        currentReports.map((report, index) => (
                                            <div
                                                key={index}
                                                className="bg-[#d1d5db] p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                            >
                                                <div
                                                    className={`w-fit px-5 py-1 rounded-full font-semibold text-white mb-4
                                                        ${report.status === 'Pending' ? 'bg-[#FFEA00] text-black' :
                                                            report.status === 'Resolved' ? 'bg-[#4D9669]' :
                                                            'bg-red-200'}`}
                                                >
                                                    {report.status}
                                                </div>
                                                <div className="flex items-center mb-4">
                                                    <div>
                                                        <h4 className="text-lg font-semibold">{report.typeofcomplaint}</h4>
                                                        <p className="text-md text-black font-semibold mt-2">{report.incidentdescription}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(report.dateAndTimeofIncident).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No incident reports found.</p>
                                    )}
                                </div>
                            </div>

                            {/* Pagination Section */}
                            <div className="flex justify-between items-center mt-auto">
                                <div className="text-sm text-gray-600">
                                    Showing {Math.min(indexOfLastReport, filteredReports.length)} of {filteredReports.length} entries
                                </div>

                                <div className="mt-4">
                                    {Array.from({ length: Math.ceil(filteredReports.length / reportsPerPage) }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => paginate(i + 1)}
                                            className={`px-3 py-1 mr-2 rounded ${currentPage === i + 1 ? 'bg-[#1346AC] text-white' : 'bg-gray-200 hover:bg-[#1346AC] hover:text-white'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        </div>
                </main>
            </div>
        </div>
    );
};

export default ResidentIncidentReport;
