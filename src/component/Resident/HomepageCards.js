import React from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard, MdEditDocument, MdDescription, MdMessage, MdGroup, MdInfo, MdMap, MdSettings } from 'react-icons/md';
import { BiSolidMegaphone } from 'react-icons/bi';

const HomepageCards = ({ residentData }) => {
  const cardData = [
    {
      path: "/Resident/Home",
      icon: <MdDashboard size={24} />,
      title: "Dashboard"
    },
    {
      path: "/Resident/Announcement",
      icon: <BiSolidMegaphone size={24} />,
      title: "Announcement"
    },
    {
      path: "/IncidentFiling",
      icon: <MdEditDocument size={24} />,
      title: "Incident Filing"
    },
    {
      path: "/Resident/Document-Request",
      icon: <MdDescription size={24} />,
      title: "Document Request"
    },
    {
      path: "/Messages",
      icon: <MdMessage size={24} />,
      title: "Messages"
    },
    {
      path: "/BarangayOfficialsDirectory",
      icon: <MdGroup size={24} />,
      title: "Barangay Officials Directory"
    },
    {
      path: "/BarangayInformation",
      icon: <MdInfo size={24} />,
      title: "Barangay Information"
    },
    {
      path: "/Resident/EvacuationMap",
      icon: <MdMap size={24} />,
      title: "Evacuation Map"
    },
    {
      path: "/Settings",
      icon: <MdSettings size={24} />,
      title: "Settings"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardData.map((card, index) => (
        <div key={index} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <Link to={{ pathname: card.path, state: { residentData } }} className="flex items-center p-4 text-black hover:bg-[#1346AC] hover:rounded">
              {card.icon}
              <span className="ml-4 font-semibold text-lg">{card.title}</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomepageCards;
