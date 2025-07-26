# Simple  Scraper using Scrapy 

This project provides a **basic, commented Scrapy spider** designed to help you understand the fundamentals of web scraping: how to extract product names, prices, and descriptions from a given website. It's an excellent starting point for anyone new to Scrapy and web scraping in Python

## How to Use

By exploring and running this project, you will gain an understanding of:

* **Scrapy Project Structure**: How a basic Scrapy project is organized.
* **Spider Definition**: The core components of a Scrapy Spider (`name`, `start_urls`, `parse` method).
* **CSS Selectors**: How to use CSS selectors to pinpoint and extract specific data from HTML.
* **Data Extraction**: Using `.get()` and `.getall()` for data retrieval.
* **Pagination**: How to navigate automatically to subsequent pages of a website.
* **Data Output**: Saving scraped data into common formats like JSON or CSV.
* **Ethical Considerations**: Basic awareness of `robots.txt` and responsible scraping.

## Features

* Extracts product names.
* Extracts product prices.
* Extracts product descriptions (optional).
* Handles pagination (navigating to the next page of listings).
* Outputs data in JSON or CSV format.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Python 3.x**: Download from [python.org](https://www.python.org/downloads/).
* **pip**: Python's package installer (usually comes with Python).
* **Scrapy**: The web crawling framework for Python.

### Installation

If you don't have Scrapy installed, open your terminal or command prompt and run:

```bash
pip install scrapy