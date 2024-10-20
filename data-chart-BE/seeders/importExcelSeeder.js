require('dotenv').config();  
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Data = require('../src/models/Data'); 

// convert Excel serial date to JavaScript Date
const excelDateToJSDate = (serial) => {
  const utcDays = Math.floor(serial - 25569); // Excel's epoch starts from 1/1/1900
  const utcValue = utcDays * 86400; // seconds in a day
  const dateInfo = new Date(utcValue * 1000);

  // Handle the time zone offset
  const fractionalDay = serial - Math.floor(serial);
  let totalSeconds = Math.floor(86400 * fractionalDay);
  const seconds = totalSeconds % 60;
  totalSeconds -= seconds;

  const hours = Math.floor(totalSeconds / (60 * 60));
  const minutes = Math.floor(totalSeconds / 60) % 60;

  dateInfo.setUTCHours(hours, minutes, seconds);

  return dateInfo;
};

const importExcelDataToMongoDB = async (filePath) => {
  try {
    await connectDB();

    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];  
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    for (const record of jsonData) {
      let formattedDate;

      // Check if the 'Day' field is a number (Excel serial date) or a string (MM/DD/YYYY)
      if (typeof record['Day'] === 'number') {
        // Convert Excel serial date to JS date
        formattedDate = excelDateToJSDate(record['Day']);
      } else if (typeof record['Day'] === 'string') {
        const [day, month, year] = record['Day'].split('/').map(Number); //MM/DD/YY fromat string
        formattedDate = new Date(year, month - 1, day);
      }

      const newRecord = new Data({
        day: formattedDate,  
        ageRange: record['Age'],
        gender: record['Gender'],
        A: record['A'],
        B: record['B'],
        C: record['C'],
        D: record['D'],
      });

      await newRecord.save();
    }

    console.log('Data successfully saved to MongoDB');
    process.exit(0);  

  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);  
  }
};

importExcelDataToMongoDB(process.env.FILE_PATH);
