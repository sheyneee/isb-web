import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../../component/Header';
import Navigation from '../../component/Navigation';
import PhotoUpload from '../../component/PhotoUpload';
import axios from 'axios';
import Occupation from '../../assets/dropdowns/Occupation';
import Religions from '../../assets/dropdowns/Religions';
import Nationalities from '../../assets/dropdowns/Nationalities';
import PresentAddress from '../../assets/dropdowns/PresentAddress';

const AddResident = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [adminData, setAdminData] = useState(null);
    const [householdMembers, setHouseholdMembers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);  // Popup state
    const [credentials, setCredentials] = useState({ email: '', password: '', householdID: '' }); 
    const [profilePic, setProfilePic] = useState(null);
    const [attachedFiles, setAttachedFiles] = useState([]); 
    const [loading, setLoading] = useState(false); // Loading state

    const [formData, setFormData] = useState({
        roleinHousehold: '',
        householdID: '',
        householdHead: '',
        reltohouseholdhead: '',  
        lastName: '',
        firstName: '',
        middleName: '',
        suffix: '',
        sex: '',
        birthday: '',
        birthplace: '',
        age: '',
        occupation: '',
        nationality: '',
        religion: '',
        civilStatus: '',
        emailAddress: '',
        mobileNumber: '',
        profilepic: null, 
        voter: false,
        indigent: false,
        fourpsmember: false,
        pwd: false,
        soloparent: false,
        seniorCitizen: false,
        pwdid_num: '',
        soloparentid_num: '',
        seniorcitizenid_num: '',
        permanentAddress: {
            unitFloorRoomNo: '',
            building: '',
            blockNo: '',
            lotNo: '',
            phaseNo: '',
            houseNo: '',
            street: '',
            subdivision: ''
        },
        presentAddress: {
            unitFloorRoomNo: '',
            building: '',
            blockNo: '',
            lotNo: '',
            phaseNo: '',
            houseNo: '',
            street: '',
            subdivision: '',
            city: '',
            province: '',
            barangay: '',
            region: '',
            postalcode: '',
        },
        philsys_num: '',
        voters_id: '',
        sss_num: '',
        pagibig_num: '',
        philhealth_num: '',
        tin_num: ''
    });
    const [sameAsPermanent, setSameAsPermanent] = useState(false);
    const [errors, setErrors] = useState({
        roleinHousehold: 'Required',
        householdID: '',
        householdHead: '',
        reltohouseholdhead: '',
        lastName: 'Required',
        firstName: 'Required',
        sex: 'Required',
        birthday: 'Required',
        birthplace: 'Required',
        civilStatus: 'Required',
        nationality: 'Required',
        religion: 'Required',
        occupation: 'Required',
        emailAddress: 'Required',
        mobileNumber: 'Required',
        'address.houseNo': 'Required',
        'address.street': 'Required',
    });
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            if (user.profilepic) {
                user.profilepic = user.profilepic.replace(/\\/g, '/');
            }
            const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            const firstName = capitalizeWords(user.firstName);
            const lastName = capitalizeWords(user.lastName);
            const middleInitial = user.middleName ? capitalizeWords(user.middleName.charAt(0)) + '.' : '';
            setUserName(`${firstName} ${middleInitial} ${lastName}`);
            setAdminData(user);
            setUserRole(user.roleinBarangay);
        }
    }, []);

    const formatHouseholdHeadName = (name) => {
        const nameParts = name.split(' ');
        
        const formatNamePart = (part) => {
            // Keep the first letter and replace some of the following letters with asterisks
            if (part.length > 1) {
                const visibleLength = Math.ceil(part.length / 3); // Show about 1/3 of the name
                const maskedPart = part.substring(visibleLength).replace(/./g, '*'); // Mask remaining letters with *
                return part.substring(0, visibleLength) + maskedPart;
            }
            return part; // For single letter names, no masking
        };
    
        const formattedParts = nameParts.map((part, index) => {
            if (index === nameParts.length - 1) {
                return formatNamePart(part); // Format last name
            } else {
                return `${part.charAt(0)}${formatNamePart(part.substring(1))}`; // Initial + masked name
            }
        });
    
        return formattedParts.join(' ');
    };
    
    const fetchHouseholdByNumber = async (householdID) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/household/${householdID}`);
            if (response.data && response.data.household) {
                const { householdHeadName, household } = response.data;
    
                const formattedName = formatHouseholdHeadName(householdHeadName);
    
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    householdHead: formattedName,
                    householdID: household.householdID
                }));
    
                // Make sure you're getting roleinHousehold
                setHouseholdMembers(household.members);  // Assuming `roleinHousehold` is part of `members`
                setErrors(prevErrors => ({ ...prevErrors, householdID: '' })); 
            } else {
                setErrors(prevErrors => ({ ...prevErrors, householdID: 'Household information not found' }));
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    householdHead: '',
                    householdID: ''
                }));
                setHouseholdMembers([]);
            }
        } catch (error) {
            console.error('Error fetching household info:', error);
            setErrors(prevErrors => ({ ...prevErrors, householdID: 'Household ID Not found' }));
        }
    };

        const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
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
    
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;

            // Handle email validation
            if (name === 'emailAddress') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        emailAddress: 'Invalid email format',
                    }));
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        emailAddress: '',
                    }));
                }
            }

        // Handle the "Same as Permanent Address" checkbox
        if (name === 'sameAsPermanent') {
            setSameAsPermanent(checked);
            setFormData((prevFormData) => ({
                ...prevFormData,
                presentAddress: checked
                    ? { ...prevFormData.permanentAddress }
                    : {
                        unitFloorRoomNo: '',
                        building: '',
                        blockNo: '',
                        lotNo: '',
                        phaseNo: '',
                        houseNo: '',
                        street: '',
                        subdivision: '',
                        city: '',
                        province: '',
                        barangay: '',
                        region: '',
                        postalcode: '',
                    },
            }));
            return;
        }
    
        // Handle mobile number validation
        if (name === 'mobileNumber') {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setFormData({ ...formData, [name]: updatedValue });
    
                // Validate mobile number to ensure it's exactly 10 digits and starts with '9'
                if (value.length === 10 && value.startsWith('9')) {
                    setErrors({ ...errors, mobileNumber: '' });
                } else if (value.length === 10) {
                    setErrors({ ...errors, mobileNumber: 'Mobile number must start with 9' });
                } else {
                    setErrors({ ...errors, mobileNumber: 'Mobile number must be exactly 10 digits.' });
                }
            }
            return; // Return early since the rest of the function doesn't apply to mobileNumber
        }
    
        // Handle permanent and present address fields
        if (name.startsWith('permanentAddress.') || name.startsWith('presentAddress.')) {
            const [addressType, addressField] = name.split('.');
            setFormData((prevFormData) => ({
                ...prevFormData,
                [addressType]: {
                    ...prevFormData[addressType],
                    [addressField]: updatedValue,
                },
            }));
    
            // If "Same as Permanent Address" is checked, update presentAddress as well
            if (sameAsPermanent && addressType === 'permanentAddress') {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    presentAddress: {
                        ...prevFormData.permanentAddress,
                        [addressField]: updatedValue,
                    },
                }));
            }
            return;
        }
    
        // Handle birthday to calculate age, senior citizen, and voter status
        if (name === 'birthday') {
            const selectedDate = new Date(value);
            const today = new Date();
    
            // Check if the selected date is in the future
            if (selectedDate > today) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    birthday: 'Invalid Date',
                }));
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    birthday: '', 
                }));
                return;
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    birthday: '',
                }));
                const age = calculateAge(selectedDate);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    birthday: value,
                    age: age,
                    seniorCitizen: age >= 60,
                    voter: age >= 16 ? prevFormData.voter : false,
                }));
            }
            return;
        }
    
        // Handle general field changes and their validation
        setFormData({ ...formData, [name]: updatedValue });
        if (typeof updatedValue === 'string' && updatedValue.trim() === '') {
            setErrors({ ...errors, [name]: 'Required' });
        } else {
            setErrors({ ...errors, [name]: '' });
        }
    
        // Specific validation for checkboxes (e.g., voter, indigent)
        if (type === 'checkbox') {
            handleCheckboxValidation(name, checked);
        }
    
        // Handle role in household
        if (name === 'roleinHousehold') {
            handleHouseholdRoleChange(value);
        }
    
        // Handle household ID validation
        if (name === 'householdID') {
            handleHouseholdIDChange(value);
        }
    
        // Handle relationship field visibility and validation
        if (name === 'reltohouseholdhead' && formData.roleinHousehold === 'Household Member') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                reltohouseholdhead: value ? '' : 'Required',
            }));
        }
    
        // Handle voter checkbox
        if (name === 'voter') {
            setFormData({ ...formData, voter: checked });
        }
    };     
    
      
    // Helper function to handle checkbox-specific validation
    const handleCheckboxValidation = (name, checked) => {
        if (name === 'voter' || name === 'indigent' || name === 'fourpsmember' || name === 'pwd' || name === 'soloparent' || name === 'seniorCitizen') {
            const errorKey = {
                indigent: 'indigent',
                fourpsmember: 'fourpsmember',
                pwd: 'pwdid_num',
                soloparent: 'soloparentid_num',
                seniorCitizen: 'seniorcitizenid_num',
            }[name];
    
            setErrors((prevErrors) => ({
                ...prevErrors,
                [errorKey]: checked ? 'Required' : '',
            }));
        }
    };
    
   // Helper function to handle changes to the household role
   const handleHouseholdRoleChange = (value) => {
    if (value === 'Household Head') {
        setFormData((prevFormData) => ({
            ...prevFormData,
            householdID: '',
            householdHead: '',
            reltohouseholdhead: '',
        }));
        setHouseholdMembers([]);
        setErrors((prevErrors) => ({
            ...prevErrors,
            householdID: '',
            reltohouseholdhead: '',
        }));
    } else if (value === 'Household Member') {
        if (!formData.householdID) {
            setErrors((prevErrors) => ({ ...prevErrors, householdID: 'Required' }));
        }
        if (!formData.reltohouseholdhead) {
            setErrors((prevErrors) => ({ ...prevErrors, reltohouseholdhead: 'Required' }));
        }
    } else if (value === '') {
        setFormData((prevFormData) => ({
            ...prevFormData,
            householdID: '',
            householdHead: '',
            reltohouseholdhead: '',
        }));
        setHouseholdMembers([]);
        setErrors((prevErrors) => ({
            ...prevErrors,
            householdID: '',
            reltohouseholdhead: '',
        }));
    }
};
    
     // Helper function to handle changes to the household ID
     const handleHouseholdIDChange = (value) => {
        if (value.trim() !== '') {
            fetchHouseholdByNumber(value);
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                householdHead: '',
            }));
            setHouseholdMembers([]);
            setErrors((prevErrors) => ({ ...prevErrors, householdID: 'Required' }));
        }
    };
    
    
 
    const handleInputBlur = (e) => {
        const { name, value } = e.target;
    
        // Check if the householdID field lost focus
        if (name === 'householdID') {
            if (errors.householdID) {
                // Show alert only if there's an error after losing focus
                alert(errors.householdID);
            }
        }
    };

   
    const calculateAge = (birthDate) => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachedFiles(prevFiles => [...prevFiles, ...files]);
    };

    const handleRemoveFile = (index) => {
        setAttachedFiles(prevFiles => prevFiles.filter((file, i) => i !== index));
    };        
    
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault(); // Prevent default form submission if `e` is provided
        }
    
        // Perform validation for email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.emailAddress)) {
            setErrors(prevErrors => ({ ...prevErrors, emailAddress: 'Invalid email format' }));
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please provide a valid email address.'
            });
            return;
        }
    
        // Validate if a valid ID is attached
        if (attachedFiles.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'No ID attached',
                text: 'Please attach at least one valid ID before submitting.'
            });
            return;
        }
    
        // Perform final validation for required fields
        const requiredFields = ['roleinHousehold', 'religion', 'occupation', 'emailAddress', 'mobileNumber'];
        const fieldErrors = {};
    
        requiredFields.forEach(field => {
            if (!formData[field]) {
                fieldErrors[field] = 'Required';
            }
        });
    
        // Check if there are any errors in required fields
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(prevErrors => ({ ...prevErrors, ...fieldErrors }));
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill out all required fields.'
            });
            return;
        }
    
        // Validate mobile number to ensure it's exactly 10 digits and starts with '9'
        if (formData.mobileNumber.length !== 10 || !formData.mobileNumber.startsWith('9')) {
            setErrors(prevErrors => ({ ...prevErrors, mobileNumber: 'Mobile number must be exactly 10 digits and start with 9.' }));
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please provide a valid 10-digit mobile number that starts with 9.'
            });
            return;
        }
    
        setLoading(true); // Set loading to true
    
          // Prepare the data for submission using FormData for file uploads
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'permanentAddress') {
                Object.keys(formData.permanentAddress).forEach(addressKey => {
                    formDataToSend.append(`permanentAddress[${addressKey}]`, formData.permanentAddress[addressKey]);
                });
            } else if (key === 'presentAddress') {
                Object.keys(formData.presentAddress).forEach(addressKey => {
                    formDataToSend.append(`presentAddress[${addressKey}]`, formData.presentAddress[addressKey]);
                });
            } else if (key === 'profilepic' && formData.profilepic instanceof File) {
                formDataToSend.append('profilepic', formData.profilepic);
            } else if (key === 'emailAddress') {
                formDataToSend.append('email', formData.emailAddress); // Map emailAddress to email
            } else if (key === 'birthday') {
                formDataToSend.append('birthday', formData.birthday); // Map birthday to birthday
            } else if (key === 'mobileNumber') {
                formDataToSend.append('contactNumber', formData.mobileNumber); // Map mobileNumber to contactNumber
            } else if (key === 'householdID') {
                formDataToSend.append(key, formData.householdID); // Make sure to append householdID
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });
    
        // Ensure 'reltohouseholdhead' is appended
        formDataToSend.append('reltohouseholdhead', formData.reltohouseholdhead);
    
        attachedFiles.forEach((file, index) => {
            formDataToSend.append('validIDs', file);
        });
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_KEY}/api/new/resident`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.status >= 200 && response.status < 300 && response.data.newResident) {
                const newResident = response.data.newResident;
                const { email, password, householdID } = newResident;
    
                const readableHouseholdID = await fetchReadablehouseholdID(householdID);
    
                setCredentials({
                    email: email || formData.emailAddress,
                    password: password || '',
                    householdID: readableHouseholdID || 'Not assigned',
                });
                setShowPopup(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'Please check your email for a verification link.'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Register',
                    text: 'Failed to create resident. Please try again.'
                });
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || 'An error occurred during registration.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error registering resident: ${errorMessage}`
                });
            } else if (error.request) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No response from the server. Please try again later.'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error registering resident: ${error.message}`
                });
            }
        } finally {
            setLoading(false); 
        }
    };    

    const fetchReadablehouseholdID = async (householdObjectId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/household/id/${householdObjectId}`);
            console.log('Full API Response:', response); // Debug log to inspect the response
    
            // Check if the response contains householdID and return it
            if (response.status === 200 && response.data && response.data.householdID) {
                console.log('Readable householdID found:', response.data.householdID); // Debug statement
                return response.data.householdID;  // Return the readable household number
            } else {
                console.error('Readable householdID not found in response data, using ObjectId as fallback.', response.data);
                return 'Not assigned';  // Return a fallback value if householdID is not found
            }
        } catch (err) {
            console.error('Error fetching readable householdID:', err);
            return 'Not assigned';  // Fallback to 'Not assigned' if there's an error
        }
    };
    
       
    const handleClosePopup = () => {
        setShowPopup(false);
        handleClear();
        clearPhoto(); // Clear the photo
        clearHouseholdMembers(); // Clear the household members
    };

        const handleClear = () => {
        setFormData({
            roleinHousehold: '',
            householdID: '',
            householdHead: '',
            reltohouseholdhead: '',
            lastName: '',
            firstName: '',
            middleName: '',
            suffix: '',
            sex: '',
            birthday: '',
            birthplace: '',
            age: '',
            occupation: '',
            nationality: '',
            religion: '',
            civilStatus: '',
            emailAddress: '',
            mobileNumber: '',
            profilepic: null, 
            voter: false,
            indigent: false,
            fourpsmember: false,
            pwd: false,
            soloparent: false,
            seniorCitizen: false,
            pwdid_num: '',
            soloparentid_num: '',
            seniorcitizenid_num: '',
            permanentAddress: {
                unitFloorRoomNo: '',
                building: '',
                blockNo: '',
                lotNo: '',
                phaseNo: '',
                houseNo: '',
                street: '',
                subdivision: ''
            },
            presentAddress: {
                unitFloorRoomNo: '',
                building: '',
                blockNo: '',
                lotNo: '',
                phaseNo: '',
                houseNo: '',
                street: '',
                subdivision: '',
                city: '',
                province: '',
                barangay: '',
                region: '',
                postalcode: '',
            },
            philsys_num: '',
            voters_id: '',
            sss_num: '',
            pagibig_num: '',
            philhealth_num: '',
            tin_num: ''
        });
        setErrors({
            roleinHousehold: 'Required',
            householdID: '',
            householdHead: '',
            reltohouseholdhead: '',
            lastName: 'Required',
            firstName: 'Required',
            sex: 'Required',
            birthday: 'Required',
            birthplace: 'Required',
            civilStatus: 'Required',
            religion: 'Required',
            occupation: 'Required',
            emailAddress: 'Required',
            mobileNumber: 'Required',
            nationality: 'Required',
            'permanentAddress.houseNo': 'Required',
            'permanentAddress.street': 'Required'
        });
        setAttachedFiles([]); // Clear attached files
    };

    const clearPhoto = () => {
        setProfilePic(null);  // Clear the `profilePic` state
        setFormData(prevFormData => ({ ...prevFormData, profilepic: null }));  // Clear profilepic in formData
    };

    const clearHouseholdMembers = () => {
        setHouseholdMembers([]);
    };  

    return (
        <div className="flex flex-col min-h-screen">
            {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="spinner-border text-white" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
            )}
            <Header userName={userName} userRole={userRole} handleLogout={handleLogout} />
            <div className="flex flex-1">
                <Navigation adminData={adminData} getCurrentDate={getCurrentDate} />
                {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="spinner-border text-white" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
                               <main className="flex-1 p-8 bg-gray-100">
                    <div className="flex items-center mb-7">
                        <button
                            className="text-xl text-gray-500 hover:text-[#1346AC] cursor-pointer font-semibold mr-10"
                            onClick={() => navigate('/ResidentManagement')}
                        >
                            &lt; Back
                        </button>
                        <h1 className="text-4xl font-bold">Register Resident</h1>
                    </div>
                    {/* Correctly add onSubmit to the form */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white p-6 rounded-lg shadow-md flex h-lg">
                            <div className="w-1/6">
                            <PhotoUpload
                                    profilepic={formData.profilepic}  
                                    handleClear={handleClear}
                                    handleSubmit={handleSubmit}
                                    setFormData={setFormData}
                                    clearPhoto={clearPhoto}
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto max-h-[800px] pl-6 scrollbar-hidden">
                                <h2 className="text-2xl font-semibold mb-6">Household Information</h2>
                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Household role</label>
                                        <select
                                            name="roleinHousehold"  
                                            value={formData.roleinHousehold}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                        >
                                            <option value="">Select Household role</option>
                                            <option value="Household Head">Household Head</option>
                                            <option value="Household Member">Household Member</option>
                                        </select>
                                        {errors.roleinHousehold && <p className="text-red-500 text-m mt-1">{errors.roleinHousehold}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Household No.</label>
                                        <input
                                            type="text"
                                            name="householdID"
                                            value={formData.householdID}
                                            onChange={handleInputChange}
                                            onBlur={handleInputBlur}
                                            disabled={formData.roleinHousehold === '' || formData.roleinHousehold === 'Household Head'}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Household No."
                                        />
                                        {errors.householdID && <p className="text-red-500 text-m mt-1">{errors.householdID}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Household Head</label>
                                        <input
                                            type="text"
                                            name="householdHead"
                                            readOnly
                                            value={formData.householdHead}
                                            onChange={handleInputChange}
                                            disabled={formData.roleinHousehold === '' || formData.roleinHousehold === 'Household Head'}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Household Head"
                                        />
                                    </div>
                                <div>
                                        <label className="block text-md font-medium text-gray-700">Relationship to Household Head</label>
                                        <select
                                            name="reltohouseholdhead"  
                                            value={formData.reltohouseholdhead}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            disabled={formData.roleinHousehold === 'Household Head'}
                                        >
                                            <option value="">Select Relationship</option>
                                            <option value="Wife">Wife</option>
                                            <option value="Husband">Husband</option>
                                            <option value="Son">Son</option>
                                            <option value="Daughter">Daughter</option>
                                            <option value="Niece">Niece</option>
                                            <option value="Grand Daughter">Grand Daughter</option>
                                            <option value="Grand Son">Grand Son</option>
                                            <option value="Uncle">Uncle</option>
                                            <option value="Aunt">Aunt</option>
                                            <option value="Cousin">Cousin</option>
                                        </select>
                                        {errors.reltohouseholdhead && <p className="text-red-500 text-m mt-1">{errors.reltohouseholdhead}</p>}
                                    </div>
                                    </div>
                                <h2 className="text-2xl font-semibold mt-6 mb-6">Household Members</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white">
                                        <thead>
                                            <tr className='border text-center'>
                                                <th className="py-2 border-r">Resident No.</th>
                                                <th className="py-2 border-r">Name</th>
                                                <th className="py-2 border-r">Sex</th>
                                                <th className="py-2 border-r">Age</th>
                                                <th className="py-2 border-r">Role</th>
                                                <th className="py-2 border-r">Contact Number</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {householdMembers.map((member, index) => (
                                                <tr key={index} className='border text-center'>
                                                    <td className="py-2 border-r">{member.residentID}</td>
                                                    <td className="py-2 border-r">{`${member.firstName} ${member.middleName ? member.middleName + ' ' : ''}${member.lastName}`}</td>
                                                    <td className="py-2 border-r">{member.sex}</td>
                                                    <td className="py-2 border-r">{member.age}</td>
                                                    <td className="py-2 border-r">{member.roleinHousehold}</td>
                                                    <td className="py-2 border-r">{member.contactNumber}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <h2 className="text-2xl font-semibold mt-6 mb-6">Personal Information</h2>
                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Last Name"
                                        />
                                        {errors.lastName && <p className="text-red-500 text-m mt-1">{errors.lastName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter First Name"
                                        />
                                        {errors.firstName && <p className="text-red-500 text-m mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Middle Name</label>
                                        <input
                                            type="text"
                                            name="middleName"
                                            value={formData.middleName}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Middle Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Suffix</label>
                                        <select
                                            name="suffix"
                                            value={formData.suffix || ''}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                        >
                                            <option value="">None</option>
                                            <option value="Junior">Jr.</option>
                                            <option value="Senior">Sr.</option>
                                            <option value="III">III</option>
                                            <option value="IV">IV</option>
                                            <option value="V">V</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Sex</label>
                                        <select
                                            name="sex"
                                            value={formData.sex}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                        >
                                            <option value="">Select Sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        {errors.sex && <p className="text-red-500 text-m mt-1">{errors.sex}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Birthdate</label>
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={formData.birthday}
                                            onChange={handleInputChange}
                                            max={new Date().toISOString().split('T')[0]} // Today's date
                                            min={new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split('T')[0]} 
                                            className="mt-1 block w-full pl-3 pr-2 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                        />
                                        {errors.birthday && <p className="text-red-500 text-m mt-1">{errors.birthday}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Birthplace</label>
                                        <input
                                            type="text"
                                            name="birthplace"
                                            value={formData.birthplace}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Birth Place"
                                        />
                                        {errors.birthplace && <p className="text-red-500 text-m mt-1">{errors.birthplace}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            readOnly
                                            className="mt-1 block w-full pl-3 pr-2 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                        />
                                    </div>
                                    <div>
                                        <Occupation
                                            selectedOccupation={formData.occupation}
                                            handleChange={handleInputChange}
                                        />
                                        {errors.occupation && <p className="text-red-500 text-m mt-1">{errors.occupation}</p>}
                                    </div>
                                    <div>
                                        <Nationalities
                                            selectedNationality={formData.nationality}
                                            handleChange={handleInputChange}
                                        />
                                        {errors.nationality && (
                                            <p className="text-red-500 text-m mt-1">{errors.nationality}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Religions
                                            selectedReligion={formData.religion}
                                            handleChange={handleInputChange}
                                        />
                                        {errors.religion && (
                                            <p className="text-red-500 text-m mt-1">{errors.religion}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Civil Status</label>
                                        <select
                                            name="civilStatus"
                                            value={formData.civilStatus}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                        >
                                            <option value="">Select Civil Status</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Separated">Separated</option>
                                            <option value="Annulled">Annulled</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                        {errors.civilStatus && <p className="text-red-500 text-m mt-1">{errors.civilStatus}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            name="emailAddress"
                                            value={formData.emailAddress}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Email Address"
                                        />
                                        {errors.emailAddress && <p className="text-red-500 text-m mt-1">{errors.emailAddress}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Mobile Number</label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 font-sm bg-gray-50 text-md">
                                                +63
                                            </span>
                                            <input
                                                type="text"
                                                name="mobileNumber"
                                                value={formData.mobileNumber}
                                                onChange={handleInputChange}
                                                className="flex-1 block w-full min-w-0 pl-3 pr-10 py-2 text-base border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                                placeholder="Enter Mobile Number"
                                            />
                                        </div>
                                        {errors.mobileNumber && <p className="text-red-500 text-m mt-1">{errors.mobileNumber}</p>}
                                    </div>
                                    <div className="mt-5 flex items-center">
                                    <input
                                            type="checkbox"
                                            name="voter"
                                            checked={formData.voter}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            disabled={formData.age < 16} 
                                        />
                                        <label className="ml-2 block text-md text-gray-900 mr-5">Voter</label>
                                        <input
                                            type="checkbox"
                                            name="indigent"
                                            checked={formData.indigent}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <label className="ml-2 block text-sm text-gray-900 mr-5">Indigent</label>
                                        <input
                                            type="checkbox"
                                            name="fourpsmember"
                                            checked={formData.fourpsmember}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <label className="ml-2 block text-md text-gray-900">4Ps</label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                {/* PWD Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="pwd"
                                            checked={formData.pwd}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <label className="ml-2 block text-md text-gray-900">PWD</label>
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">PWD ID No.</label>
                                        <input
                                            type="text"
                                            name="pwdid_num"
                                            value={formData.pwdid_num}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter PWD ID No."
                                            disabled={!formData.pwd}
                                        />
                                        {errors.pwdid_num && <p className="text-red-500 text-m mt-1">{errors.pwdid_num}</p>}
                                    </div>
                                </div>

                                {/* Solo Parent Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="soloparent"
                                            checked={formData.soloparent}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <label className="ml-2 block text-md text-gray-900">Solo Parent</label>
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Solo Parent ID No.</label>
                                        <input
                                            type="text"
                                            name="soloparentid_num"
                                            value={formData.soloparentid_num}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Solo Parent ID No."
                                            disabled={!formData.soloparent}
                                        />
                                        {errors.soloparentid_num && <p className="text-red-500 text-m mt-1">{errors.soloparentid_num}</p>}
                                    </div>
                                </div>

                                {/* Senior Citizen Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="seniorCitizen"
                                            checked={formData.seniorCitizen}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            disabled={formData.age < 60}
                                        />
                                        <label className="ml-2 block text-md text-gray-900">Senior Citizen</label>
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Senior Citizen ID No.</label>
                                        <input
                                            type="text"
                                            name="seniorcitizenid_num"
                                            value={formData.seniorcitizenid_num}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Senior Citizen ID No."
                                            disabled={!formData.seniorCitizen}
                                        />
                                        {errors.seniorcitizenid_num && <p className="text-red-500 text-m mt-1">{errors.seniorcitizenid_num}</p>}
                                    </div>
                                </div>
                            </div>

                                <h2 className="text-2xl font-semibold mt-6 mb-6">Permanent Address</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Unit/Floor/Room No.</label>
                                        <input
                                            type="text"
                                            name="permanentAddress.unitFloorRoomNo"
                                            value={formData.permanentAddress.unitFloorRoomNo}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Unit/Floor/Room No."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Building</label>
                                        <input
                                            type="text"
                                            name="permanentAddress.building"
                                            value={formData.permanentAddress.building}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Building"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Block No.</label>
                                        <input
                                            type="text"
                                            name="permanentAddress.blockNo"
                                            value={formData.permanentAddress.blockNo}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Block No."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Lot No.</label>
                                        <input
                                            type="text"
                                            name="permanentAddress.lotNo"
                                            value={formData.permanentAddress.lotNo}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Lot No."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Phase No.</label>
                                        <input
                                            type="text"
                                            name="permanentAddress.phaseNo"
                                            value={formData.permanentAddress.phaseNo}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Phase No."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">House No.</label>
                                        <input
                                            type="text"
                                            name="permanentAddress.houseNo"
                                            value={formData.permanentAddress.houseNo}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter House No."
                                        />
                                        {errors['permanentAddress.houseNo'] && <p className="text-red-500 text-m mt-1">{errors['permanentAddress.houseNo']}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Street</label>
                                        <input
                                            type="text"
                                            name="permanentAddress.street"
                                            value={formData.permanentAddress.street}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Street"
                                        />
                                        {errors['permanentAddress.street'] && <p className="text-red-500 text-m mt-1">{errors['permanentAddress.street']}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Subdivision</label>
                                        <input
                                            type="text"
                                            name="permanentAddress.subdivision"
                                            value={formData.permanentAddress.subdivision}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Subdivision"
                                        />
                                    </div>
                                </div>
                                <PresentAddress formData={formData} handleInputChange={handleInputChange} errors={errors} />
                                    <div className="flex items-center justify-start mt-8 flex-wrap">
                                        <label className="text-md font-medium text-gray-700 mr-2">
                                            Same as Permanent Address
                                        </label>
                                        <input
                                            type="checkbox"
                                            name="sameAsPermanent"
                                            checked={sameAsPermanent}
                                            onChange={handleInputChange}
                                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                    </div>
                                <h2 className="text-2xl font-semibold mt-6 mb-6">Other Information</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">PhilSys No.</label>
                                        <input
                                            type="text"
                                            name="philsys_num"
                                            value={formData.philsys_num}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter PhilSys No."
                                        />
                                    </div>
                                    <div>
                                    <label className="block text-md font-medium text-gray-700">Voters ID No. (Optional)</label>
                                    <input
                                        type="text"
                                        name="voters_id"
                                        value={formData.voters_id}
                                        onChange={handleInputChange}
                                        className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                        placeholder="Enter Voters ID No. (Optional)"
                                        disabled={!formData.voter} 
                                    />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">SSS ID No.</label>
                                        <input
                                            type="text"
                                            name="sss_num"
                                            value={formData.sss_num}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter SSS ID No."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Pag-IBIG MID No.</label>
                                        <input
                                            type="text"
                                            name="pagibig_num"
                                            value={formData.pagibig_num}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Pag-IBIG MID No."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Philhealth No.</label>
                                        <input
                                            type="text"
                                            name="philhealth_num"
                                            value={formData.philhealth_num}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter Philhealth No."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">TIN</label>
                                        <input
                                            type="text"
                                            name="tin_num"
                                            value={formData.tin_num}
                                            onChange={handleInputChange}
                                            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                                            placeholder="Enter TIN"
                                        />
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <label className="text-2xl font-semibold mt-6 mb-6">Attach Valid IDs</label>
                                    <div>
                                        <button
                                            type="button"
                                            className="border mt-4 block border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            style={{ width: "100px", height: "100px" }}
                                            onClick={() => document.getElementById('file-upload').click()}
                                        >
                                            <div className="flex justify-center items-center h-full">
                                                <span className="text-4xl font-bold">+</span>
                                            </div>
                                        </button>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            style={{ display: 'none' }}
                                            multiple
                                            onChange={handleFileChange}
                                        />
                                        <div className="mt-2 flex flex-wrap gap-4">
                                            {attachedFiles.map((file, index) => (
                                                <div key={index} className="flex flex-col items-center">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="Attached file"
                                                        className="max-w-xs max-h-xs object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="bg-red-500 text-white px-2 py-1 rounded-full mt-2"
                                                        onClick={() => handleRemoveFile(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
            {showPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-10 rounded-lg shadow-lg" style={{ height: '300px' }}>
                        <h2 className="text-2xl font-semibold mb-4">Login Credentials</h2>
                        <p className="mb-2">Email: {credentials.email || 'Not available'}</p>
                        <p className="mb-2">Password: {credentials.password || 'Not available'}</p>
                        {credentials.householdID && <p className="mb-4">Household No: {credentials.householdID}</p>}
                        <div className="mb-2">
                            <button
                                onClick={() => { setShowPopup(false); handleClear(); clearPhoto(); clearHouseholdMembers(); }}
                                className="bg-[#1346AC] text-white px-4 py-2 rounded-full font-semibold w-full"
                            >
                                Add Another Resident
                            </button>
                        </div>
                        <button
                            onClick={() => { setShowPopup(false); handleClear(); clearPhoto(); clearHouseholdMembers(); handleClosePopup();}}
                            className="bg-transparent border border-[#1346AC] text-[#1346AC] px-4 py-2 rounded-full font-semibold w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddResident;
