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

function createCategoryMap(categories) {
  const map = {};
  categories.forEach(category => {
    map[category.id] = {
      name: category.name,
      folder: category.folder
    };
  });
  return map;
}

function getCategoryId(categoryName, categoryMap) {
  for (const [id, info] of Object.entries(categoryMap)) {
    if (info.name === categoryName) {
      return id;
    }
  }
  return null;
}

export function loadCSV(filterCategory, callback) {
  const articlesPath = '/database/articles.csv';
  const categoriesPath = '/database/categories.csv';

  Promise.all([
    fetchCSV(articlesPath),
    fetchCSV(categoriesPath)
  ])
  .then(([articles, categories]) => {
    const categoryMap = createCategoryMap(categories);
    
    if (filterCategory) {
      const categoryId = getCategoryId(filterCategory, categoryMap);
      if (categoryId) {
        const filteredArticles = articles.filter(article => article.category_id === categoryId);
        callback(filteredArticles, categoryMap);
      } else {
        console.error(`Category "${filterCategory}" not found.`);
      }
    } else {
      callback(articles, categoryMap);
    }
  })
  .catch(error => console.error('Error loading CSV files:', error));
}