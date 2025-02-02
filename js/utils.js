export function parseURL() {
  try {
    const pathParts = window.location.pathname.split("/").filter((part) => part);
    const pagename = pathParts[0].replace(".html", "");
    const category = pathParts.length > 1 ? pathParts[1].replace(".html", "") : null;
    const filename = pathParts.length > 2 ? pathParts[2].replace(".html", "") : null;

    return { pagename, category, filename };
  } catch (error) {
    console.error("Error parsing blog URL:", error);
    return { pagename: null, category: null, filename: null };
  }
}

export function formatDate(date) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
