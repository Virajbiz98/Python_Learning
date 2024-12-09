import streamlit as st 
import os 
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt 


# st.write({"key":"value"})
# 3 + 4 

# "Hello world" if False else "bye"

# pressed = st.button("press me")
# print("First",pressed)

# pressed2 = st.button("Scond button")
# print("second",pressed2)

# st.title("Super simple title")
# st.header("this is a header")
# st.subheader("subheader")
# st.markdown("this is __Markdown__")
# st.caption("Small text")
# code_example = """
# def greet(name):
#     print('hello', name)
# """

# st.code(code_example, language= "python")

# st.divider()

# st.image(os.path.join(os.getcwd(), "static","BG.jpg"), width = 500) # render image

# ---------

# TITLE

# st.title("Streamlit Elements Demo")

# # Dataframe section 
# st.subheader("Dataframe")
# df = pd.DataFrame({
#     'name':['Alice','Bob','Charly','David'],
#     'Age': ['32','28','37','19'],
#     'Occupation' : ['Engineer','Doctor','Artist','Chef']
# })

# st.dataframe(df)

# # Data Editor Section (Editable dataframe)
# st.subheader("Data Editor")
# editable_df = st.data_editor(df)
# print(editable_df)

# # Static Table Section 
# st.subheader('Static Table')
# st.table(df)

# # Metrics Section 
# st.subheader("Metrics")
# st.metric(label="Total Rows", value=len(df))
# # st.metric(label="Average Age", value=round(df["Age"].mean(), 1))

# # jSON and Dict Section 
# st.subheader("JSON and Dictionary")
# sample_dict = {
#     "name" : "Alice",
#     "Age"  : 25,
#     "skils": ["Python", "Data Science", "Machine Learning"]
# }
# st.json(sample_dict)

# # Alsp show it as dictionary
# st.write("Dictionary view", sample_dict)

# import numpy as np
# import matplotlib.pyplot as plt 

# Title 
st.title("Streamlit Charts Demo")
# Generate Sample data 
chart_data = pd.DataFrame(
    np.random.randn(20,3),
    columns=['A','B','C']
)

# Area Chart Section 
st.subheader("Area Chart Section")
st.area_chart(chart_data) 

# Bar Chart section 
st.subheader("Bar Chart Section")
st.bar_chart(chart_data)

# Line Chart Section 
st.subheader("Line Chart Section")
st.line_chart(chart_data)

# Scatter Chart Section 
st.subheader("Scatter Chart")
scatter_data = pd.DataFrame({
    'x': np.random.randn(100),
    'y': np.random.randn(100)

})
st.scatter_chart(scatter_data)

# Map Section (Displaying random points on a map)

st.subheader("Map")
map_data = pd.DataFrame(
    np.random.randn(100, 2) / [50, 50] + [37.76, -122.4], # Coordinates around SF 
    columns=['lat', 'lon']
)
st.map(map_data)
# ------------------

# Pyplot Section 
st.subheader("Pyplot Chart")
fig, ax =plt.subplots()
ax.plot(chart_data['A'], label='A')
ax.plot(chart_data['B'], label='B')
ax.plot(chart_data['C'], label='C')
ax.set_title("Pyplot Line Chart")
ax.legend()
st.pyplot(fig)

# ----------
