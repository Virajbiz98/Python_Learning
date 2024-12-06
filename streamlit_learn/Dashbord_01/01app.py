import streamlit as st 
import pandas as pd 
import numpy as np 
import plotly.express as px 

# import dataset
@st.cache_data
def get_data():
    df = pd.read_csv('./data/cars.csv',index_col=0 )
    return df 

df = get_data()










