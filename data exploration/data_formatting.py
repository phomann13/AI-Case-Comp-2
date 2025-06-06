import pandas as pd
import json
from datetime import time
import numpy as np
# Load the Excel file
from sqlalchemy import create_engine, text, MetaData, Table, Column, Integer, String, Float, DateTime, JSON
import sqlite3
from sqlalchemy.exc import SQLAlchemyError

# Define PostgreSQL connection
db_url = "postgresql://root:password1@localhost:5432/postgres"
engine = create_engine(db_url)

column_mapping = {
        "Summary": "summary",
        "Issue key": "issueKey",
        "Issue id": "issueId",
        "Issue Type": "issueType",
        "Status": "status",
        "Project key": "projectKey",
        "Project name": "projectName",
        "Priority": "priority",
        "Resolution": "resolution",
        "Assignee": "assignee",
        "Reporter (Email)": "reporterEmail",
        "Creator (Email)": "creatorEmail",
        "Created": "created",
        "Updated": "updated",
        "Last Viewed": "lastViewed",
        "Resolved": "resolved",
        "Due date": "dueDate",
        "Description": "description",
        "Partner Names": "partnerNames",
        "Custom field (Cause of issue)": "causeOfIssue",
        "Custom field (Record/Transaction ID)": "recordTransactionId",
        "Custom field (Region)": "region",
        "Custom field (Relevant Departments)": "relevantDepartments",
        "Custom field (Relevant Departments).1": "relevantDepartments1",
        "Custom field (Request Category)": "requestCategory",
        "Custom field (Request Type)": "requestType",
        "Custom field (Request language)": "requestLanguage",
        "Custom field (Resolution Action)": "resolutionAction",
        "Satisfaction rating": "satisfactionRating",
        "Custom field (Satisfaction date)": "satisfactionDate",
        "Custom field (Source)": "source",
        "Custom field (Time to first response)": "timeToFirstResponse",
        "Custom field (Time to resolution)": "timeToResolution",
        "Custom field (Work category)": "workCategory",
        "Status Category": "statusCategory",
        "Status Category Changed": "statusCategoryChanged",
        "Custom field ([CHART] Date of First Response)": "dateOfFirstResponse",
        "comments": "comments"
    }
# Find columns that contain the string

file_path = "./data_case2.xlsx"  # Update with your actual file path
df = pd.read_excel(file_path)
# Identify the comment columns
comment_columns = [col for col in df.columns if col.startswith("Comment")]
# print(comment_columns)
# print([[x] for x in comment_columns ])
comments_json_list = []
# Merge all comment columns into a single array of strings, with quotes around each comment
for i, row in df.iterrows():
    # Create a dictionary to store the comments with their respective column names
    comments_dict = {}
    
    # Add non-null comments to the dictionary with keys like 'comment1', 'comment2', etc.
    for j, col in enumerate(comment_columns):
        comment_value = row[col]
        if pd.notna(comment_value):  # Only add non-null comments
            comments_dict[f"comment{j + 1}"] = comment_value
    
    # Append the dictionary to the list
    comments_json_list.append(comments_dict)

# Now, assign the JSON-style list to the 'comments' column in one go
df['comments'] = comments_json_list
for column in df.columns:
    if isinstance(df[column].iloc[0], dict):  # Check if the column contains dictionaries
        df[column] = df[column].apply(json.dumps)
# Check the type of the first entry in 'comments'
# print(type(df.loc[0, 'comments']))




# Drop original comment columns
df = df.drop(columns=comment_columns)

# List of time-related columns to handle
time_columns = [
    "Custom field ([CHART] Date of First Response)",
    "Custom field (Time to first response)",
    "Custom field (Time to resolution)",
    # "Status Category Changed",
    # "Custom field (Satisfaction date)",
    # "Resolved",
    # "Last Viewed",
    # "Created",
    # "Updated"
]
def parse_time(value):
    # Handle Unix timestamp format "1/1/1970 0:27" or similar
    try:
        # Try parsing as a timestamp (e.g., "1/1/1970 0:27")
        parsed_time = pd.to_datetime(value, errors='coerce')
        # print(parsed_time)
        if pd.notna(parsed_time):  # If valid timestamp
            # print("Valid timestamp")
            return int(parsed_time.hour) * 3600 + int(parsed_time.minute) * 60 + float(parsed_time.second)
            # return parsed_time  # <-- Return as datetime instead of epoch

    except Exception:
        pass

    # Handle durations in the format HH:MM or MM:SS (e.g., "2:55", "1:37")
    try:
        # Check if it's a duration (MM:SS or HH:MM:SS)
        if isinstance(value, str) and ":" in value:
            print(value)
            time_parts = value.split(":")
            if len(time_parts) == 2:  # MM:SS
                minutes, seconds = time_parts
                print(value, minutes, seconds)
                return int(minutes) * 60 + float(seconds)
            elif len(time_parts) == 3:  # HH:MM:SS (in case it's in this format)
                hours, minutes, seconds = time_parts
                return int(hours) * 3600 + int(minutes) * 60 + float(seconds)
    except Exception:
        pass

    # Handle datetime.time objects
    if isinstance(value, time):
        print(value)
        return value.hour * 3600 + value.minute * 60 + value.second

    # Return NaN if unable to parse
    return pd.NaT
# Fix time-related columns
for col in time_columns:
#     # Handle potential invalid timestamp values
#     if col == 'Custom field ([CHART] Date of First Response)':
        # print(df[col])
    df[col] = df[col].apply(parse_time)

# print(parse_time(df['Custom field ([CHART] Date of First Response)'][1]), pd.to_datetime(df['Custom field ([CHART] Date of First Response)'][1]))


df['Custom field (Cause of issue)'].replace(np.nan, '', inplace=True)

df['Custom field (Cause of issue)'] = df['Custom field (Cause of issue)'].apply(lambda x: str(x).strip())
# print(df['Custom field (Cause of issue)'].unique())
unique_types = df['Custom field (Cause of issue)'].apply(type).unique()
# print("Unique types in 'Custom field (Cause of issue)':", unique_types)
df['Custom field (Cause of issue)'] = df['Custom field (Cause of issue)'].astype(str)


df['Resolved'] = pd.to_datetime(df['Resolved'])
df['lastMessage'] = ''
df['priorityScore'] = 0.0
# print(df['Resolved'])
# for col in df.columns:
#     df[col].replace(np.nan, '', inplace=True)
for col in df.columns:
    if df[col].dtype == 'int64':
        df[col].fillna(0, inplace=True)
    elif df[col].dtype == 'string':  # Assuming string columns are of type 'object'
        df[col].fillna('', inplace=True)
    elif df[col].dtype == 'float64':
        df[col].fillna(0, inplace=True)
df = df.rename(columns=column_mapping)
# Save cleaned CSV
# print(comment_columns)

output_file = "processed_data_clean.csv"
df.to_csv(output_file, index=False)

# print(f"Processed file saved as {output_file}")
df['category'] = 'Unlabelled'
df['subcategory'] = 'Unlabelled'
dts = ['created', 'updated', 'lastViewed', 'resolved', 'dueDate', 'satisfactionDate', 
       'satisfactionDate',
       ]
for dt in dts:
    df[dt] = pd.to_datetime(df[dt])
meta = MetaData()
issues = Table(
   'Issue', meta, 
   Column('issueId', Integer, primary_key = True, autoincrement=False), 
   Column('summary', String), 
   Column('issueKey', String),
   Column('issueType', String),
   Column('status', String),
   Column('projectKey', String),
   Column('projectName', String),
   Column('priority', String),
   Column('resolution', String),
   Column('assignee', String),
   Column('reporterEmail', String),
   Column('creatorEmail', String),
   Column('created', DateTime),
   Column('updated', DateTime),
   Column('lastViewed', DateTime),
   Column('resolved', DateTime),
   Column('dueDate', DateTime),
   Column('description', String),
   Column('partnerNames', String),
   Column('causeOfIssue', String),
   Column('recordTransactionId', String),
   Column('region', String),
   Column('relevantDepartments', String),
   Column('relevantDepartments1', String),
   Column('requestCategory', String),
   Column('requestType', String),
   Column('requestLanguage', String),
   Column('resolutionAction', String),
   Column('satisfactionRating', Float),
   Column('satisfactionDate', DateTime),
   Column('source', String),
   Column('timeToFirstResponse', Integer),
   Column('timeToResolution', Integer),
   Column('statusCategoryChanged', DateTime),
   Column('dateOfFirstResponse', DateTime),
   Column('comments', JSON),
   Column('priorityScore', Float),
   Column('category', String),
   Column('subcategory', String),
   Column('workCategory', String),
   Column('statusCategory', String),
   Column('lastMessage', String),
   
)
# print(df.columns, df.dtypes)
import pandas as pd
import numpy as np

# Ensure that time columns are datetime
df['created'] = pd.to_datetime(df['created'], errors='coerce')
df['updated'] = pd.to_datetime(df['updated'], errors='coerce')
df['lastViewed'] = pd.to_datetime(df['lastViewed'], errors='coerce')
df['resolved'] = pd.to_datetime(df['resolved'], errors='coerce')
df['dueDate'] = pd.to_datetime(df['dueDate'], errors='coerce')
df['satisfactionDate'] = pd.to_datetime(df['satisfactionDate'], errors='coerce')
df['statusCategoryChanged'] = pd.to_datetime(df['statusCategoryChanged'], errors='coerce')
df['dateOfFirstResponse'] = pd.to_datetime(df['dateOfFirstResponse'], errors='coerce')

# Ensure that 'timeToFirstResponse' and 'timeToResolution' are integers
df['timeToFirstResponse'] = pd.to_numeric(df['timeToFirstResponse'], errors='coerce', downcast='integer')
df['timeToResolution'] = pd.to_numeric(df['timeToResolution'], errors='coerce', downcast='integer')

# Ensure 'satisfactionRating' is float
df['satisfactionRating'] = pd.to_numeric(df['satisfactionRating'], errors='coerce', downcast='float')

# Ensure 'comments' is in JSON-compatible format (if necessary)
# You can use `json.loads()` if it's a string containing JSON
import json
df['comments'] = df['comments'].apply(json.dumps)

# Now, try inserting the DataFrame to the SQL table again
# df.to_sql('Issue', engine, if_exists='append', index=False)

# Drop the table if it exists to avoid DuplicateColumnError
with engine.connect() as connection:
    meta.drop_all(engine)
    meta.create_all(engine)
# Now, write the DataFrame to SQL with issueId as a unique index
import json

# Convert the 'comments' column from dict to JSON string (if it’s a dict)
# df['comments'] = df['comments'].apply(lambda x: json.dumps(x) )
# df['comments'] = df['comments'].astype(json)
print(df.columns,df['comments'].dtypes)
# Now try inserting the DataFrame into the SQL table again
try:
    df.to_sql('Issue', engine, if_exists='append', index=False)
    print()
except SQLAlchemyError as e:
    print(f"Error occurred: {str(e)}")


# Create a unique index on issueId
# with engine.connect() as connection:
#     try:
#         connection.execute(text('ALTER TABLE "Issue" ADD CONSTRAINT unique_index PRIMARY KEY ("index")'))
#         connection.execute(text('CREATE UNIQUE INDEX idx_index ON "Issue" ("index")'))
#         # connection.execute(text('ALTER TABLE "Issue" ADD CONSTRAINT unique_issueId UNIQUE ("issueId")'))
#         # connection.execute(text('ALTER TABLE "Issue" ADD CONSTRAINT unique_issueKey PRIMARY KEY ("issueId")'))
    
#     except Exception as e:
#         print("Error adding primary key:", e)
# connection.execute(text('CREATE UNIQUE INDEX idx_issueId ON "Issue" ("issueId")'))
    # connection.execute(text('ALTER TABLE "Issue" ADD CONSTRAINT unique_issueId UNIQUE ("issueId")'))
    # connection.execute(text('ALTER TABLE "Issue" ADD CONSTRAINT unique_issueKey PRIMARY KEY ("issueId")'))
    
# conn = sqlite3.connect(db_url)
# c = conn.cursor()
# Add unique constraint on issueId
# c.execute("CREATE UNIQUE INDEX idx_issueId ON Issue (issueId)")
# conn.commit()
# conn.close()
