#!/usr/bin/env node

/**
 * Script to automatically update the timestamp in Lite app.html
 * Run this script whenever you make code changes to update the version stamp
 * 
 * Usage: node scripts/update-timestamp.js
 */

const fs = require('fs');
const path = require('path');

// Get the current date and time in dd/mm/yyyy HH:MM:SS format
function getCurrentTimestamp() {
    const now = new Date();
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const date = `${day}/${month}/${year}`;
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;
    
    return { date, time };
}

// Update timestamp in Lite app.html
function updateTimestamp() {
    const filePath = path.join(__dirname, '..', 'Lite app.html');
    
    if (!fs.existsSync(filePath)) {
        console.error('Error: Lite app.html not found at', filePath);
        process.exit(1);
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const { date, time } = getCurrentTimestamp();
    
    // Pattern to match the static date and time variables
    const datePattern = /var staticDate = '[^']*';/;
    const timePattern = /var staticTime = '[^']*';/;
    
    const newDateLine = `var staticDate = '${date}';`;
    const newTimeLine = `var staticTime = '${time}';`;
    
    if (datePattern.test(content) && timePattern.test(content)) {
        content = content.replace(datePattern, newDateLine);
        content = content.replace(timePattern, newTimeLine);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Timestamp updated to: ${date} ${time}`);
    } else {
        console.error('Error: Could not find timestamp variables in the file');
        process.exit(1);
    }
}

// Run the update
updateTimestamp();
