import os
import openai
import pandas as pd
import psycopg2
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load environment variables from the parent directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

# Retrieve the API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set. Check your .env file.")

client = openai.OpenAI(api_key=OPENAI_API_KEY)  # Use OpenAI's new Client class

# Function to assign numeric values to categories
def assign_category_and_subcategory_numbers(categories, subcategories):
    category_map = {category: i for i, category in enumerate(categories)}
    subcategory_map = {category: {sub: i for i, sub in enumerate(subs)} for category, subs in subcategories.items()}
    return category_map, subcategory_map

# Connect to PostgreSQL database
conn = psycopg2.connect(
    dbname="postgres", 
    user="root", 
    password="password1", 
    host="localhost", 
    port="5432"
)

# Load data into a DataFrame
query = 'SELECT * FROM "Issue"'
df = pd.read_sql(query, conn)

# Define column mapping
column_mapping = {
    "Summary": "summary",
    "Custom field (Request Type)": "requestType",
    "Custom field (Cause of issue)": "causeOfIssue",
    "Description": "description",
    "Issue id": "issueId"
}
df.rename(columns=column_mapping, inplace=True)
df.sort_values(by='issueId', inplace=True)

# Categories and subcategories definition
set_categories = ["Order Modification", "Order Cancellation", "Order Change", "Status Check", "Refund Request", 
              "Delivery Issue", "Payment Issue", "Account Issue", "Unidentifyable", "Remove", "Other", 
              "Partner Support"]
set_subcategories = {
    "Order Modification": ["Add to Order", "Remove from Order", "Change Quantity"],
    "Order Cancellation": ["Cancel Order", "Incorrect Cancellation"],
    "Status Check": ["Track Shipment", "Check Order Status"],
    "Refund Request": ["Request Refund", "Refund Due to Error"],
    "Delivery Issue": ["Delivery Late", "Delivery Early", "Delivery Damaged", "Delivery Lost"],
    "Payment Issue": ["Payment Due", "Payment Late", "Payment Failed", "Payment Dispute"],
    "Account Issue": ["Account Issue", "Account Suspension", "Account Closure"],
    "Unidentifyable": ["Unidentified"],
    "Remove": ["Remove"],
    "Partner Support": ["Partner Support", "Partner Support Issue"],
    "Other": ["Other"]
}
category_map, subcategory_map = assign_category_and_subcategory_numbers(set_categories, set_subcategories)

# Function to classify issues using OpenAI API
def classify_issues(batch, set_categories, set_subcategories):
    prompts = [
        f"Classify the following IT support issue into a category and subcategory from this list: {set_categories} with their respective subcategories: {set_subcategories}. \n\n"
        f"Summary: {row['summary']} \n"
        f"Request Type: {row['requestType']} \n"
        f"Cause of Issue: {row['causeOfIssue']} \n"
        f"Description: {row['description']} \n"
        f"Provide the result in this format - Category: <Category>, Subcategory: <Subcategory>"
        for _, row in batch.iterrows()
    ]
    
    results = []
    categories = []
    subcategories = []

        
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": "You are an IT support assistant that categorizes tickets accurately."}] + 
                    [{"role": "user", "content": prompt} for prompt in prompts],
        max_tokens=100  # Adjust as needed based on prompt size
    )
    
    # Debugging output to inspect the raw response
    print(response.choices)  
    
    # Extract category and subcategory for each response
    for choice in response.choices:
        content = choice.message.content.strip()  # Extract the content from the message
        if content:
            # Process the response assuming the format is "Category: <Category>, Subcategory: <Subcategory>"
            category_subcategory = content.split(", ")
            if len(category_subcategory) == 2:
                category = category_subcategory[0].replace("Category: ", "")
                subcategory = category_subcategory[1].replace("Subcategory: ", "")
                categories.append(category)
                subcategories.append(subcategory)

    return categories, subcategories

# Process data in batches of 20
df["Category"] = ""
df["Subcategory"] = ""
for i in range(160, 180, 20):
    batch = df.iloc[i:i+20]
    print(batch)
    # categories, subcategories = classify_issues(batch, set_categories, set_subcategories)
    # print(categories)
    # print(subcategories)
    # df.loc[batch.index, "Category"] = categories
    # df.loc[batch.index, "Subcategory"] = subcategories

# Save results
df.to_csv("categorized_tickets.csv", index=False)
