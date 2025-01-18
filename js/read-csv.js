function fetchCSV(filePath, callback) {
  fetch(filePath)
    .then(response => {
      if (!response.ok) throw new Error('Cannot read CSV file.');
      return response.text();
    })
    .then(data => {
      const articles = parseCSV(data);
      articles.reverse();
      callback(articles);
    })
    .catch(error => console.error('Error:', error));
}

function parseCSV(data) {
  const rows = data.trim().split('\n');
  const headers = rows[0].split(',');

  const articles = rows.slice(1).map(row => {
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

  return articles;
}
