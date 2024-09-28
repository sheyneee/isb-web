import React, { useEffect, useState } from 'react';
import ResidentHeader from '../../../component/Resident/ResidentHeader';
import ResidentNav from '../../../component/Resident/ResidentNav';
import { useNavigate } from 'react-router-dom';
import ViewAnnouncementModal from '../../../component/Resident/ViewAnnouncementModal';
import axios from 'axios'

const ResidentAnnouncementScreen = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [residentData, setResidentData] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ category: 'All', important: 'All' });
    const [sortOrder, setSortOrder] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const announcementsPerPage = 6;
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            if (user.profilepic) {
                user.profilepic = user.profilepic.replace(/\\/g, '/');
            }
            const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            const firstName = capitalizeWords(user.firstName);
            const lastName = capitalizeWords(user.lastName);
            const middleInitial = user.middleName ? `${capitalizeWords(user.middleName.charAt(0))}.` : '';
            setUserName(`${firstName} ${middleInitial} ${lastName}`);
            setResidentData(user);
            setUserRole(user.roleinHousehold);
        }

        // Fetch announcements
        axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/announcements`)
            .then(response => setAnnouncements(response.data.announcements))
            .catch(error => console.error('Error fetching announcements:', error));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleOpenModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAnnouncement(null);
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleSortDirectionChange = (e) => {
        setSortDirection(e.target.value);
    };

    const resetFilters = () => {
        setFilters({ category: 'All', important: 'All' });
        setSearchTerm('');
    };

    const predefinedCategories = [
        'Health and Safety',
        'Community Assistance',
        'Public Services',
        'Events',
        'Public Advisory'
    ];

    const filteredAnnouncements = announcements
    .filter(announcement => {
        if (filters.category === 'All') {
            return true;
        }
        if (filters.category === 'allOthers') {
            return !predefinedCategories.includes(announcement.announcementCategory);
        }
        return announcement.announcementCategory === filters.category;
    })
    .filter(announcement => {
        return (
            filters.important === 'All' ||
            (filters.important === 'Important' && announcement.Importance === 'Important') ||
            (filters.important === 'Not Important' && announcement.Importance === 'Not Important')
        );
    })
    .filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
        switch (sortOrder) {
            case 'date':
                return sortDirection === 'desc'
                    ? new Date(b.created_at) - new Date(a.created_at)
                    : new Date(a.created_at) - new Date(b.created_at);
            case 'title':
                return sortDirection === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });

    const indexOfLastAnnouncement = currentPage * announcementsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
    const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
    const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);

    return (
        <div className="flex flex-col min-h-screen">
            <ResidentHeader 
                userName={userName} 
                userRole={userRole} 
                handleLogout={handleLogout} 
                profilePic={residentData?.profilepic} 
            />
            <div className="flex flex-1">
                <ResidentNav residentData={residentData} />
                <main className="flex-1 p-8 bg-gray-100">
                    <div className="col-span-1 lg:col-span-3 h-full max-h-full bg-white p-6 rounded-lg shadow-md relative">
                        <h2 className="text-3xl font-bold mb-8">Announcements</h2>
    
                        {/* Filter and Sort Controls */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <label htmlFor="Category" className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        name="filterCategory"
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="All">All</option>
                                        <option value="Health and Safety">Health and Safety</option>
                                        <option value="Community Assistance">Community Assistance</option>
                                        <option value="Public Services">Public Services</option>
                                        <option value="Events">Events</option>
                                        <option value="Public Advisory">Public Advisory</option>
                                        <option value="allOthers">Others</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Important</label>
                                    <select
                                        name="filterImportant"
                                        value={filters.important}
                                        onChange={(e) => setFilters({ ...filters, important: e.target.value })}
                                        className="border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="All">All</option>
                                        <option value="Important">Important</option>
                                        <option value="Not Important">Not Important</option>
                                    </select>
                                </div>
                                <button
                                    className="text-blue-500 hover:text-[#1A50BE] cursor-pointer font-semibold mt-4"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </button>
                            </div>
    
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 space-y-4 lg:space-y-0 lg:space-x-4">
                                <div className="w-full lg:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Search title"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border border-gray-300 rounded-md p-2 w-full lg:w-80"
                                    />
                                </div>

                                {/* Sort Controls */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 mr-2">Sort by</label>
                                        <div className="relative">
                                            <select
                                                id="sortBy"
                                                name="sortBy"
                                                className="block appearance-none w-full bg-white text-[#1346AC] font-semibold py-2 px-1 pr-8 rounded leading-tight focus:outline-none"
                                                value={sortOrder}
                                                onChange={handleSortOrderChange}
                                            >
                                                <option value="date">Date</option>
                                                <option value="title">Title</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M7 10l5 5 5-5H7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <select
                                            id="sortDirection"
                                            name="sortDirection"
                                            className="block appearance-none w-full bg-white text-[#1346AC] font-semibold py-2 px-1 pr-8 rounded leading-tight focus:outline-none"
                                            value={sortDirection}
                                            onChange={handleSortDirectionChange}
                                        >
                                            {sortOrder === 'date' && (
                                                <>
                                                    <option value="desc">Latest to Oldest</option>
                                                    <option value="asc">Oldest to Latest</option>
                                                </>
                                            )}
                                            {sortOrder === 'title' && (
                                                <>
                                                    <option value="asc">A-Z</option>
                                                    <option value="desc">Z-A</option>
                                                </>
                                            )}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M7 10l5 5 5-5H7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        {/* Announcements */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentAnnouncements.length > 0 ? (
                                currentAnnouncements.map((announcement, index) => {
                                    const imageUrl = announcement.attachments;
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
                                                            src={imageUrl}
                                                            alt="Announcement"
                                                            onError={(e) => e.target.src = "/placeholder-image.png"}
                                                            className="w-24 h-24 rounded object-cover mr-4"
                                                        />
                                                    ) : (
                                                        <img src="/placeholder-image.png" alt="Announcement" className="w-24 h-24 rounded object-cover mr-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    {announcement.importance === 'Important' && (
                                                        <h3 className="text-sm font-bold text-red-500">IMPORTANT</h3>
                                                    )}
                                                    <h4 className="text-lg font-semibold">{announcement.announcementCategory}</h4>
                                                    <p className="text-md text-black font-semibold mt-2 truncate">{announcement.title}</p>
                                                    <p className="text-xs text-gray-500">{new Date(announcement.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No announcements found.</p>
                            )}
                        </div>
    
                        
                        <div className="flex justify-between items-center mt-4">
                            {/* Showing entries information */}
                            <div className="text-sm text-gray-600">
                                Showing {Math.min(indexOfLastAnnouncement, filteredAnnouncements.length)} of {filteredAnnouncements.length} entries
                            </div>
                            
                            {/* Pagination Controls */}
                            <div className="flex space-x-2 font-semibold">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-[#1346AC] text-white' : 'bg-gray-200 hover:bg-[#1346AC] hover:text-white'}`}
                                        onClick={() => setCurrentPage(index + 1)}
                                        disabled={currentPage === index + 1} // Disable button for current page
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {showModal && selectedAnnouncement && (
                <ViewAnnouncementModal
                    announcement={selectedAnnouncement}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};    

export default ResidentAnnouncementScreen;
