const AnnouncementModal = ({ announcement, onClose, onEdit }) => {
    if (!announcement) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg h-auto max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-2">View Announcement</h2>
                <div className="mb-3">
                    <h3 className="text-lg font-semibold">Category</h3>
                    <div className="flex justify-between items-center">
                        <p>{announcement.announcementCategory}</p>
                        {announcement.Importance === 'Important' && (
                            <div className="flex items-center">
                                <span className="text-lg mr-1 font-semibold">Important</span>
                                <div className="w-4 h-4 bg-[#1346AC]"></div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mb-3">
                    <h3 className="text-lg font-semibold">Title</h3>
                    <p>{announcement.title}</p>
                </div>
                <div className="mb-3">
                    <h3 className="text-lg font-semibold">Body</h3>
                    <p className="max-h-32 overflow-y-auto">{announcement.content}</p>
                </div>
                {announcement.attachments && (
                    <div className="mb-3">
                        <h3 className="text-lg font-semibold">Attachments</h3>
                        <img src={`${process.env.REACT_APP_BACKEND_API_KEY}/uploads/announcements/${announcement.attachments}`} alt="Attachment" className="w-24 h-24 object-cover" />
                    </div>
                )}
                <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={onEdit} className="bg-[#1346AC] text-white px-4 py-2 rounded-full">Edit Announcement</button>
                    <button onClick={onClose} className="border border-[#1346AC] px-4 py-2 rounded-full">Close</button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementModal;
