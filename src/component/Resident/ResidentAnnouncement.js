import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ViewAnnouncementModal from './ViewAnnouncementModal';

const ResidentAnnouncement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0); 
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showModal, setShowModal] = useState(false); 
    const [viewedAnnouncements, setViewedAnnouncements] = useState([]); 

    // Fetch announcements from the API when the component mounts
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/announcements`)
            .then(response => setAnnouncements(response.data.announcements))
            .catch(error => console.error('Error fetching announcements:', error));
    }, []);

    // Function to go to the next slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
    };

    // Auto slide effect using setInterval
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval); 
    }, [announcements.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
    };

    // Function to open the modal with the selected announcement
    const handleAnnouncementClick = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowModal(true);

        // Mark only the clicked announcement as viewed
        setViewedAnnouncements((prevViewed) => {
            if (!prevViewed.includes(announcement.id)) {
                return [...prevViewed, announcement.id]; // Add it to viewed list if not already
            }
            return prevViewed;
        });
    };

    return (
<div className="relative w-full" data-carousel="slide">
    {/* Carousel wrapper */}
    <div className="relative h-80 overflow-hidden rounded-lg md:h-[140px]">
        {announcements.length === 0 ? (
            <p className="text-center text-gray-500">No announcements available</p>
        ) : (
            announcements.map((announcement, index) => (
                <div
                    key={announcement.id}
                    className={`absolute inset-0 transition duration-700 ease-in-out ${
                        currentSlide === index ? "block" : "hidden"
                    }`}
                    data-carousel-item
                    onClick={() => handleAnnouncementClick(announcement)}
                    style={{
                        backgroundColor: viewedAnnouncements.includes(announcement.id)
                            ? 'rgba(255,255,255,0.6)'
                            : 'rgba(0,0,0,0.6)'
                    }}
                >
                    <img
                        src={announcement.attachments ? `${process.env.REACT_APP_BACKEND_API_KEY}/uploads/announcements/${announcement.attachments}` : 'image-placeholder.png'}
                        className="absolute block w-full h-full object-cover cursor-pointer" // Changed to object-cover
                        alt="Announcement"
                    />
                    <div className="absolute bottom-5 left-5 text-white bg-black bg-opacity-50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold">{announcement.announcementCategory}</h3>
                        <p className="text-sm">{announcement.title}</p>
                        <p className="text-xs text-gray-300">
                            {new Date(announcement.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))
        )}
    </div>
            {/* Slider indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-1 rtl:space-x-reverse">
                {announcements.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-2 h-2 rounded-full ${currentSlide === index ? 'bg-blue-600' : 'bg-white'}`}
                        aria-current={currentSlide === index ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                        onClick={() => setCurrentSlide(index)} // Click to go to the specific slide
                    ></button>
                ))}
            </div>

            {/* Slider controls */}
            <button
                type="button"
                className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={prevSlide}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
                    <svg
                        className="w-4 h-4 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 1 1 5l4 4"
                        />
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>
            <button
                type="button"
                className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={nextSlide}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
                    <svg
                        className="w-4 h-4 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 9 4-4-4-4"
                        />
                    </svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>

            {/* Modal */}
            {showModal && selectedAnnouncement && (
                <ViewAnnouncementModal
                    announcement={selectedAnnouncement}
                    onClose={() => setShowModal(false)} // Close the modal
                />
            )}
        </div>
    );
};

export default ResidentAnnouncement;
