import React, { useState } from 'react';

const AnnouncementModal = ({ announcement, onClose, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        announcementCategory: announcement.announcementCategory,
        title: announcement.title,
        content: announcement.content,
        Importance: announcement.Importance,
        attachments: null, // Add attachments to the state
    });

    // Handle input change for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, attachments: file });
    };

    // Handle edit button click
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Handle save button click
    const handleSaveClick = () => {
        // Get the user ID from local storage (assumes the user ID is stored as 'user')
        const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id;

        // Create FormData to send the update
        const updatedData = new FormData();
        updatedData.append('announcementCategory', formData.announcementCategory);
        updatedData.append('title', formData.title);
        updatedData.append('content', formData.content);
        updatedData.append('Importance', formData.Importance);
        updatedData.append('updated_by', loggedInUserId);

        if (formData.attachments) {
            updatedData.append('attachments', formData.attachments);
        }

        // Call the onEdit function passed as a prop
        onEdit(updatedData);

        setIsEditing(false);
    };

    if (!announcement) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg h-auto max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-2">{isEditing ? 'Edit Announcement' : 'View Announcement'}</h2>
                
                {/* Category */}
                <div className="mb-3">
                    <h3 className="text-lg font-semibold">Category</h3>
                    {isEditing ? (
                        <input
                            type="text"
                            name="announcementCategory"
                            value={formData.announcementCategory}
                            onChange={handleInputChange}
                            className="w-full border rounded px-2 py-1"
                        />
                    ) : (
                        <p>{announcement.announcementCategory}</p>
                    )}
                </div>

                {/* Title */}
                <div className="mb-3">
                    <h3 className="text-lg font-semibold">Title</h3>
                    {isEditing ? (
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full border rounded px-2 py-1"
                        />
                    ) : (
                        <p>{announcement.title}</p>
                    )}
                </div>

                {/* Content */}
                <div className="mb-3">
                    <h3 className="text-lg font-semibold">Body</h3>
                    {isEditing ? (
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            className="w-full border rounded px-2 py-1 min-h-28"
                        />
                    ) : (
                        <p className="max-h-32 overflow-y-auto">{announcement.content}</p>
                    )}
                </div>

                {/* Attachments */}
                {isEditing ? (
                    <div className="mb-3">
                        <h3 className="text-lg font-semibold">Attachments</h3>
                        <input type="file" name="attachments" onChange={handleFileChange} />
                    </div>
                ) : (
                    announcement.attachments && (
                        <div className="mb-3">
                            <h3 className="text-lg font-semibold">Attachments</h3>
                            <img src={announcement.attachments} alt="Attachment" className="w-24 h-24 object-cover" />
                        </div>
                    )
                )}

                {/* Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                    {isEditing ? (
                        <>
                            <button onClick={handleSaveClick} className="bg-[#1346AC] text-white px-4 py-2 rounded-full">
                                Save
                            </button>
                            <button onClick={() => setIsEditing(false)} className="border border-[#1346AC] px-4 py-2 rounded-full">
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEditClick} className="bg-[#1346AC] text-white px-4 py-2 rounded-full">
                            Edit Announcement
                        </button>
                    )}
                    <button onClick={onClose} className="border border-[#1346AC] px-4 py-2 rounded-full">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementModal;
