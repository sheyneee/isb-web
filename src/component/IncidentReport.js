import React from 'react';

const IncidentReport = () => {
    return (
        <div className="bg-white p-8 rounded shadow" style={{height:395}}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Incident Reports</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    View Incident Reports
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Date Requested</th>
                            <th className="py-2 px-4 border-b text-left">Type</th>
                            <th className="py-2 px-4 border-b text-left">Complainant Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2 px-4 border-b border-r">01/12/2024</td>
                            <td className="py-2 px-4 border-b border-r">Utility Interruption</td>
                            <td className="py-2 px-4 border-b">Euclid Lozada Quemada</td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4 border-b border-r">05/23/2024</td>
                            <td className="py-2 px-4 border-b border-r">Noise Complaint</td>
                            <td className="py-2 px-4 border-b">Katrina Mazo Juan</td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4 border-b border-r">07/04/2024</td>
                            <td className="py-2 px-4 border-b border-r">Public Disturbance</td>
                            <td className="py-2 px-4 border-b">Sheyne Duque Dela Cruz</td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4 border-b border-r">08/15/2024</td>
                            <td className="py-2 px-4 border-b border-r">Crime Incident</td>
                            <td className="py-2 px-4 border-b">Gineden Yunice Pineda Gumban</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncidentReport;
