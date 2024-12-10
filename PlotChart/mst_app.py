import pandas as pd
import time
import random
import os
import plotly.express as px
import streamlit as st

# Simulate temperature data for 4 sensors
def get_real_time_data():
    """
    Simulate real-time temperature data from multiple sensors.
    """
    current_time = time.strftime("%H:%M:%S")
    return {
        "time": current_time,
        "sensor 1": random.uniform(35.0, 77.5),
        "sensor 2": random.uniform(36.0, 66.0),
        "sensor 3": random.uniform(37.0, 65.8),
        "sensor 4": random.uniform(38.0, 55.6),
    }

# Save the data to a CSV file
def save_data_to_file(temp_data, file_path):
    """
    Append new data to the CSV file. If the file does not exist, create it.
    """
    # Check if the file already exists
    if not os.path.exists(file_path):
        # Create the file with headers
        df = pd.DataFrame([temp_data])
        df.to_csv(file_path, index=False)
    else:
        # Append the data to the existing file
        df = pd.DataFrame([temp_data])
        df.to_csv(file_path, mode='a', header=False, index=False)

# Collect and save data to a CSV file
def collect_data(file_path, duration):
    """
    Collect data for the given duration (in seconds) and save it to a CSV file.
    """
    st.info(f"Collecting data for {duration} seconds...")
    start_time = time.time()
    while time.time() - start_time < duration:
        temp_data = get_real_time_data()
        save_data_to_file(temp_data, file_path)
        st.write(f"Data saved: {temp_data}")
        time.sleep(2)  # Collect data every 5 seconds
    st.success("Data collection complete!")

# Display the temperature data as a line chart using Streamlit
def display_line_chart(file_path):
    """
    Read data from the CSV file and display it as a line chart.
    """
    try:
        # Read the CSV file
        data_df = pd.read_csv(file_path)

        # Display the line chart
        st.subheader("Temperature Sensor Readings")
        fig = px.line(
            data_df,
            x="time",
            y=["sensor 1", "sensor 2", "sensor 3", "sensor 4"],
            labels={"time": "Time", "value": "Temperature (°C)"},
            title="Temperature Sensor Data",
        )
        fig.update_yaxes(range=[35, 100])  # Set Y-axis range to 35°C to 100°C
        st.plotly_chart(fig)

        # Show the data table
        st.subheader("Collected Data")
        st.dataframe(data_df)

    except FileNotFoundError:
        st.error("The data file does not exist. Please collect data first.")

# Main Function
def main():
    # Streamlit Page Configuration
    st.set_page_config(page_title="Temperature Data Logger", layout="wide")

    # File path for the CSV file
    file_path = "data/cpu_temperature_data.csv"

    # Streamlit App UI
    st.title("🌡️ Temperature Data Logger and Visualization")

    # Sidebar Menu
    mode = st.sidebar.selectbox("Select Mode", ["Collect Data", "Display Chart"])

    if mode == "Collect Data":
        st.header("Data Collection")
        duration = st.number_input(
            "Enter data collection duration (in seconds)", min_value=10, step=10, value=60
        )
        if st.button("Start Data Collection"):
            collect_data(file_path, duration)

    elif mode == "Display Chart":
        st.header("Line Chart Visualization")
        if os.path.exists(file_path):
            display_line_chart(file_path)
        else:
            st.warning("No data available. Please collect data first.")

if __name__ == "__main__":
    main()
