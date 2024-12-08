import streamlit as st 
import os 
import pandas as pd


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

st.title("Streamlit Elements Demo")

# Dataframe section 
st.subheader("Dataframe")
df = pd.DataFrame({
    'name':['Alice','Bob','Charly','David'],
    'Age': ['32','28','37','19'],
    'Occupation' : ['Engineer','Doctor','Artist','Chef']
})

st.dataframe(df)

# Data Editor Section (Editable dataframe)
st.subheader("Data Editor")
editable_df = st.data_editor(df)
print(editable_df)

# Static Table Section 
st.subheader('Static Table')
st.table(df)

# Metrics Section 
st.subheader("Metrics")
st.metric(label="Total Rows", value=len(df))
# st.metric(label="Average Age", value=round(df["Age"].mean(), 1))

# jSON and Dict Section 
st.subheader("JSON and Dictionary")
sample_dict = {
    "name" : "Alice",
    "Age"  : 25,
    "skils": ["Python", "Data Science", "Machine Learning"]
}
st.json(sample_dict)

# Alsp show it as dictionary
st.write("Dictionary view", sample_dict)

