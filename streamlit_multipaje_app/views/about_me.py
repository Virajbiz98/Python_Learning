import streamlit as st 
from forms.contact import contact_form

@st.experimental_dialog("Contact Me")
def show_contact_form():
  contact_form()


# --- ABOUT SECTION --- 
col1,col2 = st.columns(2, gap="small",vertical_alignment="center")
with col1:
  st.image("assets/profile_image.png",width = 230)
with col2:
  st.title("~DEW~",anchor=False)
  st.write(
    "Seniior data Analyst, assisting enterprises by suporting data-driven decision-making." 
  )
  if st.button("✉ Contact Me"):
    show_contact_form()

# --- EXPEARIENCE AN QUALIFICATIONS ---
st.write("\n")
st.subheader("Expearence & Qualifications", anchor=False)
st.write(
  """
  - 7 years expearience in python 
  - Good understaning of statistical principles
  - exelent team work
  """
)
# --- SKILS ---
st.write("\n")
st.subheader("Hard skils", anchor=False)
st.write(
  """
  -progamming python 
  - data base : Mongodb
  - content creating  
  - data Visualization 
  """
)

