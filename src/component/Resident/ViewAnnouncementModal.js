import React from 'react';

const ViewAnnouncementModal = ({ announcement, onClose }) => {

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

    // Close the modal when clicking on the background
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto" onClick={handleBackgroundClick}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 md:w-2/2 max-h-[80vh] scrollbar-thin overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                
                <div className="flex justify-center mb-4">
                    <img
                        src={announcement.attachments ? `${process.env.REACT_APP_BACKEND_API_KEY}/uploads/announcements/${announcement.attachments}` : 'image-placeholder.png'}
                        className="w-full object-cover rounded"
                        alt="Announcement"
                    />
                </div>

                {/* Header section for Announcement Category, Importance, and Title */}
                <div className="flex gap-2 items-center mb-4 text-center justify-start">
                    {/* Announcement Category */}
                    <h2 className="text-md font-semibold text-white rounded-md bg-[#1346AC] px-3 py-1 hover:bg-blue-700">
                        {announcement.announcementCategory}
                    </h2>
                    
                    {/* Importance, hidden if it's "Not Important" */}
                    {announcement.Importance !== "Not Important" && (
                        <h3 className="text-md font-semibold text-white rounded-md bg-red-600 px-3 py-1 hover:bg-red-500">
                            {announcement.Importance}
                        </h3>
                    )}
                </div>
                
                {/* Date and time section */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold">{announcement.title}</h3>
                    <p className="text-xs text-gray-500">Date: {new Date(announcement.created_at).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Posted: {timeAgo(announcement.created_at)}</p>
                </div>

                {/* Content section */}
                <p className="text-sm mb-4">{announcement.content}</p>               
                
                {/* Close button */}
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-[#1346AC] text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewAnnouncementModal;
