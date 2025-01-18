async function fetchCSV(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Cannot read CSV file: ${filePath}`);
    const data = await response.text();
    return parseCSV(data);
  } catch (error) {
    return console.error('Error:', error);
  }
}

function parseCSV(data) {
  const rows = data.trim().split('\n');
  const headers = rows[0].split(',');

  const items = rows.slice(1).map(row => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];

      if (char === '"' && row[i + 1] === '"') {
        current += '"';  // Convert two quotes("") to one quote(")
        i++;             // Skip the next quote
      } else if (char === '"') {
        inQuotes = !inQuotes;  // Convert the flag
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());  // Add the last value

    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index] || '';
      return obj;
    }, {});
  });

  return items;
}
