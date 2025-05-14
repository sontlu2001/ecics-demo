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

//get only year
export const extractYear = (dateString?: string): string | null => {
  if (!dateString) return null;

  let date: Date;

  // Check format DD/MM/YYYY or DD/MM/YY
  const ddMmYyyyRegex = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
  if (ddMmYyyyRegex.test(dateString)) {
    const [dayStr, monthStr, yearStr] = dateString.split('/');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    let year = parseInt(yearStr, 10);

    if (yearStr.length === 2) {
      year += 2000;
    }

    date = new Date(year, month, day);
  } else {
    date = new Date(dateString);
  }
  return isNaN(date.getTime()) ? null : date.getFullYear().toString();
};

export const parseCustomDate = (dateStr: string): Date | null => {
  const ddMmYyyyRegex = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
  if (ddMmYyyyRegex.test(dateStr)) {
    const [dayStr, monthStr, yearStr] = dateStr.split('/');
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    let year = parseInt(yearStr, 10);

    // Year digit 2: is defined as 19xx or 20xx
    if (yearStr.length === 2) {
      year += year < 50 ? 2000 : 1900;
    }

    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  const isoDate = new Date(dateStr);
  return isNaN(isoDate.getTime()) ? null : isoDate;
};

export const formatDateToEnGb = (dateStr: string): string => {
  const date = parseCustomDate(dateStr);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const calculateDrivingExperienceFromLicences = (
  classes: Array<{
    class?: { value?: string };
    issuedate?: { value?: string };
  }>,
): number => {
  if (!classes || classes.length === 0) return 1;
  const targetClasses = ['3', '3A'];

  const qdlDates: Date[] = [];

  // Iterate over the classes to filter those with class '3' or '3A' and valid issue dates
  for (const c of classes) {
    const classValue = c.class?.value;
    const issuedateStr = c.issuedate?.value;

    if (classValue && targetClasses.includes(classValue) && issuedateStr) {
      const parsedDate = parseCustomDate(issuedateStr);
      if (parsedDate) {
        qdlDates.push(parsedDate);
      }
    }
  }

  if (qdlDates.length === 0) return 1;

  // Find the earliest date from the filtered list of valid classes
  const earliestQdl = new Date(Math.min(...qdlDates.map((d) => d.getTime())));
  const today = new Date();

  // Calculate the difference in milliseconds between today and the earliest issue date
  const diffInMs = today.getTime() - earliestQdl.getTime();

  // Convert milliseconds to years (exact years, not rounded down)
  const years = diffInMs / (1000 * 60 * 60 * 24 * 365);

  // Round down to the nearest whole year
  const roundedYears = Math.floor(years);

  return roundedYears > 0 ? roundedYears : 1; // Ensure at least 1 year is returned
};
