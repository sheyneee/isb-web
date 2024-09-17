import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../component/Header';
import Navigation from '../../component/Navigation';
import { useNavigate } from 'react-router-dom';
import AnnouncementModal from '../../component/AnnouncementModal';


const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [adminData, setAdminData] = useState(null);
    const [formData, setFormData] = useState({
        adminID: '',
        announcementCategory: '',
        otherCategory: '', 
        title: '',
        content: '',
        Importance: 'Not Important',
        attachments: null,
    });
    const [errors, setErrors] = useState({});
    const [filters, setFilters] = useState({
        category: 'All',
        important: 'All',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const announcementsPerPage = 6;
    const [modalAnnouncement, setModalAnnouncement] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/announcements`)
            .then(response => setAnnouncements(response.data.announcements))
            .catch(error => console.error('No announcement found:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (checked ? 'Important' : 'Not Important') : value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            attachments: file,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        let category = formData.announcementCategory;

        if (category === 'Others' && formData.otherCategory) {
            category = formData.otherCategory; 
        }

        if (!category) {
            newErrors.announcementCategory = 'Required';
        }

        if (!formData.title) newErrors.title = 'Required';
        if (!formData.content) newErrors.content = 'Required';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const data = new FormData();
        data.append('adminID', formData.adminID);
        data.append('announcementCategory', category); 
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('Importance', formData.Importance);
        if (formData.attachments) {
            data.append('attachments', formData.attachments);
        }

        axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/new/announcements`, data)
            .then(response => {
                setAnnouncements([...announcements, response.data.announcement]);
                setFormData({
                    adminID: formData.adminID,
                    announcementCategory: '',
                    otherCategory: '', 
                    title: '',
                    content: '',
                    Importance: 'Not Important',
                    attachments: null,
                });
            })
            .catch(error => {
                if (error.response) {
                    console.error('Server responded with an error:', error.response.data);
                } else {
                    console.error('Error creating announcement:', error.message);
                }
            });
    };

    const handleOpenModal = (announcement) => {
        setModalAnnouncement(announcement); // Open modal with the selected announcement
    };

    const handleCloseModal = () => {
        setModalAnnouncement(null); // Close modal
    };

    const handleEditAnnouncement = () => {
        // Handle the logic for editing the announcement
        console.log("Editing announcement:", modalAnnouncement);
        handleCloseModal();
    };

    const getCurrentDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate how long ago the announcement was created
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

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user._id) {
            const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            const firstName = capitalizeWords(user.firstName);
            const lastName = capitalizeWords(user.lastName);
            const middleInitial = user.middleName ? capitalizeWords(user.middleName.charAt(0)) + '.' : '';
            setUserName(`${firstName} ${middleInitial} ${lastName}`);
            setAdminData(user);
            setUserRole(user.roleinBarangay);
            setFormData(prevFormData => ({
                ...prevFormData,
                adminID: user._id,
            }));
        } else {
            console.error('User data is missing or invalid');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const resetFilters = () => {
        setFilters({
            category: 'All',
            important: 'All',
        });
        setSearchTerm('');
    };

    const handleRemoveFile = () => {
        setFormData({
            ...formData,
            attachments: null,
        });
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
            if (filters.category === 'All' && filters.important === 'All') {
                if (a.Importance === 'Important' && b.Importance !== 'Important') return -1;
                if (a.Importance !== 'Important' && b.Importance === 'Important') return 1;
            }
            return sortOrder === 'date' ? new Date(b.created_at) - new Date(a.created_at) : a.title.localeCompare(b.title);
        });

    const indexOfLastAnnouncement = currentPage * announcementsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
    const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

    const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header userName={userName} userRole={userRole} handleLogout={handleLogout} />
            <div className="flex flex-1">
                <Navigation adminData={adminData} getCurrentDate={getCurrentDate} />
                <main className="flex-1 p-8 bg-gray-100">
                    <h2 className="text-3xl font-bold mb-8">Announcements</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                         {/* Create Announcement Form - 40% width */}
                         <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Create Announcement</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700">Category</label>
                                            <select
                                                name="announcementCategory"
                                                value={formData.announcementCategory}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="">Select a category</option>
                                                <option value="Health and Safety">Health and Safety</option>
                                                <option value="Community Assistance">Community Assistance</option>
                                                <option value="Public Services">Public Services</option>
                                                <option value="Events">Events</option>
                                                <option value="Public Advisory">Public Advisory</option>
                                                <option value="">Others</option>
                                            </select>
                                            {errors.announcementCategory && (
                                                <p className="text-red-500 text-xs">{errors.announcementCategory}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-5">
                                            <span className="ml-2 text-md font-semibold text-gray-700">Important</span>
                                            <input
                                                type="checkbox"
                                                name="Importance"
                                                checked={formData.Importance === 'Important'}
                                                onChange={() => setFormData({ ...formData, Importance: formData.Importance === 'Important' ? 'Not Important' : 'Important' })}
                                                className="form-checkbo mt-1"
                                            />
                                        </div>
                                    </div>
                                    {formData.announcementCategory === 'Others' && (
                                        <div className="mb-4 flex-1">
                                            <label className="block text-sm font-medium text-gray-700">Specify Other Category</label>
                                            <input
                                                type="text"
                                                name="otherCategory"
                                                value={formData.otherCategory} 
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                                placeholder="Enter other category"
                                            />
                                            {errors.otherCategory && (
                                                <p className="text-red-500 text-xs">{errors.otherCategory}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter the title"
                                    />
                                    {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Body</label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter the body"
                                        rows="4"
                                    ></textarea>
                                    {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Attachments</label>
                                    <div className="flex flex-wrap">
                                        <button
                                            type="button"
                                            className="border border-gray-300 rounded-md p-4 focus:outline-none"
                                            style={{ width: "100px", height: "100px" }}
                                            onClick={() => document.getElementById('file-upload').click()}
                                        >
                                            <span className="text-4xl font-bold">+</span>
                                        </button>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                        {formData.attachments && (
                                            <div className="mt-2 flex flex-wrap gap-4">
                                                <div className="flex flex-col items-center">
                                                    <img
                                                        src={URL.createObjectURL(formData.attachments)}
                                                        alt="Attached file"
                                                        className="max-w-xs max-h-xs object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="bg-red-500 text-white px-2 py-1 rounded-full mt-2"
                                                        onClick={handleRemoveFile}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            <div className="flex gap-1">
                                <button
                                    type="submit"
                                    className="bg-[#1346AC] text-white px-4 py-2 rounded-full font-semibold"
                                >
                                    Create Announcement
                                </button>
                                <button
                                    type="button"
                                    className="border border-[#1346AC] text-gray-700 px-10 py-2 rounded-full font-semibold"
                                    onClick={() => setFormData({ adminID: '', announcementCategory: '', otherCategory: '', title: '', content: '', Importance: 'Not Important', attachments: null })}
                                >
                                    Clear
                                </button>
                            </div>
                            </form>
                        </div>
                       
                         {/* Announcements List with Filters, Search, and Sort - 60% width */}
                         <div className="col-span-1 lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Announcements</h2>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border border-gray-300 rounded-md p-2 w-80"
                                    />
                                    <div className="flex items-center">
                                        <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by</label>
                                        <div className="relative">
                                            <select
                                                id="sortBy"
                                                name="sortBy"
                                                className="block appearance-none w-full bg-white text-[#1346AC] font-semibold py-2 px-1 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                value={sortOrder}
                                                onChange={(e) => setSortOrder(e.target.value)}
                                            >
                                                <option value="date">Date</option>
                                                <option value="title">Title</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10l5 5 5-5H7z"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className="mr-2">
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
                                <div className='mr-2'>
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
                                    className="mt-4 text-blue-500 hover:text-[#1A50BE] cursor-pointer font-semibold"
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentAnnouncements.length > 0 ? (
                                    currentAnnouncements.map((announcement, index) => {
                                        const imageUrl = `${process.env.REACT_APP_BACKEND_API_KEY}/uploads/announcements/${announcement.attachments}`;
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
                                    Showing {indexOfFirstAnnouncement + 1} to {Math.min(indexOfLastAnnouncement, filteredAnnouncements.length)} of {filteredAnnouncements.length} entries
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
                        </div>
                    </div>
                </main>
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

export default Announcements;