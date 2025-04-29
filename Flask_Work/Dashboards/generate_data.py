import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_youtube_data(years=2):
    start_date = datetime(2023, 1, 1)
    end_date = start_date + timedelta(days=365*years)
    date_range = pd.date_range(start_date, end_date)
    
    base_views = np.random.randint(1000, 5000, len(date_range))
    growth = np.linspace(1, 2.5, len(date_range))
    
    data = pd.DataFrame({
        'Date': date_range,
        'Views': (base_views * growth).astype(int),
        'Likes': (base_views * growth * 0.08).astype(int),
        'Comments': (base_views * growth * 0.015).astype(int),
        'Shares': (base_views * growth * 0.005).astype(int),
        'Subscribers': np.cumsum(np.random.randint(10, 50, len(date_range))),
        'Category': np.random.choice(['Gaming', 'Tech', 'Vlog', 'Tutorial'], len(date_range))
    })
    
    # Add weekly seasonality
    data['Views'] = data['Views'] * np.where(data['Date'].dt.dayofweek.isin([5, 6]), 1.3, 1)
    
    return data

if __name__ == "__main__":
    df = generate_youtube_data()
    df.to_csv("data/youtube_data.csv", index=False)
    print("Generated dataset with", len(df), "rows")
