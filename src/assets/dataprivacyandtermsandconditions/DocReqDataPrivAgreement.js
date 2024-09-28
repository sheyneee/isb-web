import React from 'react';

const DocReqDataPrivAgreement = ({ closeModal }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 md:w-2/2 max-h-[80vh] scrollbar-thin overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">Data Privacy Agreement</h2>
        <div className="overflow-y-auto max-h-96 mb-4">
          <p className="m-2 text-start">
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
          onClick={closeModal}
          className="bg-[#1346AC] text-white w-full px-4 py-2 rounded-full font-semibold hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DocReqDataPrivAgreement;
