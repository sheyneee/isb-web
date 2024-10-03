import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';

const AdminPhotoUpload = ({ profilepic, handleClear, handleSubmit, setFormData, clearPhoto }) => {
    const [localProfilePic, setLocalProfilePic] = useState(profilepic || null); // Initialize with profilepic from parent
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showError, setShowError] = useState(false);

    // Sync localProfilePic with parent's profilepic
    useEffect(() => {
        setLocalProfilePic(profilepic);  // Update localProfilePic when parent profilepic changes
    }, [profilepic]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLocalProfilePic(file); // Set the selected file in local state
            setFormData(prevFormData => ({ ...prevFormData, profilepic: file })); // Update formData in parent
        }
    };

    const handleClearPhoto = () => {
        setLocalProfilePic(null); // Clear local state
        clearPhoto(); // Clear the photo in the parent
    };

    const handleFormSubmit = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (termsAccepted) {
            setShowError(false);
            handleSubmit(); 
        } else {
            setShowError(true); 
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mt-2" style={{ marginBottom: 490, marginTop: 5 }}>
                <div>
                    {/* Display the selected photo or a placeholder */}
                    {localProfilePic ? (
                        <img
                            src={URL.createObjectURL(localProfilePic)}
                            alt="Profile"
                            className="w-60 h-60 rounded-full bg-gray-300"
                        />
                    ) : (
                        <img
                            src={'path_to_placeholder_image'}
                            alt=""
                            className="w-60 h-60 rounded-full bg-gray-300"
                        />
                    )}
                    <label className="bg-[#1346AC] text-white w-full px-10 py-2 rounded-full mt-2 font-semibold flex items-center justify-center cursor-pointer">
                        <FaCamera className="mr-2" /> Add Photo
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                </div>
            </div>
            <button
                type="button"
                onClick={handleClearPhoto}
                className="bg-gray-500 text-white w-full px-4 py-2 rounded-full font-semibold mb-2 mt-2"
            >
                Clear
            </button>
            <button
                type="button"
                onClick={(e) => handleFormSubmit(e)}
                className={`bg-[#1346AC] text-white w-full px-4 py-2 rounded-full font-semibold mb-2 mt-2 ${termsAccepted ? '' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!termsAccepted}
            >
                Register    
            </button>
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
                {showError && (
                <p className="text-red-500 text-sm">
                    You must agree to the Terms and Conditions
                </p>
            )}
            </div>

            {showTermsModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Terms and Conditions</h2>
                        <div className="overflow-y-auto max-h-96 mb-4">
                            <p>1. <strong>Acceptance of Terms:</strong> By using the document request feature...</p>
                            <p>2. <strong>Eligibility:</strong> You must be a registered user...</p>
                        </div>
                        <button
                            onClick={() => setShowTermsModal(false)}
                            className="bg-[#1346AC] text-white w-full px-4 py-2 rounded-full font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPhotoUpload;
