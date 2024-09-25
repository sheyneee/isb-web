import React, { useState } from 'react';

const ResidentDocumentRequestModal = ({ documentRequest, onClose, onSave }) => {
    const [isEditMode, setIsEditMode] = useState(false);

    // State for editable form data
    const [formData, setFormData] = useState({
        documentType: documentRequest.documentType,
        otherDocumentType: '', // For 'Others' option
        purpose: documentRequest.purpose,
        otherPurpose: '', // For 'Others' option
        recipient: documentRequest.recipient,
        residentName: documentRequest.residentName,
        validID: documentRequest.ValidID || [], // Existing attachments (array of URLs/objects)
        newValidID: [], // New attachments to upload
        newValidIDDisplay: [], // To store displayed filenames of new uploads
        removedFiles: [], // Keep track of removed existing files
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle file upload changes for new files (added under the existing ones)
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const newDisplayFiles = newFiles.map((file) => ({
            name: file.name,
            type: file.type,
        }));
    
        setFormData((prevData) => ({
            ...prevData,
            newValidID: [...prevData.newValidID, ...newFiles], // Add new files to any existing ones
            newValidIDDisplay: [...prevData.newValidIDDisplay, ...newDisplayFiles], // Display newly added files
        }));
    };

    // Remove an existing attachment or newly added one
    const handleRemoveAttachment = (index, isNew = false) => {
        if (isNew) {
            // Remove newly added files
            const updatedNewValidID = formData.newValidID.filter((_, i) => i !== index);
            const updatedNewValidIDDisplay = formData.newValidIDDisplay.filter((_, i) => i !== index);
            setFormData({
                ...formData,
                newValidID: updatedNewValidID,
                newValidIDDisplay: updatedNewValidIDDisplay,
            });
        } else {
            // Add to removedFiles list and update validID list
            const removedFile = formData.validID[index];
            const updatedValidID = formData.validID.filter((_, i) => i !== index);
            setFormData((prevData) => ({
                ...prevData,
                validID: updatedValidID,
                removedFiles: [...prevData.removedFiles, removedFile], // Track the removed file
            }));
        }
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    // Save the form data, making sure to use the "Other" fields if applicable
    const handleSave = async () => {
        // Use otherDocumentType and otherPurpose if "Others" is selected
        const finalData = {
            ...formData,
            documentType: formData.documentType === 'Others' ? formData.otherDocumentType : formData.documentType,
            purpose: formData.purpose === 'Others' ? formData.otherPurpose : formData.purpose,
        };
    
        // Create FormData to send files if necessary
        const formDataToSend = new FormData();
        formDataToSend.append('documentType', finalData.documentType);
        formDataToSend.append('purpose', finalData.purpose);
        formDataToSend.append('recipient', finalData.recipient);
        formDataToSend.append('residentName', finalData.residentName);

        // Append the remaining valid IDs (i.e., those that are not removed)
        formData.validID.forEach((existingFile) => {
            formDataToSend.append('validID[]', JSON.stringify(existingFile)); // Keep the existing files
        });

        // Append new files (new valid IDs)
        formData.newValidID.forEach((file) => {
            formDataToSend.append('ValidID', file); // This must match the expected Multer field name in the backend
        });

        // Append the list of removed files so the backend can handle deletion
        formDataToSend.append('removedFiles', JSON.stringify(formData.removedFiles));

        // Send the formDataToSend (with files) to the parent component for backend saving
        onSave(formDataToSend); // Make sure your backend is expecting FormData
    
        // Close the modal
        onClose();
    };
    

    // Format date for display
    const formattedDate = new Date(documentRequest.created_at).toLocaleDateString();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 md:w-2/2 max-h-[80vh] scrollbar-thin overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4">{isEditMode ? 'Edit Document Request' : 'View Document Request'}</h2>
                <div className="text-left mb-4">
                    <p className="font-semibold">Reference No.</p>
                    <p>{documentRequest.ReferenceNo}</p>
                </div>
                <div className="text-left mb-4">
                    <p className="font-semibold">Date Requested</p>
                    <p>{formattedDate}</p>
                </div>

                {/* Document Type Section */}
                <div className="text-left mb-4">
                    <p className="font-semibold">Type</p>
                    {isEditMode ? (
                        <div>
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
                            {formData.documentType === 'Others' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Specify Other Document Type</label>
                                    <input
                                        type="text"
                                        name="otherDocumentType"
                                        value={formData.otherDocumentType}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter document type"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>{documentRequest.documentType}</p>
                    )}
                </div>

                {/* Purpose Section */}
                <div className="text-left mb-4">
                    <p className="font-semibold">Purpose</p>
                    {isEditMode ? (
                        <div>
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
                            {formData.purpose === 'Others' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Specify Other Purpose</label>
                                    <input
                                        type="text"
                                        name="otherPurpose"
                                        value={formData.otherPurpose}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter purpose"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>{documentRequest.purpose}</p>
                    )}
                </div>

                {/* Other Input Fields */}
                <div className="text-left mb-4">
                    <p className="font-semibold">Recipient</p>
                    {isEditMode ? (
                        <input
                            type="text"
                            name="recipient"
                            value={formData.recipient}
                            onChange={handleInputChange}
                            className="form-input mt-1 block w-full"
                        />
                    ) : (
                        <p>{documentRequest.recipient}</p>
                    )}
                </div>

                <div className="text-left mb-4">
                    <p className="font-semibold">Resident Name</p>
                    {isEditMode ? (
                        <input
                            type="text"
                            name="residentName"
                            value={formData.residentName}
                            onChange={handleInputChange}
                            className="form-input mt-1 block w-full"
                            disabled={true}
                        />
                    ) : (
                        <p>{documentRequest.residentName}</p>
                    )}
                </div>

                {/* Attachments */}
                <div className="text-left mb-4">
                    <p className="font-semibold">Valid ID</p>
                    <div className="flex flex-col space-y-2">
                        {formData.validID.length > 0 ? (
                            formData.validID.map((id, index) => (
                                <div key={index} className="relative flex items-center justify-between p-2 border rounded-lg shadow-sm bg-gray-50">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-[#1346AC] text-white flex items-center justify-center rounded-full mr-3">
                                            <i className="fas fa-file-pdf"></i> 
                                        </div>
                                        <div className="truncate max-w-xs">
                                            <a href={id.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline truncate">
                                                {id.originalname}
                                            </a>
                                            <p className="text-gray-500 text-xs">PDF</p>
                                        </div>
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
                            <div className="text-gray-500">No attachments available</div>
                        )}
                    </div>
                </div>
                
                {isEditMode && (
                    <div className="mt-2">
                        <div className="flex flex-col space-y-2 mt-2">
                            {formData.newValidIDDisplay.map((file, index) => (
                                <div key={index} className="relative flex items-center justify-between p-2 border rounded-lg shadow-sm bg-gray-50">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-[#1346AC] text-white flex items-center justify-center rounded-full mr-3">
                                            <i className="fas fa-file-pdf"></i> 
                                        </div>
                                        <div className="truncate max-w-xs">
                                            <span className="text-blue-600 font-semibold hover:underline truncate">
                                                {file.name}
                                            </span>
                                            <p className="text-gray-500 text-xs">{file.type === 'application/pdf' ? 'PDF' : 'Image'}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAttachment(index, true)}
                                        className="absolute right-0 top-0 text-black hover:text-red-600 mr-2"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input type="file" multiple onChange={handleFileChange} className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                )}

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
                            Edit Document Request
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

export default ResidentDocumentRequestModal;
