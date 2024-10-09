import React, { useState } from 'react';
import Swal from 'sweetalert2';

const ResidentIncidentReportModal = ({ incidentReport, onClose, onSave }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [complainantsInput, setComplainantsInput] = useState('');
    const [respondentsInput, setRespondentsInput] = useState('');
    const [errorMessage, setErrorMessage] = useState({ complainant: '', respondent: '' });

    const [formData, setFormData] = useState({
        typeofcomplaint: incidentReport.typeofcomplaint,
        otherComplaintType: '',
        incidentdescription: incidentReport.incidentdescription,
        relieftobegranted: incidentReport.relieftobegranted,
        respondentname: incidentReport.respondentname || [],
        complainantname: incidentReport.complainantname || [],
        dateAndTimeofIncident: incidentReport.dateAndTimeofIncident,
        attachments: incidentReport.Attachment || [],
        newAttachments: [],
        removedAttachments: [],
        removedComplainants: [], // Ensure this is initialized as an empty array
        removedRespondents: [],  // Ensure this is initialized as an empty array
    });
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFormData((prevData) => ({
            ...prevData,
            newAttachments: [...prevData.newAttachments, ...newFiles],
        }));
    };

    const handleRemoveAttachment = (index, isNew = false) => {
        if (isNew) {
            setFormData((prevData) => ({
                ...prevData,
                newAttachments: prevData.newAttachments.filter((_, i) => i !== index),
            }));
        } else {
            const removedFile = formData.attachments[index];
            setFormData((prevData) => ({
                ...prevData,
                attachments: prevData.attachments.filter((_, i) => i !== index),
                removedAttachments: [...prevData.removedAttachments, removedFile],
            }));
        }
    };

    const handleRemoveComplainant = (name, isNew = false) => {
        setFormData(prev => ({
            ...prev,
            complainantname: prev.complainantname.filter((existingName) => existingName !== name)
        }));
    };

    const handleRemoveRespondent = (name, isNew = false) => {
        setFormData(prev => ({
            ...prev,
            respondentname: prev.respondentname.filter((existingName) => existingName !== name)
        }));
    };
    
    const handleAddComplainant = () => {
        if (complainantsInput.trim()) {
            // Split input by commas, trim each name, and filter out empty strings
            const newComplainants = complainantsInput
                .split(',')
                .map((name) => name.trim())
                .filter((name) => name);
    
            setFormData(prev => ({
                ...prev,
                complainantname: [...prev.complainantname, ...newComplainants]
            }));
            setComplainantsInput(''); 
        }
    };
    
    const handleAddRespondent = () => {
        if (respondentsInput.trim()) {
            const newRespondents = respondentsInput
                .split(',')
                .map((name) => name.trim())
                .filter((name) => name);
    
            setFormData(prev => ({
                ...prev,
                respondentname: [...prev.respondentname, ...newRespondents]
            }));
            setRespondentsInput(''); 
        }
    };
    

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const handleSave = async () => {
        const finalData = {
            ...formData,
            typeofcomplaint: formData.typeofcomplaint === 'Others' ? formData.otherComplaintType : formData.typeofcomplaint,
        };
        
        if (finalData.attachments.length === 0 && finalData.newAttachments.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Evidence',
                text: 'At least one evidence is required.',
                confirmButtonColor: '#1346AC',
            });
            return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append('typeofcomplaint', finalData.typeofcomplaint);
        formDataToSend.append('incidentdescription', finalData.incidentdescription);
        formDataToSend.append('relieftobegranted', finalData.relieftobegranted);
        formDataToSend.append('dateAndTimeofIncident', finalData.dateAndTimeofIncident);
        
        // Append complainants and respondents as JSON strings
        formDataToSend.append('complainantname', JSON.stringify(finalData.complainantname));
        formDataToSend.append('respondentname', JSON.stringify(finalData.respondentname));
    
        // Append new files (new attachments)
        finalData.newAttachments.forEach((file) => {
            formDataToSend.append('attachments', file);
        });
    
        // Append the list of removed attachment URLs for backend processing
        formDataToSend.append('removedAttachments', JSON.stringify(finalData.removedAttachments));
    
        // Call the onSave function with the prepared FormData
        onSave(formDataToSend);
        onClose();
    };    
    
    const formattedDate = new Date(incidentReport.dateAndTimeofIncident).toLocaleDateString();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 md:w-2/2 max-h-[80vh] scrollbar-thin overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4">{isEditMode ? 'Edit Incident Report' : 'View Incident Report'}</h2>
                <div className="text-left mb-4">
                    <p className="font-semibold">Reference No.</p>
                    <p>{incidentReport.ReferenceNo}</p>
                </div>
                <div className="text-left mb-4">
                    <p className="font-semibold">Date of Incident</p>
                    <p>{formattedDate}</p>
                </div>

                  {/* Complainant Names */}
                <div className="text-left mb-4">
                    <p className="font-semibold">Complainant(s)</p>
                    <ul className="list-decimal list-inside">
                        {formData.complainantname.map((name, index) => (
                            <li key={index} className={`mt-1 ${formData.removedComplainants.includes(name) ? 'line-through text-gray-500' : ''}`}>
                                {name}
                                {isEditMode && (
                                    <button type="button" className="ml-2 text-red-500" onClick={() => handleRemoveComplainant(name)}>
                                        Remove
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                    {isEditMode && (
                        <div className="flex space-x-2 mt-2">
                            <input
                                type="text"
                                value={complainantsInput}
                                placeholder="Add complainant"
                                className="p-2 border rounded flex-grow"
                                onChange={(e) => setComplainantsInput(e.target.value)}
                            />
                            <button type="button" className="bg-[#1346AC] text-white px-4 py-2 rounded" onClick={handleAddComplainant}>
                                Enter
                            </button>
                        </div>
                    )}
                    {errorMessage.complainant && <p className="text-red-500 text-sm mt-2">{errorMessage.complainant}</p>}
                </div>
   
                {/* Respondent Names */}
                <div className="text-left mb-4">
                    <p className="font-semibold">Respondent(s)</p>
                    <ul className="list-decimal list-inside">
                        {formData.respondentname.map((name, index) => (
                            <li key={index} className={`mt-1 ${formData.removedRespondents.includes(name) ? 'line-through text-gray-500' : ''}`}>
                                {name}
                                {isEditMode && (
                                    <button type="button" className="ml-2 text-red-500" onClick={() => handleRemoveRespondent(name)}>
                                        Remove
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                    {isEditMode && (
                        <div className="flex space-x-2 mt-2">
                            <input
                                type="text"
                                value={respondentsInput}
                                placeholder="Add respondent"
                                className="p-2 border rounded flex-grow"
                                onChange={(e) => setRespondentsInput(e.target.value)}
                            />
                            <button type="button" className="bg-[#1346AC] text-white px-4 py-2 rounded" onClick={handleAddRespondent}>
                                Enter
                            </button>
                        </div>
                    )}
                    {errorMessage.respondent && <p className="text-red-500 text-sm mt-2">{errorMessage.respondent}</p>}
                </div>

                {/* Type of Complaint */}
                <div className="text-left mb-4">
                    <p className="font-semibold">Type of Complaint</p>
                    {isEditMode ? (
                        <div>
                            <select
                                name="typeofcomplaint"
                                value={formData.typeofcomplaint}
                                onChange={handleInputChange}
                                className="form-select mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Type of Complaint</option>
                                <option value="Utility Interruptions">Utility Interruptions</option>
                                <option value="Noise Complaint">Noise Complaint</option>
                                <option value="Public Disturbance">Public Disturbance</option>
                                <option value="Waste Management">Waste Management</option>
                                <option value="Others">Others</option>
                            </select>
                            {formData.typeofcomplaint === 'Others' && (
                                <input
                                    type="text"
                                    name="otherComplaintType"
                                    value={formData.otherComplaintType}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                    placeholder="Specify other complaint type"
                                />
                            )}
                        </div>
                    ) : (
                        <p>{incidentReport.typeofcomplaint}</p>
                    )}
                </div>

                {/* Incident Description */}
                <div className="text-left mb-4">
                    <p className="font-semibold">Incident Description</p>
                    {isEditMode ? (
                        <textarea
                            name="incidentdescription"
                            value={formData.incidentdescription}
                            onChange={handleInputChange}
                            className="form-input mt-1 block w-full"
                        ></textarea>
                    ) : (
                        <p>{incidentReport.incidentdescription}</p>
                    )}
                </div>

                {/* Relief to Be Granted */}
                <div className="text-left mb-4">
                    <p className="font-semibold">Relief to Be Granted</p>
                    {isEditMode ? (
                        <textarea
                            name="relieftobegranted"
                            value={formData.relieftobegranted}
                            onChange={handleInputChange}
                            className="form-input mt-1 block w-full"
                        ></textarea>
                    ) : (
                        <p>{incidentReport.relieftobegranted}</p>
                    )}
                </div>

                {/* Attachments */}
                <div className="text-left mb-4">
                    <p className="font-semibold">Attachments</p>
                    <div className="flex flex-col space-y-2">
                        {formData.attachments.length > 0 ? (
                            formData.attachments.map((attachment, index) => (
                                <div key={index} className="relative flex items-center justify-between p-2 border rounded-lg shadow-sm bg-gray-50">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-[#1346AC] text-white flex items-center justify-center rounded-full mr-3">
                                            <i className="fas fa-file-alt"></i>
                                        </div>
                                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline truncate">
                                            {attachment.originalname}
                                        </a>
                                    </div>
                                    {isEditMode && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAttachment(index)}
                                            className="absolute right-0 top-0 text-black hover:text-red-600 mr-2"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No attachments available</p>
                        )}
                    </div>
                    {isEditMode && (
                        <div className="mt-2">
                            <input type="file" multiple onChange={handleFileChange} className="form-input mt-1 block w-full" name="attachments" />
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col space-y-2 text-center mt-6">
                    {isEditMode ? (
                        <>
                            <button onClick={handleSave} className="bg-[#1346AC] text-white px-4 py-2 rounded-full font-semibold">
                                Save Changes
                            </button>
                            <button onClick={onClose} className="bg-[#1346AC] text-white px-4 py-2 rounded-full font-semibold">
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button onClick={toggleEditMode} className="bg-[#1346AC] text-white px-4 py-2 rounded-full font-semibold">
                            Edit Incident Report
                        </button>
                    )}
                    <button className="bg-[#1346AC] text-white px-4 py-2 rounded-full font-semibold mt-2">Message Barangay Official</button>
                    <button onClick={onClose} className="bg-white text-[#1346AC] border border-[#1346AC] px-4 py-2 rounded-full font-semibold mt-2">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResidentIncidentReportModal;
