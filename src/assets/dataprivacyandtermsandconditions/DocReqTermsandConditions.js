import React from 'react';

const DocReqTermsandConditions = () => {
    return (
        <div className="overflow-y-auto max-h-96 mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">Terms and Conditions</h2>
            <p className="m-2 text-start">
                These Terms and Conditions govern the use of our services for document requests.
            </p>
            <p><strong>1. Acceptance:</strong> By submitting a document request, you agree to comply with and be bound by these terms.</p>
            <ul className="list-disc list-inside ml-4">
                <li>You are responsible for the accuracy of the information provided.</li>
                <li>Document requests are subject to approval and may be rejected if incomplete.</li>
            </ul>
            <p><strong>2. Document Processing:</strong> We will make every effort to process your request in a timely manner.</p>
            <p><strong>3. Changes:</strong> We reserve the right to modify these terms at any time without prior notice.</p>
            <p>By continuing to use our services, you agree to these updated terms.</p>
        </div>
    );
};

export default DocReqTermsandConditions;
