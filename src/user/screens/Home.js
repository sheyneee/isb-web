import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCityData, get5DaysForecast } from '../../Store/Slices/WeatherSlice';
import humidity from '../../assets/icons/humidity.png';
import wind from '../../assets/icons/wind.png';
import Header from '../../component/Header';
import Navigation from '../../component/Navigation';
import IncidentReport from '../../component/IncidentReport';
import DocumentRequest from '../../component/DocumentRequest';
import Announcement from '../../component/Announcement';

const Home = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [adminData, setAdminData] = useState(null);
    const [city, setCity] = useState('Cavite');
    const [unit, setUnit] = useState('metric');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCityData({ city, unit }));
        dispatch(get5DaysForecast({ city, unit }));
    }, [city, unit, dispatch]);

    const {
        citySearchLoading,
        citySearchData,
        forecastLoading,
        forecastData,
        forecastError,
    } = useSelector((state) => state.weather);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            const firstName = capitalizeWords(user.firstName);
            const lastName = capitalizeWords(user.lastName);
            const middleInitial = user.middleName ? `${capitalizeWords(user.middleName.charAt(0))}.` : '';
            setUserName(`${firstName} ${middleInitial} ${lastName}`);
            setAdminData(user);
            setUserRole(user.roleinBarangay);
            
            // Log user role to console
            console.log('Current user roleinBarangay:', user.roleinBarangay);
        }
    }, []);
    

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

    const filteredForecast = forecastData?.list ? forecastData.list.filter((data) =>
        data.dt_txt.endsWith('12:00:00')
    ) : [];

    return (
        <div className="flex flex-col min-h-screen scrollbar-thick overflow-y-auto h-64">
            <Header userName={userName} userRole={userRole} handleLogout={handleLogout} />
            <div className="flex flex-1">
                <Navigation adminData={adminData} getCurrentDate={getCurrentDate} />
                <main className="flex-1 p-8 bg-gray-100">
                    <h1 className="text-4xl font-bold mb-5">Dashboard</h1>
                    <div className="flex flex-wrap -mx-2">
                        <div className="w-full lg:w-1/2 px-2">
                            <div className=" bg-[#009FF4] p-2 rounded shadow" style={{ height: '139px' }}>
                                <div className="flex flex-col lg:flex-row justify-between items-center text-white">
                                    {citySearchData && citySearchData.data ? (
                                        <>
                                            <div className="flex flex-col lg:flex-row items-center">
                                                <div className="text-center mr-3">
                                                    <div className="text-sm uppercase font-bold mt-3 ml-3 mr-2">
                                                        {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                                                    </div>
                                                    <div className="text-5xl ml-4 font-bold">
                                                        {Math.round(citySearchData.data.main.temp)}&deg;
                                                    </div>
                                                    <h4 className=" city-name text-1x3 font-semibold uppercase mb-5">
                                                        {citySearchData.data.name}
                                                    </h4>
                                                </div>
                                                <div className="flex flex-col md:flex-row items-center mt-1">
                                                    <div className="block mr-1">
                                                        <div className="flex items-center mb-2 font-semibold">
                                                            <img src={humidity} alt="Humidity" className="w-7 h-7 mr-2" />
                                                            <span className="font-semibold">{citySearchData.data.main.humidity}%</span>
                                                        </div>
                                                        <div className="flex items-center mb-9">
                                                            <img src={wind} alt="Wind" className="w-7 h-7 mr-2" />
                                                            <span className='font-semibold'>{citySearchData.data.wind.speed} {unit === 'metric' ? 'km/h' : 'mph'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex">
                                            {filteredForecast.map((data, index) => {
                                                const date = new Date(data.dt_txt);
                                                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                                                return (
                                                    <div key={index} className="text-center  p-2 mr-1">
                                                        <div className='font-semibold'>{day}</div>
                                                        <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="icon" className="w-13 h-13" />                                                        
                                                    </div>
                                                );
                                            })}
                                            </div>
                                        </>
                                    ) : (
                                        <div>Loading...</div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-5">
                                <Announcement/>
                            </div>
                            <div className="mt-5">
                                <IncidentReport />
                            </div>
                            <div className="mt-5">
                                <DocumentRequest />
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 px-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                                    <h2 className="text-lg">Pending Incident Reports</h2>
                                    <p className="text-2xl font-semibold">0</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                                    <h2 className="text-lg">Pending Document Requests</h2>
                                    <p className="text-2xl font-semibold">0</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                                    <h2 className="text-lg">Pending Resident Verification</h2>
                                    <p className="text-2xl font-semibold">0</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                                    <h2 className="text-lg">Pending Profile Update Requests</h2>
                                    <p className="text-2xl font-semibold">0</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                                    <h2 className="text-lg">Total Population</h2>
                                    <p className="text-2xl font-semibold">1236</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                                    <h2 className="text-lg">Total Voters</h2>
                                    <p className="text-2xl font-semibold">1200</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                                    <h2 className="text-lg">Total Indigent</h2>
                                    <p className="text-2xl font-semibold">223</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                                    <h2 className="text-lg">Total PWDs</h2>
                                    <p className="text-2xl font-semibold">53</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                                    <h2 className="text-lg">Total Senior Citizens</h2>
                                    <p className="text-2xl font-semibold">300</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                                    <h2 className="text-lg">Total Solo Parents</h2>
                                    <p className="text-2xl font-semibold">100</p>
                                </div>
                                <div className="bg-white p-4 rounded shadow flex flex-col justify-between" style={{ height: '110px', width: '100%' }}>
                                    <h2 className="text-lg">Total 4Ps Beneficiaries</h2>
                                    <p className="text-2xl font-semibold">203</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;
