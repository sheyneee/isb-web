import React from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard, MdEditDocument, MdDescription, MdMessage, MdGroup, MdInfo, MdMap, MdSettings } from 'react-icons/md';
import { BiSolidMegaphone } from 'react-icons/bi';

const HomepageCards = ({ residentData }) => {
  const cardData = [
    {
      path: "/Resident/Home",
      icon: <MdDashboard size={50} />,
      title: "Dashboard"
    },
    {
      path: "/Resident/Announcements",
      icon: <BiSolidMegaphone size={50} />,
      title: "Announcement"
    },
    {
      path: "/Resident/Incident-Report",
      icon: <MdEditDocument size={50} />,
      title: "Incident Filing"
    },
    {
      path: "/Resident/Document-Request",
      icon: <MdDescription size={50} />,
      title: "Document Request"
    },
    {
      path: "/Resident/Messages",
      icon: <MdMessage size={50} />,
      title: "Messages"
    },
    {
      path: "/Resident/BarangayOfficialsDirectory",
      icon: <MdGroup size={50} />,
      title: "Barangay Officials Directory"
    },
    {
      path: "/BarangayInformation",
      icon: <MdInfo size={50} />,
      title: "Barangay Information"
    },
    {
      path: "/Resident/EvacuationMap",
      icon: <MdMap size={50} />,
      title: "Evacuation Map"
    },
    {
      path: "/Settings",
      icon: <MdSettings size={50} />,
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
