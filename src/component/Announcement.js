import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AnnouncementModal from './AnnouncementModal';

const Announcement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const announcementsPerPage = 6;
    const [modalAnnouncement, setModalAnnouncement] = useState(null);

    // Fetch announcements from the API when the component mounts
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/announcements`)
            .then(response => setAnnouncements(response.data.announcements))
            .catch(error => console.error('Error fetching announcements:', error));
    }, []);

    const timeAgo = (created_at) => {
        const now = new Date();
        const postDate = new Date(created_at);
        const diffInSeconds = Math.floor((now - postDate) / 1000);

        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];

        for (let i = 0; i < intervals.length; i++) {
            const interval = intervals[i];
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count > 0) {
                return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';
    };

    const handleOpenModal = (announcement) => {
        setModalAnnouncement(announcement); // Open modal with the selected announcement
    };

    const handleCloseModal = () => {
        setModalAnnouncement(null); // Close modal
    };

    const handleEditAnnouncement = (updatedData) => {
        const announcementId = modalAnnouncement._id; // Get the ID of the current announcement
    
        axios.put(`${process.env.REACT_APP_BACKEND_API_KEY}/api/update/announcements/${announcementId}`, updatedData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Make sure to set the correct headers for file upload
            },
        })
        .then(response => {
            // Update the announcement in the state
            setAnnouncements(prevAnnouncements =>
                prevAnnouncements.map(announcement =>
                    announcement._id === announcementId ? response.data.announcement : announcement
                )
            );
            handleCloseModal();
        })
        .catch(error => {
            console.error('Error updating announcement:', error);
        });
    };
    
    // Calculate the indexes of the first and last announcements on the current page
    const indexOfLastAnnouncement = currentPage * announcementsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
    const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

    // Calculate total pages
    const totalPages = Math.ceil(announcements.length / announcementsPerPage);

    // Use navigate to handle routing
    const navigate = useNavigate();

    

    return (
        <div className="bg-white p-8 rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Announcements</h2>
                <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => navigate('/Announcement')}
                >
                    View Announcements
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAnnouncements.length > 0 ? (
                    currentAnnouncements.map((announcement, index) => {
                        return (
                            <div 
                                key={index} 
                                className="bg-[#d1d5db] p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => handleOpenModal(announcement)} 
                            >
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0">
                                        {announcement.attachments ? (
                                            <img
                                                src={announcement.attachments} // Use the URL directly from the announcement object
                                                alt="Announcement"
                                                onError={(e) => e.target.src = "/placeholder-image.png"}
                                                className="w-24 h-24 rounded object-cover mr-4"
                                            />
                                        ) : (
                                            <img src="/placeholder-image.png" alt="Announcement" className="w-24 h-24 rounded object-cover mr-4" />
                                        )}
                                    </div>
                                    <div>
                                        {announcement.Importance === 'Important' && (
                                            <h3 className="text-sm font-bold text-red-500">IMPORTANT</h3>
                                        )}
                                        <h4 className="text-lg font-semibold">{announcement.announcementCategory}</h4>
                                        <p className="text-md text-black font-semibold mt-2">{announcement.title}</p>
                                        <p className="text-xs text-gray-500">{new Date(announcement.created_at).toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">{timeAgo(announcement.created_at)}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>Error Fetching the Announcements.</p>
                )}
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                    Showing {indexOfFirstAnnouncement + 1} to {Math.min(indexOfLastAnnouncement, announcements.length)} of {announcements.length} entries
                </div>
                <div className="flex space-x-2 font-semibold">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`px-2 py-1 rounded ${currentPage === index + 1 ? 'bg-[#1346AC] text-white' : 'bg-gray-200 hover:bg-[#1346AC]'}`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            {modalAnnouncement && (
                <AnnouncementModal 
                    announcement={modalAnnouncement}
                    onClose={handleCloseModal}
                    onEdit={handleEditAnnouncement}
                />
            )}
        </div>
    );
};

export default Announcement;
