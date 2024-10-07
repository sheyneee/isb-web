import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateBarangay = () => {
    const navigate = useNavigate();
    
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    
    const [formData, setFormData] = useState({
        barangayName: '',
        region: '',
        regionName: '',
        email: '',
        logo: null,
        contactnumber: '',
        province: '',
        provinceName: '',
        municipality: '',
        municipalityName: '',
        postalcode: '',
        location: '',
        history: ''
    });

    const [errors, setErrors] = useState({
        contactnumber: '',
    });

    // Fetch regions on component mount
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get('https://psgc.gitlab.io/api/regions');
                setRegions(response.data);
            } catch (error) {
                console.error('Error fetching regions:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Failed to load regions. Please try again later.',
                });
            }
        };
        fetchRegions();
    }, []);

    // Fetch provinces when a region is selected
    useEffect(() => {
        const fetchProvinces = async () => {
            if (selectedRegion) {
                try {
                    const response = await axios.get(`https://psgc.gitlab.io/api/regions/${selectedRegion}/provinces`);
                    setProvinces(response.data);
                } catch (error) {
                    console.error('Error fetching provinces:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Network Error',
                        text: 'Failed to load provinces. Please try again later.',
                    });
                }
            }
        };
        fetchProvinces();
    }, [selectedRegion]);

    // Fetch cities when a province is selected
    useEffect(() => {
        const fetchCities = async () => {
            if (selectedProvince) {
                try {
                    const response = await axios.get(`https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities`);
                    setCities(response.data);
                } catch (error) {
                    console.error('Error fetching cities:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Network Error',
                        text: 'Failed to load cities. Please try again later.',
                    });
                }
            }
        };
        fetchCities();
    }, [selectedProvince]);

    // Fetch barangays when a city is selected
    useEffect(() => {
        const fetchBarangays = async () => {
            if (selectedCity) {
                try {
                    const response = await axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity}/barangays`);
                    setBarangays(response.data);
                } catch (error) {
                    console.error('Error fetching barangays:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Network Error',
                        text: 'Failed to load barangays. Please try again later.',
                    });
                }
            }
        };
        fetchBarangays();
    }, [selectedCity]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'contactnumber') {
            const isValid = /^\d*$/.test(value);

            if (!isValid) {
                setErrors({ ...errors, contactnumber: 'Contact number must contain only digits.' });
                return;
            } else if (value.length > 11) {
                setErrors({ ...errors, contactnumber: 'Contact number must be no more than 11 digits.' });
                return;
            } else if (value.length < 7) {
                setErrors({ ...errors, contactnumber: 'Contact number must be at least 7 digits.' });
                return;
            } else {
                setErrors({ ...errors, contactnumber: '' });
            }
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleRegionChange = (e) => {
        const regionCode = e.target.value;
        const regionName = regions.find(region => region.code === regionCode)?.name || '';
        setSelectedRegion(regionCode);
        setFormData({ ...formData, region: regionName, regionName });
        setProvinces([]);
        setCities([]);
        setBarangays([]);
        setSelectedProvince('');
        setSelectedCity('');
    };

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        const provinceName = provinces.find(province => province.code === provinceCode)?.name || '';
        setSelectedProvince(provinceCode);
        setFormData({ ...formData, province: provinceName, provinceName });
        setCities([]);
        setBarangays([]);
        setSelectedCity('');
    };

    const handleCityChange = (e) => {
        const cityCode = e.target.value;
        const cityName = cities.find(city => city.code === cityCode)?.name || '';
        setSelectedCity(cityCode);
        setFormData({ ...formData, municipality: cityName, municipalityName: cityName });
        setBarangays([]);
    };

    const handleBarangayChange = (e) => {
        setFormData({ ...formData, barangayName: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            logo: e.target.files[0]
        });
    };

    const createBarangay = async (e) => {
        e.preventDefault();

        if (formData.contactnumber.length < 7 || formData.contactnumber.length > 11) {
            setErrors({ ...errors, contactnumber: 'Contact number must be between 7 and 11 digits.' });
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please provide a valid contact number between 7 and 11 digits.'
            });
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
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
                navigate('/Tech-Admin/Create-Captain-Account');
            });
        } catch (error) {
            console.error("Error creating barangay:", error);
            
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
                        <label className="block text-md font-medium text-gray-700">Region</label>
                        <select
                            value={selectedRegion}
                            onChange={handleRegionChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Region</option>
                            {regions.map((region) => (
                                <option key={region.code} value={region.code}>
                                    {region.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700">Province</label>
                        <select
                            value={selectedProvince}
                            onChange={handleProvinceChange}
                            className="w-full p-2 border rounded"
                            disabled={!selectedRegion}
                        >
                            <option value="">Select Province</option>
                            {provinces.map((province) => (
                                <option key={province.code} value={province.code}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700">City/Municipality</label>
                        <select
                            value={selectedCity}
                            onChange={handleCityChange}
                            className="w-full p-2 border rounded"
                            disabled={!selectedProvince}
                        >
                            <option value="">Select City/Municipality</option>
                            {cities.map((city) => (
                                <option key={city.code} value={city.code}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-md font-medium text-gray-700">Barangay</label>
                        <select
                            value={formData.barangayName}
                            onChange={handleBarangayChange}
                            className="w-full p-2 border rounded"
                            disabled={!selectedCity}
                        >
                            <option value="">Select Barangay</option>
                            {barangays.map((barangay) => (
                                <option key={barangay.code} value={barangay.name}>
                                    {barangay.name}
                                </option>
                            ))}
                        </select>
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
                        {errors.contactnumber && <p className="text-red-500 text-sm mt-1">{errors.contactnumber}</p>}
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
