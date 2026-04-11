#!/usr/bin/env python3
"""
Generates sitemap.xml from database/articles.csv and database/categories.csv.
Run this script whenever you add a new post:
  python generate_sitemap.py
"""

import csv
from datetime import date

BASE_URL = "https://seongminjung.github.io"

# Static pages: (path, priority)
STATIC_PAGES = [
    ("index.html", "1.0"),
    ("publications.html", "0.8"),
    ("projects.html", "0.8"),
    ("study.html", "0.8"),
]


def load_categories(path="database/categories.csv"):
    categories = {}
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            categories[row["id"]] = row
    return categories


def load_articles(path="database/articles.csv"):
    articles = []
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            articles.append(row)
    return articles


def build_urls(articles, categories):
    urls = []

    # Static top-level pages
    today = date.today().isoformat()
    for path, priority in STATIC_PAGES:
        urls.append({"loc": f"{BASE_URL}/{path}", "lastmod": today, "priority": priority})

    # Category index pages (study/paper_summaries.html, etc.)
    seen_categories = set()
    for article in articles:
        cat = categories.get(article["category_id"])
        if not cat or cat["id"] in seen_categories:
            continue
        seen_categories.add(cat["id"])
        urls.append({
            "loc": f"{BASE_URL}/study/{cat['folder']}.html",
            "lastmod": today,
            "priority": "0.7",
        })

    # Individual article pages
    for article in articles:
        cat = categories.get(article["category_id"])
        if not cat:
            continue
        urls.append({
            "loc": f"{BASE_URL}/study/{cat['folder']}/{article['filename']}.html",
            "lastmod": article["date"],
            "priority": "0.6",
        })

    return urls


def render_sitemap(urls):
    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for url in urls:
        lines.append("  <url>")
        lines.append(f"    <loc>{url['loc']}</loc>")
        lines.append(f"    <lastmod>{url['lastmod']}</lastmod>")
        lines.append(f"    <priority>{url['priority']}</priority>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def main():
    categories = load_categories()
    articles = load_articles()
    urls = build_urls(articles, categories)
    sitemap = render_sitemap(urls)

    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap)

    print(f"sitemap.xml generated with {len(urls)} URLs.")


if __name__ == "__main__":
    main()
