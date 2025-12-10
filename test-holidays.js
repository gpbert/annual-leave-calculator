import Holidays from 'date-holidays';

const hd = new Holidays('IT');
const year = 2025;

// Test dates for December 2025
// Immacolata is Dec 8.
// User sees it on Dec 9.

// Create a date that simulates the calendar loop's "Dec 9th".
// Usually new Date(2025, 11, 9) -> Dec 9 00:00:00 Local.
// If run in a timezone like UTC+1 (CET), this is Dec 8 23:00 UTC.

// Let's test what hd.isHoliday returns for Dec 9th local time.
const checkDate = new Date(2025, 11, 9); // Dec 9
console.log(`Checking Date: ${checkDate.toString()}`);
console.log(`Checking Date (ISO): ${checkDate.toISOString()}`);

const result = hd.isHoliday(checkDate);
console.log(`Is Dec 9 a holiday?`, result ? result[0].name : 'No');

// Check Dec 8
const checkDate8 = new Date(2025, 11, 8); // Dec 8
console.log(`Checking Date 8: ${checkDate8.toString()}`);
console.log(`Result 8:`, hd.isHoliday(checkDate8) ? hd.isHoliday(checkDate8)[0].name : 'No');

// Check string passing
console.log(`Checking string '2025-12-09':`, hd.isHoliday('2025-12-09'));
console.log(`Checking string '2025-12-08':`, hd.isHoliday('2025-12-08'));
