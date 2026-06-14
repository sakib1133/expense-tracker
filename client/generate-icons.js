import fs from 'fs';
import { createCanvas } from 'canvas';

// Generate 192x192 icon
const canvas192 = createCanvas(192, 192);
const ctx192 = canvas192.getContext('2d');

// Background
ctx192.fillStyle = '#4f46e5';
ctx192.fillRect(0, 0, 192, 192);

// Text
ctx192.fillStyle = 'white';
ctx192.font = 'bold 24px Arial';
ctx192.textAlign = 'center';
ctx192.textBaseline = 'middle';
ctx192.fillText('Expense', 96, 96);
ctx192.font = '20px Arial';
ctx192.fillText('Tracker', 96, 125);

const buffer192 = canvas192.toBuffer('image/png');
fs.writeFileSync('public/icon-192x192.png', buffer192);

// Generate 512x512 icon
const canvas512 = createCanvas(512, 512);
const ctx512 = canvas512.getContext('2d');

// Background
ctx512.fillStyle = '#4f46e5';
ctx512.fillRect(0, 0, 512, 512);

// Text
ctx512.fillStyle = 'white';
ctx512.font = 'bold 64px Arial';
ctx512.textAlign = 'center';
ctx512.textBaseline = 'middle';
ctx512.fillText('Expense', 256, 256);
ctx512.font = '52px Arial';
ctx512.fillText('Tracker', 256, 320);

const buffer512 = canvas512.toBuffer('image/png');
fs.writeFileSync('public/icon-512x512.png', buffer512);

console.log('Icons generated successfully!');
