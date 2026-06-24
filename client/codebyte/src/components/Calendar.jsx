import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { styled } from 'styled-components';
import 'react-calendar/dist/Calendar.css';

function CalendarApp(props) {
  const streak = props.dates;
  
  const tileClassNames = ({ date }) => {
    const selectedDates = streak?.map(date => new Date(date));
    // Convert MongoDB date strings to Date objects
    return selectedDates?.find(selectedDate => isSameDay(date, selectedDate)) ? 'selected' : '';
  };
  // Function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <Container>
      <Calendar className='main' calendarType='gregory'
        minDetail='month' tileClassName={tileClassNames} />
    </Container>
  );
}

const Container = styled.div`
  .react-calendar {
    max-width: 320px;
    background: #181818; /* Background color for the calendar */
    color: #ffffff80; /* Text color for the calendar */
    font-size: 1.15rem;
    border: 1px solid #333;
    padding: 10px;
    padding-bottom: 25px;
    border-radius: 12px;
  }

  .react-calendar__month-view__days__day {
    color: #fff; /* Color for days */;
    opacity: 0.9;
    border-radius:50%;
    &:hover{
      background-color:#181818;
    }
    &:focus{
      background-color:transparent;
    }
  } 

  .react-calendar__navigation button{
    color: #fff; /* Navigation button color */
    background-color: #181818;
    &:hover{
      background-color:#3333334D;
    }
    &:focus{
      background-color:#3333334D;
    }
  }

  .react-calendar__navigation__label{
    &:hover{
      background-color:#181818 !important;
    }
    &:focus{
      background-color:#3333334D !important;
    }
    &:disabled{
      background-color:#181818 !important
    }
  } 

  .react-calendar__navigation__label__labelText {
    &:hover{
      background-color:#181818 !important;
    }
    &:focus{
      background-color:#3333334D;
    }
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none; /* Remove underline for day names */;
    color: rgba(255,255,255,0.7);
  }

  .react-calendar__tile ,.react-calendar__tile--active{
    &:hover{
    background: #3333334D; /* New hover color */
    color: #fff;
    }
  }

  .react-calendar__tile--active,.react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus{
    background: transparent;
  }

  .react-calendar__month-view__days__day--weekend {
    color: #eb2632; /* Color for weekend days */
    &:hover{
      color: #eb2632;
    }
  }

  .react-calendar__tile--now {
    background: #ffffff80 !important; /* Color for the current day tile */
    color: #333;
  }

  .selected,.react-calendar__tile--hasActive {
    background: radial-gradient(circle, #FFC107, #FF5722) !important;
    color: black;
    &:hover{
      color: black;
      background: radial-gradient(circle, #FFC107, #FF5722);
    }
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #666; /* Color for days in the neighboring months */
    &:hover{
      color: #666;
    }
  }

`

export default CalendarApp;
