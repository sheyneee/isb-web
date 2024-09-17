import React from 'react';

const ViewDocumentRequestModal = ({ onClose, documentRequest }) => {

    // Close the modal when clicking on the background
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto" onClick={handleBackgroundClick}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 md:w-2/2 max-h-[80vh] scrollbar-thin overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4">View Document Request</h2>

                <div className="text-left mb-4">
                    <p className="font-semibold">Date Requested</p>
                    <p>{new Date(documentRequest.created_at).toLocaleDateString()}</p>
                </div>

                <div className="text-left mb-4">
                    <p className="font-semibold">Reference No.</p>
                    <p>{documentRequest.ReferenceNo}</p>
                </div>

                <div className="text-left mb-4">
                    <p className="font-semibold">Type</p>
                    <p>{documentRequest.documentType}</p>
                </div>

                <div className="text-left mb-4">
                    <p className="font-semibold">Purpose</p>
                    <p>{documentRequest.purpose}</p>
                </div>

                <div className="text-left mb-4">
                    <p className="font-semibold">Status</p>
                    <p>{documentRequest.remarks ? "With Remarks" : documentRequest.status}</p>
                </div>

                <div className="text-left mb-4">
                    <p className="font-semibold">Resident Name</p>
                    <p>{documentRequest.residentName}</p>
                </div>

                <div className="text-left mb-4">
                    <p className="font-semibold">Recipient</p>
                    <p>{documentRequest.recipient}</p>
                </div>

                <div className="text-left mb-4">
                    <p className="font-semibold">Attachments</p>
                    <div className="flex space-x-2">
                        {documentRequest.ValidID.map((id, index) => (
                            <img
                                key={index}
                                src={id.url}
                                alt="Attachment"
                                className="w-25 h-20 object-contain"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col space-y-2 text-center">
                    <button className="bg-[#1346AC] text-white px-4 py-2 rounded-full font-semibold text-center">
                        Generate Document
                    </button>
                    <button className="bg-[#1346AC] text-white px-4 py-2 rounded-full font-semibold text-center">
                        Message Resident
                    </button>
                    <button
                        className="bg-white text-[#1346AC] border border-[#1346AC] px-4 py-2 rounded-full font-semibold text-center"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewDocumentRequestModal;
