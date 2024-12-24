import pandas as pd
import plotly.express as px
import streamlit as st

import pickle 
from pathlib import Path
import streamlit_authenticator as stauth 



st.set_page_config(page_title="Sales Dashboard",
                   page_icon="📊",
                   layout="wide")

# ___ USER AUTHENTICATOR ----
names = ["Peter Paker","Rebecca Miller"]
usernames = ["pparker", "rmiller"]

# Load hashed passwords 
file_path = Path(__file__).parent / "hashed_pw.pkl"
with file_path.open("rb") as file:
    hashed_passwords = pickle.load(file)

print(hashed_passwords)  # Add this line after loading the file


# Create credentials dictionary
credentials = {
    "usernames": {
        usernames[i]: {"name": names[i], "password": hashed_passwords[i]}
        for i in range(len(usernames))
    }
}

authenticator = stauth.Authenticate(
    names=names,
    usernames=usernames,
    passwords=hashed_passwords,
    cookie_name="sales_dashboard",  # Explicit argument name
    key="abcdef",                   # Explicit argument name
    cookie_expiry_days=30            # Explicit argument name
)



name, authentication_status, usernames = authenticator.login("Login", "main")

if authentication_status == False:
    st.error("Username/password is incorrect")

if authentication_status == None:
    st.warning("Please enter your username and password")

if authentication_status:
    # Load the Excel file
    @st.cache
    def get_data_from_excel():
        df = pd.read_excel(
            io="supermarket_sales.xlsx",
            engine='openpyxl',
            sheet_name='Sales',
            skiprows=3,
            usecols='B:R',
            nrows=1000,
        )
        # ADD 'hour' column to dataframe
        df["hour"] = pd.to_datetime(df["Time"], format="%H:%M:%S").dt.hour
        return df

    df = get_data_from_excel()

    st.dataframe(df)

    # --- SIDEBAR ---
    authenticator.logout("Logout", "sidebar")
    st.sidebar.title(f"Welcome {name}")
    st.sidebar.header("Please Filter Here:")
    city = st.sidebar.multiselect(
        "Select the city:",
        options=df["City"].unique(),
        default=df["City"].unique()
    )

    customer_type = st.sidebar.multiselect(
        "Select the Customer Type:",
        options=df["Customer_type"].unique(),
        default=df["Customer_type"].unique()
    )

    gender = st.sidebar.multiselect(
        "Select the Gender:",
        options=df["Gender"].unique(),
        default=df["Gender"].unique()
    )

    df_selection = df.query(
        "City == @city & Customer_type == @customer_type & Gender == @gender"
    )

    # --- MAIN PAGE ---
    st.title(":bar_chart: Sales Dashboard")
    st.markdown("##")

    # TOP KPIs
    total_sales = int(df_selection["Total"].sum())
    average_rating = round(df_selection["Rating"].mean(), 1)
    star_rating = ":star:" * int(round(average_rating, 0))
    average_sale_by_transaction = round(df_selection["Total"].mean(), 2)

    left_column, middle_column, right_column = st.columns(3)
    with left_column:
        st.subheader("Total Sales:")
        st.subheader(f"US $ {total_sales:,}")
    with middle_column:
        st.subheader("Average Rating:")
        st.subheader(f"{average_rating} {star_rating}")
    with right_column:
        st.subheader("Average Sales Per Transaction:")
        st.subheader(f"US $ {average_sale_by_transaction}")

    st.markdown("---")

    # SALES BY PRODUCT LINE [BAR CHART]
    sales_by_product_line = (
        df_selection.groupby(by=["Product line"])["Total"].sum().sort_values()
    )

    fig_product_sales = px.bar(
        sales_by_product_line,
        x=sales_by_product_line.values,
        y=sales_by_product_line.index,
        title='<b>Sales by Product Line</b>',
        orientation="h",
        color_discrete_sequence=["#009388"] * len(sales_by_product_line),
        template="plotly_white",
    )

    fig_product_sales.update_layout(
        plot_bgcolor="rgba(0,0,0,0)",
        xaxis=(dict(showgrid=False))
    )
    st.plotly_chart(fig_product_sales)

    # SALES BY HOUR [BAR CHART]
    sales_by_hour = df_selection.groupby(by=["hour"])[["Total"]].sum()  # Use specific column for aggregation
    fig_hourly_sales = px.bar(
        sales_by_hour,
        x=sales_by_hour.index,
        y="Total",
        title="<b>Sales by Hour</b>",
        color_discrete_sequence=["#008388"] * len(sales_by_hour),
        template="plotly_white"
    )

    fig_hourly_sales.update_layout(
        xaxis=dict(tickmode="linear"),
        plot_bgcolor="rgba(0,0,0,0)",
        yaxis=(dict(showgrid=False)),
    )

    # st.plotly_chart(fig_hourly_sales)
    left_column,right_column = st.columns(2)
    left_column.plotly_chart(fig_hourly_sales,use_container_width=True)
    right_column.plotly_chart(fig_product_sales,use_container_width=True)

    # ---HIDE STREAMLIT STYLE ----
    hide_st_style = """
                    <style>
                    #MainMenu{visibility: hidden;}
                    footer{visibility: hidden;}
                    </style> 
                    """
    st.markdown(hide_st_style, unsafe_allow_html=True)






