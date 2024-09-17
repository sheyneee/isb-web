import React from 'react';

const Religions = ({ selectedReligion, handleChange }) => {
    const religions = [
        { label: 'Select your religion', value: '' },
        { label: 'Roman Catholic', value: 'Roman Catholic' },
        { label: 'Protestant', value: 'Protestant' },
        { label: 'Evangelical Christianity', value: 'Evangelical Christianity' },
        { label: 'Iglesia ni Cristo', value: 'Iglesia ni Cristo' },
        { label: 'Aglipayan Church', value: 'Aglipayan Church' },
        { label: 'Buddhism', value: 'Buddhism' },
        { label: 'Hinduism', value: 'Hinduism' },
        { label: 'Orthodox Christianity', value: 'Orthodox Christianity' },
        { label: 'Seventh-day Adventist', value: 'Seventh-day Adventist' },
        { label: 'Latter-day Saints', value: 'Latter-day Saints' },
        { label: 'Islam', value: 'Islam' },
        { label: 'Christian Churches', value: 'Christian Churches' },
        { label: "Baha'i Faith", value: "Baha'i Faith" },
        { label: 'Atheism/Agnosticism', value: 'Atheism/Agnosticism' },
        { label: 'Indigenous/Ancestral Religions', value: 'Indigenous Religions' },
    ];

    return (
        <div>
            <label className="block text-md font-medium text-gray-700">Religion</label>
            <select
                name="religion"
                value={selectedReligion}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            >
                {religions.map((religion) => (
                    <option key={religion.value} value={religion.value}>
                        {religion.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Religions;
