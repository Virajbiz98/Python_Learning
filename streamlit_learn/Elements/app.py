import streamlit as st 
import time

if "photo" not in st.session_state:
    st.session_state["photo"]="not done"


col1,col2,col3 = st.columns([1,2,1])
col1.markdown("# Welcome to my app ")
col1.markdown(" her is some info on the app")
# col1.markdown("##")
# col1.markdown("# Hello from markdown")

def Change_photo_state():
    st.session_state["photo"]="done"

Uploaded_photo = col2.file_uploader("Upload a photo", on_change=Change_photo_state)
camera_photo = col2.camera_input("Take a photo", on_change=Change_photo_state)


if st.session_state["photo"] == "done":
    progress_bar = col2.progress(0)

for perc_completed in range(100):
    time.sleep(0.05)
    progress_bar.progress(perc_completed + 1)
col2.success("Photo uploaded succesfully")
col3.metric(label="Temperature",value="60 °C", delta= "3 °C")

with st.expander("Click to read more"):
    st.write("Hello here are more details on this topic that were interested in.")
    if Uploaded_photo is None:
        st.image(camera_photo)
    else:
        st.image(Uploaded_photo)

