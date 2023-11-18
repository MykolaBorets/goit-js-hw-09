import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let countdownInterval;

const addLeadingZero = value => value.toString().padStart(2, '0');

const convertMs = ms => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
};

const updateTimer = ms => {
  const { days, hours, minutes, seconds } = convertMs(ms);

  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
};

const startTimer = () => {
  const selectedDate = new Date(datetimePicker.value).getTime();
  const currentDate = Date.now();
  const timeDifference = selectedDate - currentDate;

  if (timeDifference < 0) {
    Notiflix.Notify.failure('Please choose a date in the future');
    return;
  }

  updateTimer(timeDifference);

  countdownInterval = setInterval(() => {
    const currentTime = Date.now();
    const updatedTimeDifference = selectedDate - currentTime;

    if (updatedTimeDifference <= 0) {
      clearInterval(countdownInterval);
      updateTimer(0);
      startButton.disabled = true;
    } else {
      updateTimer(updatedTimeDifference);
    }
  }, 1000);
};

startButton.addEventListener('click', startTimer);

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0].getTime();
    const currentDate = Date.now();
    const timeDifference = selectedDate - currentDate;

    if (timeDifference <= 0) {
      startButton.disabled = true;
      Notiflix.Notify.failure('Please choose a date in the future');
      return;
    } else {
      startButton.disabled = false;
    }
  },
});
