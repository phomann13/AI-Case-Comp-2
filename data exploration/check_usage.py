import pandas as pd
import json
from datetime import time
import numpy as np
# Load the Excel file
from sqlalchemy import create_engine
import psycopg2
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

for index, row in df.iterrows():
    if index > 160 and index < 190:
        print(row['category'])
        print(row['subcategory'])
        print("-"*80)
