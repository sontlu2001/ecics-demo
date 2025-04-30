import dayjs from 'dayjs';

export const getAgeFromDOB = (dob: string) => {
  const today = new Date();
  const birthDate = new Date(dob); // Convert the DOB string to a Date object
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if the current date is before the birthday this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// yyyy-mm-dd
export const getTodayYYYYMMDD = () => {
  return new Date().toISOString().substring(0, 10);
};

// yyyy-mm-dd
export const getOneYearLater = (date: Date) => {
  date.setFullYear(date.getFullYear() + 1);
  date.setDate(date.getDate() - 1);

  return date.toISOString().substring(0, 10);
};

// take dayjs or YYYY-MM-DD as input
// chg format to specified
export const convertDateFormat = (
  dateString: string,
  toFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY',
) => {
  const dateObj = new Date(dateString);
  let formattedDate = null;

  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date format');
  }

  switch (toFormat) {
    case 'YYYY-MM-DD':
      formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
      break;
    case 'DD/MM/YYYY':
      formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(
        dateObj.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${dateObj.getFullYear()}`;
      break;
    default:
      alert('unhandled date format');
      break;
  }

  return formattedDate;
};

/**
 * @param startDate instance of dayjs
 * @param years +ve to add ; -ve to minus
 * @param months +ve to add ; -ve to minus
 * @param days +ve to add ; -ve to minus
 * @returns duration from startDate in dayJS
 * @description example :
 * adjustDateInDayjs(dayjs("2025-01-15"), 0, -2, 0)
 * Output: "2024-11-15"
 * @
 */
export const adjustDateInDayjs = (
  startDate: dayjs.Dayjs | undefined,
  years?: number,
  months?: number,
  days?: number,
): dayjs.Dayjs | undefined => {
  if (startDate instanceof dayjs) {
    let adjustedDate = startDate;

    // Add or subtract years
    if (years) {
      if (years > 0) {
        adjustedDate = adjustedDate.add(years, 'year');
      } else {
        adjustedDate = adjustedDate.subtract(-years, 'year');
      }
    }

    // Add or subtract months
    if (months) {
      if (months > 0) {
        adjustedDate = adjustedDate.add(months, 'month');
      } else {
        adjustedDate = adjustedDate.subtract(-months, 'month');
      }
    }

    // Add or subtract days
    if (days) {
      if (days > 0) {
        adjustedDate = adjustedDate.add(days, 'day');
      } else {
        adjustedDate = adjustedDate.subtract(-days, 'day');
      }
    }

    return adjustedDate;
  }

  return startDate;
};

export const adjustDateInDate = (
  startDate: Date | undefined,
  years?: number,
  months?: number,
  days?: number,
): Date | undefined => {
  if (startDate instanceof Date) {
    const adjustedDate = new Date(startDate);

    // Add or subtract years
    if (years) {
      adjustedDate.setFullYear(adjustedDate.getFullYear() + years);
    }

    // Add or subtract months
    if (months) {
      adjustedDate.setMonth(adjustedDate.getMonth() + months);
    }

    // Add or subtract days
    if (days) {
      adjustedDate.setDate(adjustedDate.getDate() + days);
    }

    return adjustedDate;
  }

  return startDate;
};

// Date -> DayJS
export const dateToDayjs = (date: string | Date | undefined) =>
  date ? dayjs(date) : undefined;

// DayJS -> Date
export const dayjsToDate = (dayjsObj: dayjs.Dayjs | null | undefined) =>
  dayjsObj?.toDate() || undefined;

export const convertDateToDDMMYYYY = (date: string) => {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};
