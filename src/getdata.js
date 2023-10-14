
import * as XLSX from 'xlsx';

/**
 * @param {RequestInfo | URL} url
 */
export async function fetchXLSXdata(url) {
    try {
        console.log(url);
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        
        // Parse the XLSX file
        const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });

        // Loop through each sheet in the workbook
        const sheetNames = workbook.SheetNames;
        const sheetsData = sheetNames.map(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            // Convert the sheet to JSON
            const data = XLSX.utils.sheet_to_json(sheet);
            return {
                sheetName,
                data,
            };
        });

        return sheetsData;
    } catch (error) {
        console.error('Error fetching and parsing XLSX:', error);
        return [];
    }
}

   