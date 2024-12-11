import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import os 

# # Load data from CSV
# @st.cache_data
# def load_csv_data():
#     return pd.read_csv("./data/cpu_temperature_data.csv")  # Update with your CSV file path

# # Load the data
# df = load_csv_data()

# # Display data in Streamlit
# st.title("Real-Time Temperature Sensor Monitoring")
# st.dataframe(df)

# # Plotting
# fig, ax = plt.subplots(figsize=(48, 8))  #  chart size for better visibility

# # Plot each sensor with distinct styles
# for column in df.columns[1:]:
#     ax.plot(df["time"], df[column], label=column, linewidth=2, marker='o', markersize=5)

# # Set title and labels with improved font sizes
# ax.set_title("Temperature Sensor Readings Over Time", fontsize=18, fontweight='bold')
# ax.set_xlabel("Time", fontsize=14)
# ax.set_ylabel("Temperature (°C)", fontsize=14)

# # Customize ticks for better spacing and readability
# ax.set_xticks(df["time"][::len(df)//36])  
# ax.set_xticklabels(df["time"][::len(df)//36], rotation=45, ha="right", fontsize=12)

# # Set y-axis limits for proper scaling
# ax.set_ylim(35, 100)

# # Improve grid appearance
# ax.grid(True, which='both', linestyle='--', linewidth=0.7, alpha=0.7, color='gray')

# # Set background color and style
# fig.patch.set_facecolor('#f9f9f9')  # Set a light gray background
# ax.set_facecolor('#ffffff')  # White background for the plot area
# ax.spines['top'].set_color('gray')  # Set the top spine color
# ax.spines['right'].set_color('gray')  # Set the right spine color

# # Add legend with a cleaner layout
# ax.legend(title="Sensors", fontsize=12, loc="upper right", frameon=True, framealpha=0.9)

# # Make x-axis and y-axis ticks larger for readability
# ax.tick_params(axis='x', labelsize=12)
# ax.tick_params(axis='y', labelsize=12)

# # Display plot
# st.pyplot(fig)

# @st.cache_data
# def load_data():
#     return pd.read_csv('C:/Users/My PC/OneDrive/Documents/MaythPlotChart/data/cpu_temperature_data.csv')


# st.title("Temperature moniter")

# df = load_data()
# st.write("sensor data")
# st.dataframe(df)

# fig, ax = plt.subplots(figsize=(10,5))
# for column in df.columns[1:]:
#     ax.plot(df["time"], df[column], label=column)
#     # ax.plot(df[""], df[column],label= column)

# ax.set_title("sensor data over time", fontsize=16)
# ax.set_xlabel("time", fontsize=12)
# ax.set_ylabel("Temperature (°C)", fontsize=12)
# ax.grid(True)

# st.pyplot(fig)

# # ----------------

import matplotlib.dates as mdates

@st.cache_data
def load_data():
    return pd.read_csv ("./data/cpu_temperature_data.csv")

df = load_data()
st.dataframe(df)

# Cnvert time column to datetime format
df["time"] = pd.to_datetime(df["time"], format="%H:%M:%S")
df = df.sort_values("time") # new

# df = df.set_index("time").resample("1T").mean().reset_index() # new

df.iloc[:, 1:] = df.iloc[:, 1:].rolling(window=90, min_periods=84).mean() # new



# fig,ax = plt.subplots(figsize=(14, 7))

# # # for column in df.columns[1:]:
# # #     ax.plot(df["time"], df[column], label = column)

# for column in df.columns[1:]:
#     ax.plot(df["time"], df[column], label=column, marker="o", markersize=2, linestyle="-") # new

# ax.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M:%S"))
# ax.xaxis.set_major_locator(mdates.MinuteLocator(interval=8)) 
# # ax.set_xticks(df["time"][::len(df)//15]) 
# # ax.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M")) # new
# # ax.xaxis.set_major_locator(mdates.HourLocator(interval=1)) # new

# plt.xticks(rotation=45) # Rotate time labels for better visibility


# ax.set_title("Temperature Sensor  Monitoring",fontsize=16)
# ax.set_xlabel("Time", fontsize=12)
# ax.set_ylabel("Temperature ((°C)",fontsize=12)



# ax.grid(True, which='major', linewidth=0.6 )
# ax.grid(True, which="minor",linestyle="--",alpha=0.4)

# ax.grid(True, which="major", linestyle="--", alpha=0.3) #new
# ax.legend(loc="upper right", fontsize=10)

# # ax.set_xticklabels(df["time"][::len(df)//36], rotation=45, ha="right", fontsize=12)
# plt.tight_layout()
# # plt.show()
# st.pyplot(fig)

# -------
import numpy as np

# Function to create a wavy effect (curvy lines)
def create_wavy_line(data, amplitude=5, frequency=0.1, randomness=0.5):
    x = np.arange(len(data))
    # Generate a sine wave with some randomness added to the curve
    sine_wave = amplitude * np.sin(frequency * x + np.random.uniform(0, 2 * np.pi))
    return data + sine_wave + np.random.normal(0, randomness, size=len(data))  # Add randomness

# Create the plot
fig, ax = plt.subplots(figsize=(16, 6))

# Loop through the sensor data and apply the wavy effect
for column in df.columns[1:]:
    wavy_data = create_wavy_line(df[column], amplitude=5, frequency=0.05, randomness=1.5)
    ax.plot(df["time"], wavy_data, label=column)

# Set the x-axis to display every 8 minutes
ax.xaxis.set_major_locator(plt.matplotlib.dates.MinuteLocator(interval=8))
ax.xaxis.set_major_formatter(plt.matplotlib.dates.DateFormatter("%H:%M:%S"))

# Rotate the x-axis labels for better visibility
plt.xticks(rotation=45)

# Set title, labels, and grid
ax.set_title("Sensor Data Monitoring (Wavy Lines)", fontsize=16)
ax.set_xlabel("Time", fontsize=12)
ax.set_ylabel("Temperature (°C)", fontsize=12)

# Show grid and legend
ax.grid(True, which='major', linewidth=0.5)
ax.legend()

# Adjust layout
plt.tight_layout()

# Display the chart in Streamlit
st.pyplot(fig)
