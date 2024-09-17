import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DashboardCards = () => {
    const [stats, setStats] = useState({
        totalPopulation: 0,
        totalVoters: 0,
        totalIndigent: 0,
        totalPWDs: 0,
        totalSeniorCitizens: 0,
        totalSoloParents: 0,
        total4Ps: 0,
    });

    // Fetch data from the backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/all/barangays'); 
                
                // Assuming response.data.barangays is an array and you need the first barangay's data
                if (response.data.barangays && response.data.barangays.length > 0) {
                    const barangayStats = response.data.barangays[0];
                    setStats({
                        totalPopulation: barangayStats.population,
                        totalVoters: barangayStats.totalvoters,
                        totalIndigent: barangayStats.totalindigent,
                        totalPWDs: barangayStats.totalpwd,
                        totalSeniorCitizens: barangayStats.totalseniorcitizen,
                        totalSoloParents: barangayStats.totalsoloparent,
                        total4Ps: barangayStats.total4psbeneficiary,
                    });
                }
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching dashboard statistics:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                <h2 className="text-lg">Pending Incident Reports</h2>
                <p className="text-2xl font-semibold">0</p>
            </div>
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                <h2 className="text-lg">Pending Document Requests</h2>
                <p className="text-2xl font-semibold">0</p>
            </div>
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                <h2 className="text-lg">Pending Resident Verification</h2>
                <p className="text-2xl font-semibold">0</p>
            </div>
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                <h2 className="text-lg">Pending Profile Update Requests</h2>
                <p className="text-2xl font-semibold">0</p>
            </div>
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                <h2 className="text-lg">Total Population</h2>
                <p className="text-2xl font-semibold">{stats.totalPopulation}</p>
            </div>
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                <h2 className="text-lg">Total Voters</h2>
                <p className="text-2xl font-semibold">{stats.totalVoters}</p>
            </div>
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                <h2 className="text-lg">Total Indigent</h2>
                <p className="text-2xl font-semibold">{stats.totalIndigent}</p>
            </div>
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                <h2 className="text-lg">Total PWDs</h2>
                <p className="text-2xl font-semibold">{stats.totalPWDs}</p>
            </div>
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                <h2 className="text-lg">Total Senior Citizens</h2>
                <p className="text-2xl font-semibold">{stats.totalSeniorCitizens}</p>
            </div>
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                <h2 className="text-lg">Total Solo Parents</h2>
                <p className="text-2xl font-semibold">{stats.totalSoloParents}</p>
            </div>
            <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                <h2 className="text-lg">Total 4Ps Beneficiaries</h2>
                <p className="text-2xl font-semibold">{stats.total4Ps}</p>
            </div>
        </div>
    );
}

export default DashboardCards;
