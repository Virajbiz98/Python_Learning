# Google SEO Data Analysis Tool

This is a Streamlit application designed to help you analyze your Google Search Console data and identify key SEO opportunities.

## Features

*   Analyze Top Performing Queries
*   Identify Keyword Opportunities (queries ranking beyond a certain position with significant impressions)
*   Find Quick Wins (queries ranking just outside the top positions with significant impressions)
*   Generate a Keyword Word Cloud
*   Estimate Traffic Potential based on current performance
*   Analyze Country Performance with interactive maps
*   Analyze Top Pages and Pages Needing Optimization
*   Optionally include additional keyword metrics using an external API (requires API Key and User ID)

## Requirements

*   Python 3.x
*   Libraries listed in `requirements.txt`

## Installation

1.  Clone or download this repository.
2.  Navigate to the project directory in your terminal.
3.  Install the required libraries using pip:

    ```bash
    pip install -r requirements.txt
    ```

## Usage

1.  Make sure you have your Google Search Console data exported as CSV files for Queries, Countries, and Pages. These files should be compressed into a single zip file. The application expects filenames starting with 'Quer', 'Countr', and 'Page' respectively within the zip file.
2.  Run the Streamlit application from your terminal:

    ```bash
    streamlit run app.py
    ```
3.  The application will open in your web browser (usually at `http://localhost:8501`).
4.  Upload your zip file containing the GSC data.
5.  Adjust the analysis parameters in the sidebar as needed.
6.  Click "Start Analysis".

## Data Format

The application expects CSV files with specific columns. Ensure your exported GSC data includes at least the following columns:

*   **Queries Data:** `Top queries`, `Impressions`, `Clicks`, `Position`, `CTR`
*   **Country Data:** `Country`, `Impressions`, `Clicks`, `Position`, `CTR`
*   **Page Data:** `Page`, `Impressions`, `Clicks`, `Position`, `CTR`

## API Key (Optional)

If you want to include additional keyword metrics, check the "Include additional keyword metrics" box in the sidebar and enter your API Key and User ID.
