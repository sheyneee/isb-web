import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // for redirection
import Swal from 'sweetalert2';

const CreateBarangay = () => {
    const navigate = useNavigate();
    
    // State to hold form data
    const [formData, setFormData] = useState({
        barangayName: '',
        region: '',
        email: '',
        logo: null, // Will handle file upload
        contactnumber: '',
        province: '',
        municipality: '',
        postalcode: '',
        location: '',
        history: ''
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle file input change for logo
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            logo: e.target.files[0] // Store the file object
        });
    };

    const createBarangay = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            // Send POST request to create a new barangay with form data
            await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/new/barangay`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            Swal.fire({
                title: 'Success!',
                text: 'Barangay created successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Redirect to the next page after the user clicks "OK"
                navigate('/Tech-Admin/Create-Captain-Account');
            });
        } catch (error) {
            console.error("Error creating barangay:", error);
            
            // Show error alert
            Swal.fire({
                title: 'Error!',
                text: 'Failed to create barangay. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1346AC]">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg h-[80vh] overflow-y-auto">
                <form onSubmit={createBarangay} className="space-y-4">
                    <h2 className="text-2xl font-bold text-[#1346AC] text-center">Create Barangay</h2>
                    
                    <div>
                        <label className="block text-md font-medium text-gray-700">Barangay Name</label>
                        <input
                            type="text"
                            name="barangayName"
                            placeholder="Barangay Name"
                            value={formData.barangayName}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-md font-medium text-gray-700">Region</label>
                        <input
                            type="text"
                            name="region"
                            placeholder="Region"
                            value={formData.region}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700">Contact Number</label>
                        <input
                            type="text"
                            name="contactnumber"
                            placeholder="Contact Number"
                            value={formData.contactnumber}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700">Province</label>
                        <input
                            type="text"
                            name="province"
                            placeholder="Province"
                            value={formData.province}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700">Municipality</label>
                        <input
                            type="text"
                            name="municipality"
                            placeholder="Municipality"
                            value={formData.municipality}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700">Postal Code</label>
                        <input
                            type="number"
                            name="postalcode"
                            placeholder="Postal Code"
                            value={formData.postalcode}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700">History</label>
                        <textarea
                            name="history"
                            placeholder="History"
                            value={formData.history}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700">Logo</label>
                        <input
                            type="file"
                            name="logo"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-[#1346AC] text-white font-bold rounded-md hover:bg-blue-500"
                    >
                        Create Barangay
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateBarangay;
