import React from 'react';
import { Link } from 'react-router-dom';
import dashboardIcon from '../assets/icons/dashboard.png';
import barangayProfilingIcon from '../assets/icons/barangay-profiling.png';
import residentManagementIcon from '../assets/icons/resident-management.png';
import announcementsIcon from '../assets/icons/announcements.png';
import messagesIcon from '../assets/icons/messages.png';
import incidentReportIcon from '../assets/icons/incident-report.png';
import documentRequestIcon from '../assets/icons/document-request.png';
import barangayInfoIcon from '../assets/icons/information.png';
import settingsIcon from '../assets/icons/settings.png';
import {MdMap} from "react-icons/md";

const Navigation = ({ adminData, getCurrentDate }) => {
    return (
        <nav className="w-65 bg-gray-100 text-black flex flex-col justify-between p-4 shadow">
            <div>
                <h2 className="mb-5 ml-2 mt-2 font-bold text-xl">GENERAL</h2>
                <ul className="space-y-2">
                    <li>
                        <Link to={{ pathname: "/home", state: { adminData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded ">
                            <img src={dashboardIcon} alt="Dashboard" className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={{ pathname: "/BarangayProfiling", state: { adminData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded">
                            <img src={barangayProfilingIcon} alt="Barangay Profiling" className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Barangay Profiling</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={{ pathname: "/ResidentManagement", state: { adminData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded">
                            <img src={residentManagementIcon} alt="Resident Management" className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg leading-tight">Resident and<br />Household Management</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={{ pathname: "/Announcement", state: { adminData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded">
                            <img src={announcementsIcon} alt="Announcements" className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Announcements</span>
                        </Link>
                    </li>
                    <li>
                        <a href="#messages" className="flex items-center p-4 text-black hover:bg-[#1346AC]">
                            <img src={messagesIcon} alt="Messages" className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Messages</span>
                        </a>
                    </li>
                    <li>
                        <a href="#incident-report" className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded">
                            <img src={incidentReportIcon} alt="Incident Report" className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Incident Report</span>
                        </a>
                    </li>
                    <li>
                    <Link to={{ pathname: "/Document-Request", state: { adminData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded">
                            <img src={documentRequestIcon} alt="Document Request" className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Document Request</span>
                    </Link>
                    </li>
                    <li>
                        <a href="#barangay-information" className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded">
                            <img src={barangayInfoIcon} alt="Barangay Information" className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Barangay Information</span>
                        </a>
                    </li>
                    <li>
                    <Link
                        to={{ pathname: "/EvacuationMap", state: { adminData } }}
                        className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded"
                    >
                        <MdMap size={24} />
                        <span className="ml-4 font-semibold text-lg">Evacuation Map</span>
                    </Link>
                </li>
                </ul>
                <h2 className="mt-10 ml-2 mb-1 font-bold text-xl">OTHERS</h2>
                <ul className="space-y-2">
                    <li>
                        <a href="#settings" className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded">
                            <img src={settingsIcon} alt="Settings" className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Settings</span>
                        </a>
                    </li>
                </ul>
                <div className="text-center mt-2">
                <p className="text-black font-bold">{getCurrentDate()}</p>
            </div>
            </div>
        </nav>
    );
};

export default Navigation;