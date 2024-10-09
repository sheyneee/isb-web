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
        complainantname: [],
        respondentname:[],
        typeofcomplaint: '',
        otherComplaintType: '', 
        incidentdescription: '',
        relieftobegranted:'',
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
    const [complainantsInput, setComplainantsInput] = useState('');
    const [respondentsInput, setRespondentsInput] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setResidentData(user);
            setUserName(`${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '.' : ''} ${user.lastName}`);
            setUserRole(user.roleinHousehold);
            setFormData((prevData) => ({
                ...prevData,
                complainantID: user._id, 
                complainantname: [`${user.firstName} ${user.middleName ? user.middleName.charAt(0) + '.' : ''} ${user.lastName}`] 
            }));
            
            // Fetch history once resident data is set
            fetchIncidentHistory(user._id); 
        }
    }, []);

    const handleAddComplainant = () => {
        if (complainantsInput) {
            setFormData(prev => ({
                ...prev,
                complainantname: [...prev.complainantname, complainantsInput]
            }));
            setComplainantsInput(''); // Clear input after adding
        }
    };

    const handleAddRespondent = () => {
        if (respondentsInput) {
            setFormData(prev => ({
                ...prev,
                respondentname: [...prev.respondentname, respondentsInput]
            }));
            setRespondentsInput(''); // Clear input after adding
        }
    };


    const fetchIncidentHistory = async (userId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/incident-reports/history/${userId}`);
            if (response.data) {
                console.log('Fetched incident history:', response.data);
    
                // Compute daysUntilDeletion for archived reports
                const reportsWithDeletionInfo = response.data.map((report) => {
                    if (report.status === 'Archived' && report.archived_at) {
                        const archivedAt = new Date(report.archived_at);
                        const ninetyDaysAfter = new Date(archivedAt);
                        ninetyDaysAfter.setDate(archivedAt.getDate() + 90);
    
                        const daysUntilDeletion = Math.ceil(
                            (ninetyDaysAfter - new Date()) / (1000 * 60 * 60 * 24)
                        );
    
                        return {
                            ...report,
                            daysUntilDeletion: daysUntilDeletion > 0 ? daysUntilDeletion : 0,
                        };
                    }
                    return report;
                });
    
                setIncidentReports(reportsWithDeletionInfo);
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
const filteredReports = incidentReports.filter((report) => {
    const predefinedCategories = ['Utility Interruptions', 'Noise Complaint', 'Public Disturbance', 'Waste Management'];

    // Check if the report matches the selected category
    const matchesCategory =
        filters.category === 'All' ||
        (filters.category === 'Others' && !predefinedCategories.includes(report.typeofcomplaint)) ||
        (filters.category !== 'Others' && report.typeofcomplaint === filters.category);

    // Check if the report matches the selected status
    const matchesStatus =
        filters.status === 'All'
            ? report.status !== 'Archived' // Exclude 'Archived' reports when 'All' is selected
            : report.status === filters.status;

    // Check if the report matches the search term
    const matchesSearch =
        report.typeofcomplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'video/mp4', 'video/mov', 'video/avi', 'video/mkv'];
        const maxFileSize = 10 * 1024 * 1024; // 10 MB size limit per file
    
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
        if (!formData.relieftobegranted) {
            newErrors.relieftobegranted = 'Prayer for Relief is required';
        }

        if (formData.respondentname.length === 0) {
            newErrors.respondentname = 'At least one respondent is required';
        }
        
        // Validate attachments
        if (formData.attachments.length === 0) {
            newErrors.attachments = 'Supporting evidence is required';
        } else {
            formData.attachments.forEach((file, index) => {
                if (!allowedFileTypes.includes(file.type)) {
                    newErrors.attachments = `File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`;
                }
                if (file.size > maxFileSize) {
                    newErrors.attachments = `File size should not exceed ${maxFileSize / (1024 * 1024)} MB`;
                }
            });
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validate the form data before proceeding
        if (!validateForm()) {
            return;
        }
    
        // Ensure terms are accepted before proceeding
        if (!termsAccepted) {
            setShowError(true);
            return;
        }
    
        // Display a loading state while the submission is in progress
        Swal.fire({
            title: 'Submitting...',
            text: 'Please wait while we submit your incident report.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        // Create form data for sending to the server
        const formDataToSend = new FormData();
        formDataToSend.append('complainantID', formData.complainantID);
        formDataToSend.append('complainantByType', formData.complainantByType);
        formDataToSend.append('complainantname', JSON.stringify(formData.complainantname));
        formDataToSend.append('respondentname', JSON.stringify(formData.respondentname));
        formDataToSend.append('typeofcomplaint', formData.typeofcomplaint === 'Others' ? formData.otherComplaintType : formData.typeofcomplaint);
        formDataToSend.append('incidentdescription', formData.incidentdescription);
        formDataToSend.append('dateAndTimeofIncident', formData.dateAndTimeofIncident);
        formDataToSend.append('relieftobegranted', formData.relieftobegranted);
    
        // Append each file in the attachments array
        if (formData.attachments.length > 0) {
            formData.attachments.forEach((file) => {
                formDataToSend.append('attachments', file);
            });
        }
    
        try {
            // Make the API request to submit the form data
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/new/incident-report`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Extract ReferenceNo from the response (assuming the API returns it)
            const referenceNo = response.data?.referenceNo;

            Swal.fire({
                icon: 'success',
                title: 'Report Submitted',
                text: `Your incident report has been successfully submitted. Your Reference No. is: ${referenceNo}`,
                confirmButtonText: 'OK'
            });
    
            // Reset the form data after submission
            setFormData({
                complainantID: formData.complainantID,
                complainantByType: 'Resident',
                complainantname: formData.complainantname,
                respondentname: [],
                typeofcomplaint: '',
                otherComplaintType: '',
                incidentdescription: '',
                relieftobegranted: '',
                dateAndTimeofIncident: '',
                attachments: []
            });
    
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
    
            // Fetch updated incident history without page reload
            await fetchIncidentHistory(formData.complainantID);
    
        } catch (error) {
            // Log the error and display an error message
            console.error('Error submitting incident report:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.response?.data?.message || 'An error occurred while submitting your report. Please try again.'
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
                        
                        <div className="w-full lg:w-6/12 bg-white p-6 rounded-lg shadow-md flex flex-col justify-evenly" style={{ minHeight: '530px' }}>
                        <h2 className="text-2xl font-semibold mb-4">Create Complaint</h2>
                            <form className="flex flex-col flex-grow" onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-md font-medium text-gray-700">Nature of Complaint <span className="text-gray-500">(Usapin Ukol)</span></label>
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

                                <div className="mb-4">
                                    <label className="block text-md font-medium text-gray-700">Complainant(s) <span className="text-gray-500">(Mga Nagrereklamo)</span>
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={complainantsInput}
                                            onChange={(e) => setComplainantsInput(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            placeholder="Enter complainant's name"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddComplainant}
                                            className="bg-[#1346AC] text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        >
                                            Enter
                                        </button>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        {formData.complainantname.map((name, index) => (
                                            <li key={index} className="text-gray-700">{name}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Respondent Names */}
                                <div className="mb-4">
                                    <label className="block text-md font-medium text-gray-700">Respondent(s) <span className="text-gray-500">(Mga Inirereklamo)</span></label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={respondentsInput}
                                            onChange={(e) => setRespondentsInput(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            placeholder="Enter respondent's name"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddRespondent}
                                            className="bg-[#1346AC] text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        >
                                            Enter
                                        </button>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        {formData.respondentname.map((name, index) => (
                                            <li key={index} className="text-gray-700">{name}</li>
                                        ))}
                                    </ul>
                                    {errors.respondentname && <p className="text-red-500 text-xs">{errors.respondentname}</p>}
                                </div>

                                {/* Incident Description */}
                                <div className="mb-4">
                                    <label className="block text-md font-medium text-gray-700">Statement of Complaint  <span className="text-gray-500">(Pahayag ng Reklamo)</span></label>
                                    <textarea
                                        name="incidentdescription"
                                        value={formData.incidentdescription}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    ></textarea>
                                    {errors.incidentdescription && <p className="text-red-500 text-xs">{errors.incidentdescription}</p>}
                                </div>

                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-700">Prayer for Relief <span className="text-gray-500">(Pahiling ng Kalunusan)</span></label>
                                <textarea
                                    name="relieftobegranted"
                                    value={formData.relieftobegranted}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                ></textarea>
                                {errors.relieftobegranted && <p className="text-red-500 text-xs">{errors.relieftobegranted}</p>}
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
                                    <label className="block text-md font-medium text-gray-700">Supporting Evidence</label>
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
                                    {errors.attachments && <p className="text-red-500 text-xs">{errors.attachments}</p>}
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
                                <div className='flex-1 justify-between items-center h-full'>
                                <button type="submit" className="w-1/3 bg-[#1346AC] text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-auto">
                                    Submit Report
                                </button>
                                </div>
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

                        <div className="w-full lg:w-8/12 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between" style={{ minHeight: '600px', maxHeight:'650px' }}>
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
                                            <option value="Active">Active</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Verified">Verified</option>
                                            <option value="Settled">Settled</option>
                                            <option value="Archived">Archived</option>
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
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                {currentReports.length > 0 ? (
                                    currentReports.map((report, index) => (
                                        <div
                                            key={index}
                                            className="bg-[#d1d5db] p-4 rounded shadow-md hover:bg-[#c3c6cc] hover:shadow-lg transition-shadow cursor-pointer"
                                        >
                                            <div
                                                className={`w-fit px-5 py-1 rounded-full font-semibold mb-4
                                                    ${report.remarks ? 'bg-red-500 text-white' :
                                                    report.status === 'Pending' ? 'bg-[#FFEA00] text-black' :
                                                    report.status === 'Active' ? 'bg-[#5C80FF] text-white' :
                                                    report.status === 'Processing' ? 'bg-[#FF8C00] text-white' :
                                                    report.status === 'Verified' ? 'bg-[#00BFFF] text-white' :
                                                    report.status === 'Settled' ? 'bg-[#4D9669] text-white' :
                                                    report.status === 'Archived' ? 'bg-[#ff2c2c] text-white' :
                                                    'bg-red-200 text-black'}`}
                                            >
                                                {report.remarks ? 'With Remarks' : report.status}
                                            </div>
                                            <div className="flex items-center mb-4">
                                                <div>
                                                    <h4 className="text-lg font-semibold truncate">{report.typeofcomplaint}</h4>
                                                    <p className="text-md text-black font-semibold mt-2 truncate">{report.incidentdescription}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(report.dateAndTimeofIncident).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            {report.status === 'Archived' && report.daysUntilDeletion !== undefined && (
                                                <p className="text-red-500 text-sm mt-2">
                                                    This report will be deleted in {report.daysUntilDeletion} days.
                                                </p>
                                            )}
                                            {report.status === 'Archived' && report.daysUntilDeletion <= 0 && (
                                                <p className="text-red-500 text-sm mt-2">
                                                    This report is scheduled for deletion.
                                                </p>
                                            )}
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
