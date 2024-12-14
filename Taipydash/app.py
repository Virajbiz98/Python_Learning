
from taipy.gui import Gui
import pandas as pd 

# load data 
df = pd.read_csv('cpu_temperature_data.csv')
df['time'] = pd.to_datetime(df['time'])

# Taipy GUI setup 
page = """
# Line Chart with taipy

<|{chart}|chart|type=line|x=time|y=temperature|>
"""
# Bind data to the GUI 
chart  = {
    'time':df['time'].dt.strftime("%Y-%m-%d %H:%M").tolist()
}
# start the app
Gui(page).run()
# --------
# Import libraries
import pandas as pd
from taipy.gui import Gui

# Load the CSV file
df = pd.read_csv("data.csv")

# Convert the 'time' column to datetime
df["time"] = pd.to_datetime(df["time"])

# Prepare the chart data
chart_data = {
    "labels": df["time"].dt.strftime("%H:%M"),
    "datasets": [
        {
            "label": "Temperature (°C)",
            "data": df["temperature"].tolist(),
            "borderColor": "blue",
            "fill": False,
        }
    ],
}

# Define Taipy GUI layout
layout = """
# Temperature Monitoring

<|{chart_data}|chart|type=line|width=100%|height=400px|>
"""

# Launch Taipy GUI
Gui(page=layout).run()
# ---------
from taipy.gui import Gui
import pandas as pd 

# df = pd.read_csv("data.csv")
# df["time"] = pd.to_datetime(df["time"])

min_length = min(len(df["time"]), len(df["temperature"]))
df = df.iloc[:min_length]

page = """
# line chart with taipy

<|{chart}|chart|type=line|x=time|y=temperature|>
"""
chart = {
    "time":df["time"].dt.strftime("%Y-%m-%d %H:%M").tolist(),
}

Gui(page).run()



