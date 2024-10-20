require('dotenv').config();  // To load environment variables from .env
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Data = require('../src/models/Data');  // Import your model

// Function to convert Excel serial date to JavaScript Date
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

// Function to parse Excel and save to MongoDB
const importExcelDataToMongoDB = async (filePath) => {
  try {
    // Connect to the database
    await connectDB();

    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];  // Assuming the first sheet
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Loop through and save each record
    for (const record of jsonData) {
      let formattedDate;

      // Check if the 'Day' field is a number (Excel serial date) or a string (MM/DD/YYYY)
      if (typeof record['Day'] === 'number') {
        // Convert Excel serial date to JS date
        formattedDate = excelDateToJSDate(record['Day']);
      } else if (typeof record['Day'] === 'string') {
        // If it's a string, assume it's in MM/DD/YYYY format
        const [day, month, year] = record['Day'].split('/').map(Number);
        formattedDate = new Date(year, month - 1, day);
      }

      const newRecord = new Data({
        day: formattedDate,  // Store the properly formatted Date
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

// Run the seeder with the path to your Excel file
importExcelDataToMongoDB('/Users/abhinavkhanna/Downloads/Frontend Developer Assignment Data.xlsx');
