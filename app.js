const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// TLE data
const tleData = {
    landsat7: `1 25682U 99020A   24277.23908774  .00002599  00000+0  53885-3 0  9991\n2 25682  97.8820 298.9174 0001602  80.8198 346.2761 14.60989188354973`,
    landsat8: `1 39084U 13008A   24277.15394673  .00002416  00000+0  54632-3 0  9991\n2 39084  98.2190 345.4070 0001297  94.2279 265.9068 14.57103192619139`,
    landsat9: `1 49260U 21088A   24277.18833824  .00002497  00000+0  56417-3 0  9996\n2 49260  98.2218 345.4377 0001367  90.8119 269.3236 14.57112007160412`
};

// Download TLE data
app.get('/download-tle', (req, res) => {
    const tleString = Object.entries(tleData).map(([key, value]) => `${key.toUpperCase()}:\n${value}`).join('\n\n');
    const filePath = path.join(__dirname, 'public', 'TLE_Data.txt');
    fs.writeFileSync(filePath, tleString);
    res.download(filePath, 'TLE_Data.txt', (err) => {
        if (err) {
            console.error(err);
        }
        fs.unlinkSync(filePath);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
