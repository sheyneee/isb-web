import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCityData, get5DaysForecast } from '../../../Store/Slices/WeatherSlice';
import humidity from '../../../assets/icons/humidity.png';
import wind from '../../../assets/icons/wind.png';
import ResidentAnnouncement from '../../../component/Resident/ResidentAnnouncement';
import ResidentHeader from '../../../component/Resident/ResidentHeader';
import HomepageCards from '../../../component/Resident/HomepageCards';

const ResidentHome = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [residentData, setResidentData] = useState(null);
    const [city, setCity] = useState('Cavite');
    const [unit, setUnit] = useState('metric');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCityData({ city, unit }));
        dispatch(get5DaysForecast({ city, unit }));
    }, [city, unit, dispatch]);

    const { citySearchData, forecastData } = useSelector((state) => state.weather);

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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const filteredForecast = forecastData?.list ? forecastData.list.filter((data) => data.dt_txt.endsWith('12:00:00')) : [];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Fixed Header */}
            <div className="fixed top-0 w-full z-50">
                <ResidentHeader userName={userName} userRole={userRole} handleLogout={handleLogout} residentData={residentData} />
            </div>
            <div className="flex-1 overflow-y-auto pt-20 scrollbar-thick max-h-screen">
                <main className="flex-1 p-8 bg-gray-100">
                    <h1 className="text-4xl font-bold mb-5">Home</h1>
                    <div className="flex flex-wrap -mx-2">
                        {/* Weather Section */}
                        <div className="w-full lg:w-1/2 px-2 mb-4">
                            <div className="bg-[#009FF4] p-2 rounded shadow" style={{ height: '139px' }}>
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
                                                    <h4 className="city-name text-1x3 font-semibold uppercase mb-5">
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
                                                            <span className="font-semibold">{citySearchData.data.wind.speed} {unit === 'metric' ? 'km/h' : 'mph'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                {filteredForecast.map((data, index) => {
                                                    const date = new Date(data.dt_txt);
                                                    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                                                    return (
                                                        <div key={index} className="text-center p-2 mr-1">
                                                            <div className="font-semibold">{day}</div>
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
                        </div>

                        {/* Announcement Section */}
                        <div className="w-full lg:w-1/2 px-2 mb-4">
                            <ResidentAnnouncement />
                        </div>

                        {/* Cards Section */}
                        <div className="w-full flex justify-center mt-4">
                            <HomepageCards />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ResidentHome;
