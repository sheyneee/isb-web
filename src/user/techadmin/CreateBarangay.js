import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // for redirection
import Swal from 'sweetalert2';

const CreateBarangay = () => {
    const navigate = useNavigate();

    const createBarangay = async () => {
        try {
            // Send POST request to create a new barangay
            await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/new/barangay`);
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
            <button
                className="px-6 py-3 bg-white text-[#1346AC] font-bold rounded-md"
                onClick={createBarangay}
            >
                Create Barangay
            </button>
        </div>
    );
};

export default CreateBarangay;
