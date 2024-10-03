import React from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard, MdChatBubble, MdInfo, MdMap, MdSettings } from "react-icons/md";
import { BiSolidMegaphone } from "react-icons/bi";
import { FaFilePen, FaIdBadge  } from "react-icons/fa6";
import { FaCopy } from 'react-icons/fa';

const ResidentNav = ({ residentData}) => {
    
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

    return (
        <nav className=" bg-gray-100 text-black flex flex-col justify-between p-4 shadow">
            <div>
                <h2 className="mb-4 ml-2 mt-2 font-bold text-xl">GENERAL</h2>
                    <ul>
                    <li>
                        <Link
                            to={{ pathname: "/Resident/Home", state: { residentData } }}
                            className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded hover:text-white"
                        >
                            <MdDashboard size={24} />
                            <span className="ml-4 font-semibold text-lg">Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={{ pathname: "/Resident/Announcements", state: { residentData } }}
                            className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded hover:text-white"
                        >
                            <BiSolidMegaphone size={24} />
                            <span className="ml-4 font-semibold text-lg">Announcement</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={{ pathname: "/Resident/Incident-Report", state: { residentData } }}
                            className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded hover:text-white"
                        >
                            <FaFilePen size={24} />
                            <span className="ml-4 font-semibold text-lg">Incident Report</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={{ pathname: "/Resident/Document-Request", state: { residentData } }}
                            className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded hover:text-white"
                        >
                            <FaCopy size={24} />
                            <span className="ml-4 font-semibold text-lg">Document Request</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={{ pathname: "/Resident/Messages", state: { residentData } }}
                            className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:text-white"
                        >
                            <MdChatBubble size={24} />
                            <span className="ml-4 font-semibold text-lg">Messages</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={{ pathname: "/BarangayOfficialsDirectory", state: { residentData } }}
                            className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded hover:text-white"
                        >
                            <FaIdBadge size={24} />
                            <span className="ml-4 font-semibold text-lg">Barangay Officials <br/>Directory</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={{ pathname: "/BarangayInformation", state: { residentData } }}
                            className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded hover:text-white"
                        >
                            <MdInfo size={24} />
                            <span className="ml-4 font-semibold text-lg">Barangay Information</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={{ pathname: "/Resident/EvacuationMap", state: { residentData } }}
                            className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded hover:text-white"
                        >
                            <MdMap size={24} />
                            <span className="ml-4 font-semibold text-lg">Evacuation Map</span>
                        </Link>
                    </li>
                </ul>
                <h2 className="mt-4 ml-2 mb-1 font-bold text-xl">OTHERS</h2>
                <ul className="space-y-2">
                    <li>
                        <Link
                            to={{ pathname: "/Settings", state: { residentData } }}
                            className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded hover:text-white"
                        >
                            <MdSettings size={24} />
                            <span className="ml-4 font-semibold text-lg">Settings</span>
                        </Link>
                    </li>
                </ul>
                <div className="text-center">
                    <p className="text-black font-bold">{getCurrentDate()}</p>
                </div>
            </div>
        </nav>
    );
};

export default ResidentNav;
