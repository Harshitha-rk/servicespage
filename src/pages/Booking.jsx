import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Booking.css";

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const FULL_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS = [2025, 2026, 2027];
const TIMES = ["9:00 am","9:30 am","10:00 am","10:30 am","11:00 am","11:30 am","12:00 pm","1:00 pm","1:30 pm","2:00 pm","2:30 pm","3:00 pm","3:30 pm","4:00 pm"];

const today = new Date();

const isPastDate = (y, m, d) => {
  const date = new Date(y, m, d);
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return date < base;
};

const getCalendarMatrix = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
};

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialServices = location.state?.services || [];

  const [selectedServices] = useState(initialServices);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const CALENDAR = getCalendarMatrix(year, month);

  const selectedDayName = selectedDate
    ? FULL_DAYS[new Date(year, month, selectedDate).getDay()]
    : "";

  const totalAmount = selectedServices.reduce((sum, s) => {
    const p = Number(String(s.price).replace(/[^\d]/g, ""));
    return sum + (isNaN(p) ? 0 : p);
  }, 0);

  return (
    <div className="booking-container">

      <button className="back-arrow" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="booking-layout">

        {/* LEFT */}
        <div className="calendar-section">
          <h1>Schedule your service</h1>
          <p className="subtitle">Choose date and time</p>

          <div className="row">
            <select value={month} onChange={e => {
              setMonth(+e.target.value);
              setSelectedDate(null);
              setSelectedTime(null);
            }}>
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>

            <select value={year} onChange={e => {
              setYear(+e.target.value);
              setSelectedDate(null);
              setSelectedTime(null);
            }}>
              {YEARS.map(y => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="scheduler-row">
            <div className="calendar-grid">
              {DAYS.map(d => (
                <div key={d} className="day-label">{d}</div>
              ))}

              {CALENDAR.map((d, i) =>
                d ? (
                  <button
                    key={i}
                    className={`date ${selectedDate === d ? "selected" : ""}`}
                    disabled={isPastDate(year, month, d)}
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedTime(null);
                    }}
                  >
                    {d}
                  </button>
                ) : (
                  <div key={i} className="empty" />
                )
              )}
            </div>

            {selectedDate && (
              <div className="time-section">
                <h4>Available timings</h4>
                <div className="time-grid">
                  {TIMES.map(t => (
                    <button
                      key={t}
                      className={`time-box ${selectedTime === t ? "selected-time" : ""}`}
                      onClick={() => setSelectedTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="summary">
          <h3>Service Details</h3>

          {selectedServices.map((s, i) => (
            <div key={i} className="service-card">
              <strong>{s.name || s.title}</strong>
              <p>{s.duration}</p>
              <p>{s.price}</p>

              {selectedDate && selectedTime && (
                <p>
                  {selectedDayName}, {selectedDate} {MONTHS[month]} at {selectedTime}
                </p>
              )}
            </div>
          ))}

          <div className="total-row">
            <span>Total</span>
            <strong>₹{totalAmount}</strong>
          </div>

          <button
            className="next-btn"
            disabled={!(selectedDate && selectedTime && selectedServices.length)}
            onClick={() =>
              navigate("/payment", {
                state: {
                  services: selectedServices,
                  date: selectedDate,
                  time: selectedTime,
                  month,
                  year,
                  total: totalAmount
                }
              })
            }
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
