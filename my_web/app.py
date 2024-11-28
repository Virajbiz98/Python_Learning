import streamlit as st
# import sreamlit_lottie 
from streamlit_lottie import st_lottie 
import requests 
from PIL import Image 
# st.set_page_config(page_title="My Web",  page_icon=":desktop_computer:",layout="wide")

st.set_page_config(page_title="MY_WEB",page_icon="🤑",layout="wide")

# loading lottie file function 
# def loadLottie(url):
#     r = requests.get(url)
#     if r.status_code != 200:
#       return None
#     return r.json()

# lottie_file1 = loadLottie("https://lottie.host/110dabcd-c114-47bd-a62a-9637e7f2979d/2cPLo06TRD.lottie")
image_01 = Image.open("assets/LOGO.png") # image path here 
# --- header section ---
with st.container():
    st.subheader("Hi a'm john")
    st.title("Python web devoloper")
    st.write("python is my life")
    st.write("[Learn More >](http://python.org)")

# What I do...
with st.container():
    st.write("---") # divider 
    left_column , right_column = st.columns(2)
    with left_column:
      st.header("What I Do")
      st.write("##")
      st.write(
        """
              my passion for programming runs deap:
        - my career but also my outlook on life. Each line of code 
        - I write is a canvas for my creativity, a puzzle waiting to be solved,
        - And a geteway to innovation. Beyond the boundaries of work,
        - I finde myslef engrossed in the world of programming, constantly.

        exploring new languages, frameworks, and technologies. wether it's a humble script or a cc
        
        """
      )
      st.write("[facbook] (https://faceboock.)")
    
    # with right_column:
    #   st_lottie(lottie_file1, height= 300,key="cording")

# ------- project section ----------
with st.container():
   st.write("---")
   st.header("My Project...")
   st.write("##")
   img_col , text_col = st.columns((1,2))
   with img_col:
      st.image(image_01)
   with text_col:
      st.subheader("ecommerce website")
      st.write(
         """
         	Lorem Ipsum is simply dummy text of the printing and typesettng 
        industry. Lorem has been the printer took a galley of type 
        and scambled it to make a type specimen book. It has survived not
        only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged. It was poularised in the 1960s 
         """)
      st.markdown("http://youtube.com")

with st.container():
  #  st.header("My Project 02...")
   st.write("##")
   img_col , text_col = st.columns((1,2))
   with img_col:
      st.image(image_01)

with text_col:
      st.subheader("ecommerce website")
      st.write(
         """
         	Lorem Ipsum is simply dummy text of the printing and typesettng 
        industry. Lorem has been the printer took a galley of type 
        and scambled it to make a type specimen book. It has survived not
        only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged. It was poularised in the 1960s 
         """)
      st.markdown("http://youtube.com")
      
# --- form section --------
with st.container():
   st.header("Contact me")
   st.write("##")
   contact_form = """
   <form action="https://formsubmit.co/virajbiz98@email.com" method="POST">
     <input type="text" name="name" placeholder="Your name" required>
     <input type="email" name="email" placeholder="Your email" required>
     <button type="submit">Send</button>
   </form>
   """
   left_column, right_column = st.columns(2)  # Specify two columns
   with left_column:
      st.markdown(contact_form, unsafe_allow_html=True)
   with right_column:
      pass


