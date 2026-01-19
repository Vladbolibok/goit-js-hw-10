import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const btnStart = document.querySelector('button[data-start]');
const input = document.querySelector('#datetime-picker');
const day = document.querySelector('span[data-days]');
const hour = document.querySelector('span[data-hours]');
const minute = document.querySelector('span[data-minutes]');
const second = document.querySelector('span[data-seconds]');

let selectedDate = null;
btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userSelectedDate = selectedDates[0];
    if (userSelectedDate <= new Date()) {
      btnStart.disabled = true;

      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    } else {
      selectedDate = userSelectedDate;
      btnStart.disabled = false;

      iziToast.success({
        title: 'OK',
        message: 'You can press "Start"!',
      });
    }
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const addLeadingZero = value => value.toString().padStart(2, '0');
function updateTimerInterface({ days, hours, minutes, seconds }) {
  day.textContent = addLeadingZero(days);
  hour.textContent = addLeadingZero(hours);
  minute.textContent = addLeadingZero(minutes);
  second.textContent = addLeadingZero(seconds);
}

btnStart.addEventListener('click', () => {
  btnStart.disabled = true;
  input.disabled = true;

  const animatedDiv = document.querySelector('#animatedDiv');
  animatedDiv.classList.add('animated');

  const timerId = setInterval(() => {
    const currentTime = new Date();
    const timeDiff = selectedDate - currentTime; // Використання збереженої дати

    if (timeDiff <= 0) {
      clearInterval(timerId);
      updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      input.disabled = false;
      animatedDiv.classList.remove('animated');
      return;
    }

    const timeValues = convertMs(timeDiff);
    updateTimerInterface(timeValues);
  }, 1000);
});
