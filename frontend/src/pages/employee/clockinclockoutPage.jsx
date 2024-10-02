import React, { useEffect, useState } from 'react'
import SidebarNav from '../../components/sidebarNav'
import Header from '../../components/header'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function ClockinclockoutPage() {
  const position = useSelector((state)=> state.auth.position)

  const [clockedIn, setClockedIn] = useState(false);
  const [message, setMessage] = useState('')
  const [log, setLog] = useState(()=>{
    const savedLog = localStorage.getItem('clockLog');
    return savedLog ? JSON.parse(savedLog) : [];
  });
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [typing, setTyping] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    const updateClock = () => {
      const now = new Date();
      const secondsRatio = now.getSeconds() / 60;
      const minutesRatio = (secondsRatio + now.getMinutes()) / 60;
      const hoursRatio = (minutesRatio + now.getHours()) / 12;

      document.getElementById('hour-hand').style.setProperty('--rotation', hoursRatio * 360);
      document.getElementById('minute-hand').style.setProperty('--rotation', minutesRatio * 360);
      document.getElementById('second-hand').style.setProperty('--rotation', secondsRatio * 360);
    };

    updateClock(); // Initial call
    const intervalId = setInterval(updateClock, 1000); // Update clock every second

    return () => clearInterval(intervalId);
  }, [])

  const handleClockAction = (action) => {
    const currentDate = new Date();
    const newEntry = {
      action,
      time: currentDate.toLocaleTimeString(),
      date: currentDate.toLocaleDateString(),
    };

    setLog((prevLog) => {
      const updatedLog = [newEntry, ...prevLog];
      localStorage.setItem('clockLog', JSON.stringify(updatedLog));
      return updatedLog;
    });

    if (action === 'Clock In') {
      setMessage('Welcome back!');
      setVideoPlaying(true);
      setTimeout(() => {
        setVideoPlaying(false);
        setClockedIn(true);
      }, 5000);
    } else {
      setMessage('Goodbye, see you next time!');
      setVideoPlaying(true);
      setTimeout(() => {
        setVideoPlaying(false);
        setClockedIn(false);
      }, 5000);
    }
  };

  return (
    <>
      <Header />
      <SidebarNav position={position}/>
      <div className="main-content">
        <h2>Clock In/Out</h2>
        <div className="clock">
          <div className="hand hour" id="hour-hand"></div>
          <div className="hand minute" id="minute-hand"></div>
          <div className="hand second" id="second-hand"></div>
        </div>
        <div className="button-container">
            <button
              className={`clock-btn ${clockedIn ? 'disabled' : 'green-btn'}`}
              onClick={() => handleClockAction('Clock In')}
              disabled={clockedIn}
            >
              Clock In
            </button>

            <button
              className={`clock-btn ${!clockedIn ? 'disabled' : 'red-btn'}`}
              onClick={() => handleClockAction('Clock Out')}
              disabled={!clockedIn}
            >
              Clock Out
            </button>
          </div>

          {videoPlaying && (
            <div className="video-container">
              <video width="320" height="240" autoPlay>
                <source src="Cartoon.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="message-container">
            {typing ? (
              <p className="typing-text">{message}</p>
            ) : (
              message && <p className={`typing-text ${clockedIn ? 'green-text' : 'red-text'}`}>{message}</p>
            )}
          </div>
          <div className="log-container">
            <h2>Clock Log</h2>
            <ul>
              {log.slice(0, 5).map((entry, index) => (
                <li key={index}>
                  {entry.date} - {entry.action} at {entry.time}
                </li>
              ))}
            </ul>
          </div>
      </div>
    </>
  )
}

export default ClockinclockoutPage