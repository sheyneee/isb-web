import React from 'react';

const Occupation = ({ selectedOccupation, handleChange }) => {
    const occupationStatuses = [
        { label: 'Select your occupation status', value: '' },
        { label: 'Employed', value: 'Employed' },
        { label: 'Unemployed', value: 'Unemployed' },
        { label: 'Self-Employed', value: 'Self-Employed' },
        { label: 'Freelancer', value: 'Freelancer' },
        { label: 'Student', value: 'Student' },
        { label: 'Retired', value: 'Retired' },
        { label: 'Homemaker', value: 'Homemaker' },
        { label: 'Overseas Filipino Worker (OFW)', value: 'OFW' },
    ];

    return (
        <div>
            <label className="block text-md font-medium text-gray-700">Occupation</label>
            <select
                name="occupation"
                value={selectedOccupation}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            >
                {occupationStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                        {status.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Occupation;
