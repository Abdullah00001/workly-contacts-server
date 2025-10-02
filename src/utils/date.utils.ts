import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const DateUtils = {
  formatDate: (isoDateString: string): string => {
    try {
      const date = new Date(isoDateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
      }

      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch (error) {
      throw new Error(
        `Failed to format date: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
  formatDateTime: (isoString: string, timeZone = 'Asia/Dhaka'): string => {
    return dayjs(isoString)
      .tz(timeZone)
      .format('MMMM D, YYYY [at] hh:mm A (z)');
  },
  calculateFutureDate: (value: string): string => {
    const regex = /^(\d+)(ms|s|m|h|d)$/;
    const match = value.match(regex);
    if (!match) throw new Error('Invalid expiresIn format');
    const number = Number(match[1]);
    const unit = match[2];
    let now = Date.now();
    switch (unit) {
      case 'ms':
        now += number;
        break;
      case 's':
        now += number * 1000;
        break;
      case 'm':
        now += number * 60 * 1000;
        break;
      case 'h':
        now += number * 60 * 60 * 1000;
        break;
      case 'd':
        now += number * 24 * 60 * 60 * 1000;
        break;
      default:
        throw new Error('Unsupported time unit');
    }
    return new Date(now).toISOString();
  },
};

export default DateUtils;
