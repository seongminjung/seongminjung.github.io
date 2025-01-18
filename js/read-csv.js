function fetchCSV(filePath, callback) {
  fetch(filePath)
    .then(response => {
      if (!response.ok) throw new Error('Cannot read CSV file.');
      return response.text();
    })
    .then(data => {
      const articles = parseCSV(data);
      callback(articles);
    })
    .catch(error => console.error('Error:', error));
}

function parseCSV(data) {
  const rows = data.trim().split('\n');
  const headers = rows[0].split(',');
  const articles = rows.slice(1).map(row => {
    const values = row.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index].trim();
      return obj;
    }, {});
  });
  return articles;
}
