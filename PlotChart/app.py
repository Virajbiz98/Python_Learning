import matplotlib.pyplot as plt 
import streamlit as st 
import pandas as pd 

st.title(' Sensor Data in Line Chart')

def load_data():
    file = pd.read_csv("cpu_temperature_data.csv")
    return file 

data = load_data()
st.write("Loaded Data", data)

if "time" in data.columns:
    selected_sensors = st.multiselect("Select sensors to plot", options=data.columns[1:], default=data.columns[1:])
    max_ticks = st.slider("Max X-axis ticks", 5, 50, 10)
    show_grid = st.checkbox("Show grid", value=True)

    time = data["time"]

    fig, ax = plt.subplots(figsize=(10, 6))
    for column in selected_sensors:
        ax.plot(time, data[column], label=column)

    ax.set_xlabel("Time")
    ax.set_ylabel("Sensor Values")
    plt.xticks(rotation=45)
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, 1.15),ncol=4)

    ax.set_xticks(time[::max(1, len(time) // max_ticks)])

    if show_grid:
        ax.grid(True, linestyle="--",alpha=0.7)

    st.pyplot(fig)
else:
    st.error("The file must have a 'time' column for the X-axis.")