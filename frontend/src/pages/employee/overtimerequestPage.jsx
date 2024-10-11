import React, { useEffect, useState } from 'react';
import '../../styles/OvertimerequestPage.css'; // Assuming you use a CSS file for styles
import Header from '../../components/header';
import SidebarNav from '../../components/sidebarNav';
import { useDispatch, useSelector } from 'react-redux';
import { createOvertimeRequest } from '../../overtimeSlice';

function OvertimerequestPage() {
  const [employeeName, setName] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [reason, setReason] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const dispatch = useDispatch();
  
  const position = useSelector((state) => state.auth.position);

  const calculateDuration = (start, end) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute);

    const diffInMs = endDate - startDate;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours > 0 ? diffInHours : 0;
  };

  useEffect(() => {
    if (startTime && endTime) {
      const calculatedDuration = calculateDuration(startTime, endTime);
      setDuration(calculatedDuration.toFixed(2));
    }
  }, [startTime, endTime]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      employeeName &&
      date &&
      startTime &&
      endTime &&
      duration &&
      reason
    ) {
      dispatch(createOvertimeRequest({
        employeeName,
        position, // Include the position here
        date,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        duration,
        reason,
      }));
    }

    // Reset form fields
    setName("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setDuration("");
    setReason("");
  };

  return (
    <>
      <Header />
      <SidebarNav position={position} />
      <div className='main-content'>
        <div className="overtime-request-page">
          <h2>Overtime Request Form</h2>
          <form onSubmit={handleSubmit} className="overtime-form">
            <div className="form-group">
              <label htmlFor="employeeName">Employee Name</label>
              <input
                type="text"
                id="employeeName"
                name="employeeName"
                value={employeeName}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="startTime">Overtime Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">Overtime End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="hoursWorked">Duration</label>
              <input
                type="number"
                id="hoursWorked"
                name="hoursWorked"
                value={duration}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="reason">Reason for Overtime</label>
              <textarea
                id="reason"
                name="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default OvertimerequestPage;
