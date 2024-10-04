import React from 'react';
import { Link } from 'react-router-dom';
import {  FaUser, FaUsers,  FaInfoCircle, FaCog, FaCopy } from 'react-icons/fa';
import {  MdMap, MdDashboard, MdChatBubble} from "react-icons/md";
import { BiSolidMegaphone } from "react-icons/bi";
import { FaFilePen, FaIdBadge  } from "react-icons/fa6";

const Navigation = ({ adminData, getCurrentDate }) => {
    
    return (
        <nav className="bg-gray-100 text-black flex flex-col justify-between p-4 shadow">
            <div>
                <h2 className="mb-4 ml-2 mt-2 font-bold text-xl">GENERAL</h2>
                <ul className="space-y-2">
                    <li>
                        <Link to={{ pathname: "/home", state: { adminData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white hover:rounded">
                            <MdDashboard className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={{ pathname: "/BarangayProfiling", state: { adminData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white hover:rounded">
                            <FaUser className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Barangay Profiling</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={{ pathname: "/ResidentManagement", state: { adminData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white hover:rounded">
                            <FaUsers className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg leading-tight">Resident and<br />Household Management</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={{ pathname: "/Announcement", state: { adminData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white hover:rounded">
                            <BiSolidMegaphone className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Announcements</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={{ pathname: "/Messages", state: { adminData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white hover:rounded">
                            <MdChatBubble className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Messages</span>
                        </Link>
                    </li>
                    <li>
                        <a href="/Incident-Report" className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white hover:rounded">
                            <FaFilePen className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Incident Report</span>
                        </a>
                    </li>
                    <li>
                        <Link to={{ pathname: "/Document-Request", state: { adminData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white hover:rounded">
                            <FaCopy className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Document Request</span>
                        </Link>
                    </li>
                    <li>
                        <a href="#barangay-directory" className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white hover:rounded">
                            <FaIdBadge className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Barangay Directory</span>
                        </a>
                    </li>
                    <li>
                        <a href="#barangay-information" className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white hover:rounded">
                            <FaInfoCircle className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Barangay Information</span>
                        </a>
                    </li>
                    <li>
                        <Link
                            to={{ pathname: "/EvacuationMap", state: { adminData } }}
                            className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white hover:rounded"
                        >
                            <MdMap className="w-6 h-6" />
                            <span className="ml-4 font-semibold text-lg">Evacuation Map</span>
                        </Link>
                    </li>
                </ul>

                <h2 className="mt-2 ml-2 mb-1 font-bold text-xl">OTHERS</h2>
                <ul className="space-y-2">
                    <li>
                        <a href="#settings" className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white hover:rounded">
                            <FaCog className="w-6 h-6" />
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
