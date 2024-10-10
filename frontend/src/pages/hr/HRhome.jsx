import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SidebarNav from '../../components/sidebarNav.jsx';
import Header from '../../components/header.jsx';
// import './style/index.css';
import profile2 from './assets/profile2.png';
import MessagingFloat from './MessageFloat.jsx';
import HRheader from './HRheader.jsx';
import axios from 'axios';


function HRhome() {
    // Get user data from Redux state
    const user = useSelector((state) => state.auth.data[0]); // Accessing the first user object

    console.log("User Data:", user); // Log user data for debugging
    if (!user) {
        return <div>Loading...</div>; // Display loading state if user data is not yet available
    }

    const position = useSelector((state)=> state.auth.position)
    const [workedHours, setWorkedHours] = useState(0);
    const [OvertimeHours, setOvertimeHours] = useState(0);
    const [clockInTime, setClockInTime] = useState(null);
    const [clockOutTime, setClockOutTime] = useState(null);

    useEffect(()=>{
        if(user) {
            axios.get(`http://localhost:8080/api/workedhours/${user.ID_Number}`)
                .then((response)=> {
                    setWorkedHours(response.data.totalHoursWorked);
                    setOvertimeHours(response.data.overtimeHours);
                })
                .catch((error)=>{
                    console.error("Error fetching worked hours:", error)
                });

            axios.get(`http://localhost:8080/api/clocktimes/${user.ID_Number}`)
                .then((response) => {
                    setClockInTime(response.data.clockInTime || "Not clocked in");
                    setClockOutTime(response.data.clockOutTime || "Not clocked out");
                })
                .catch((error) => {
                    console.error("Error fetching clock times:", error);
                });
        }
    }, [user])

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {/* <HRheader /> */}
            <Header />
            <SidebarNav position={position}/>
            <div className='main-content'>
            <div className="homecontent">
                <h4 className='greeting'>Welcome {user.Name}</h4>
                <div className='innerhomecontent'>
                    <div className='innercontent1'>
                        <h4>Profile</h4>
                        <img src={profile2} alt='Profile Image' />
                        <table className='detailtable'>
                            <tbody>
                                <tr>
                                    <td className='hrdetails'>Name: </td>
                                    <td>{user.Name}</td>
                                </tr>
                                <tr>
                                    <td className='hrdetails'>Surname: </td>
                                    <td>{user.Surname}</td>
                                </tr>
                                <tr>
                                    <td className='hrdetails'>ID Number: </td>
                                    <td>{user.ID_Number}</td>
                                </tr>
                                <tr>
                                    <td className='hrdetails'>Date of Birth: </td>
                                    <td>{user.DOB}</td>
                                </tr>
                                <tr>
                                    <td className='hrdetails'>Gender: </td>
                                    <td>{user.Gender || "Not specified"}</td> {/* Assuming Gender is part of user data */}
                                </tr>
                                <tr>
                                    <td className='hrdetails'>Nationality: </td>
                                    <td>{user.Nationality}</td>
                                </tr>
                                <tr>
                                    <td className='hrdetails'>Language: </td>
                                    <td>{user.Home_Language}</td>
                                </tr>
                                <tr>
                                    <td className='hrdetails'>Position: </td>
                                    <td>{user.Position}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div className='clockingsection'>
                            <hr />
                            <div className='clockingtimes'>
                            <p>Current time: <h5>{new Date().toLocaleTimeString()}</h5></p>
                                <p>Time clocked-In: <h5>{clockInTime}</h5></p>
                                <p>Time-clocked-out: <h5>{clockOutTime}</h5></p>
                            </div>
                            <button className='clockinbutton'>Clock-In</button>
                            <button className='clockoutbutton'>Clock-Out</button>
                            <hr />
                        </div>
                        <div className='clockingsection'>
                                <hr />
                                <h4>Worked Hours This Month</h4>
                                <p>Total Worked Hours: {workedHours} hours</p>
                                <p>Overtime Hours: {OvertimeHours} hours</p>
                                <hr />
                            </div>
                        <MessagingFloat />
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default HRhome;
