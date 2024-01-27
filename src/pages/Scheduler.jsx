import { useState } from 'react';
import SchedulerDay from '../components/SchedulerDay';
import { FaArrowRight } from 'react-icons/fa6';
import { FaArrowLeft } from 'react-icons/fa6';

function Scheduler({ clients, setDueDateChanged, dueDateChanged }) {
  const [clientDueDateModal, setClientDueDateModal] = useState(false);

  const newDate = new Date();

  function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  function getWeekFromDate(d) {
    const week = [getMonday(d)];
    for (let i = 1; i < 7; i++) {
      let nextDay = new Date(week[i - 1]);
      nextDay.setDate(nextDay.getDate() + 1);
      week.push(nextDay);
    }
    return week;
  }

  const [currentWeek, setCurrentWeek] = useState(getWeekFromDate(newDate));
  const [currentWeekAsDateString, setCurrentWeekAsDateString] = useState(
    currentWeek.map((day) => day.toDateString())
  );

  function goToNextWeek() {
    let nextWeekStart = new Date(currentWeek[6]);
    nextWeekStart.setDate(nextWeekStart.getDate() + 1);
    setCurrentWeek(getWeekFromDate(nextWeekStart));
    setCurrentWeekAsDateString(
      getWeekFromDate(nextWeekStart).map((day) => day.toDateString())
    );
  }

  function goToPreviousWeek() {
    let previousWeekStart = new Date(currentWeek[0]);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    setCurrentWeek(getWeekFromDate(previousWeekStart));
    setCurrentWeekAsDateString(
      getWeekFromDate(previousWeekStart).map((day) => day.toDateString())
    );
  }

  return (
    <div className="schedulerContainer">
      <div className="schedulerCard">
        <div className="schedulerTitle">
          <button onClick={goToPreviousWeek} className="previousWeekButton">
            <FaArrowLeft />
          </button>
          <h2>Client Scheduler</h2>
          <button onClick={goToNextWeek} className="nextWeekButton">
            <FaArrowRight />
          </button>
        </div>
        <div className="schedulerBody">
          <div className="schedulerDayContainer">
            {currentWeek.map((day) => {
              return (
                <SchedulerDay
                  key={day}
                  day={day.toLocaleDateString('en-US', { weekday: 'long' })}
                  date={day.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  clients={clients}
                  currentWeek={currentWeek}
                  newDate={newDate}
                  setClientDueDateModal={setClientDueDateModal}
                  clientDueDateModal={clientDueDateModal}
                  setDueDateChanged={setDueDateChanged}
                  dueDateChanged={dueDateChanged}
                  currentWeekAsDateString={currentWeekAsDateString}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scheduler;
