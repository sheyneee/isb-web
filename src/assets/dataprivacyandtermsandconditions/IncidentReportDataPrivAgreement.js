import React from 'react';

const IncidentReportDataPrivAgreement = ({ closeModal }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Data Privacy Agreement</h2>
            <p>
                This is your data privacy agreement content. You can add the actual terms here regarding how the data 
                will be used, stored, and shared.
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

export default IncidentReportDataPrivAgreement;
