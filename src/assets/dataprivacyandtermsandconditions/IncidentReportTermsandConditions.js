import React from 'react';

const IncidentReportTermsandConditions = ({ closeModal }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
            <p>
                Here you can add the specific terms and conditions regarding filing an incident report. These terms 
                can explain the process, responsibility, and legalities related to submitting an incident report.
            </p>
            <button 
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={closeModal}
            >
                Close
            </button>
        </div>
    );
};

export default IncidentReportTermsandConditions;
