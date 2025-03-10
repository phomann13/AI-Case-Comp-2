import pandas as pd
import json
from datetime import time
import numpy as np
# Load the Excel file
from sqlalchemy import create_engine

# Define PostgreSQL connection
db_url = "postgresql://root:password1@localhost:5432/postgres"
engine = create_engine(db_url)

# Find columns that contain the string

file_path = "./data_case2.xlsx"  # Update with your actual file path
df = pd.read_excel(file_path)

# Identify comment columns
comment_columns = [col for col in df.columns if col.startswith("Comment")]

# Merge all comment columns into a single JSON-formatted string
df["comments"] = df[comment_columns].apply(lambda row: [x for x in row if pd.notna(x)], axis=1)


# Drop original comment columns
df = df.drop(columns=comment_columns)

# List of time-related columns to handle
time_columns = [
    "Custom field ([CHART] Date of First Response)",
    "Custom field (Time to first response)",
    "Custom field (Time to resolution)",
    "Status Category Changed",
    "Custom field (Satisfaction date)",
    "Resolved",
    "Last Viewed",
    "Created",
    "Updated"
]
def parse_time(value):
    # Handle Unix timestamp format "1/1/1970 0:27" or similar
    try:
        # Try parsing as a timestamp (e.g., "1/1/1970 0:27")
        parsed_time = pd.to_datetime(value, errors='coerce')
        if pd.notna(parsed_time):  # If valid timestamp
            return parsed_time  # <-- Return as datetime instead of epoch

    except Exception:
        pass

    # Handle durations in the format HH:MM or MM:SS (e.g., "2:55", "1:37")
    try:
        # Check if it's a duration (MM:SS or HH:MM:SS)
        if isinstance(value, str) and ":" in value:
            time_parts = value.split(":")
            if len(time_parts) == 2:  # MM:SS
                minutes, seconds = time_parts
                return int(minutes) * 60 + float(seconds)
            elif len(time_parts) == 3:  # HH:MM:SS (in case it's in this format)
                hours, minutes, seconds = time_parts
                return int(hours) * 3600 + int(minutes) * 60 + float(seconds)
    except Exception:
        pass

    # Handle datetime.time objects
    if isinstance(value, time):
        return value.hour * 3600 + value.minute * 60 + value.second

    # Return NaN if unable to parse
    return pd.NaT
# Fix time-related columns
for col in time_columns:
#     # Handle potential invalid timestamp values
#     if col == 'Custom field ([CHART] Date of First Response)':
        # print(df[col])
    df[col] = df[col].apply(parse_time)

print(parse_time(df['Custom field ([CHART] Date of First Response)'][1]), pd.to_datetime(df['Custom field ([CHART] Date of First Response)'][1]))


df['Custom field (Cause of issue)'].replace(np.nan, '', inplace=True)

df['Custom field (Cause of issue)'] = df['Custom field (Cause of issue)'].apply(lambda x: str(x).strip())
print(df['Custom field (Cause of issue)'].unique())
unique_types = df['Custom field (Cause of issue)'].apply(type).unique()
print("Unique types in 'Custom field (Cause of issue)':", unique_types)
df['Custom field (Cause of issue)'] = df['Custom field (Cause of issue)'].astype(str)

for col in df.columns:
    df[col].replace(np.nan, '', inplace=True)
df.fillna('', inplace=True)
# Save cleaned CSV
output_file = "processed_data_clean.csv"
df.to_csv(output_file, index=False)

print(f"Processed file saved as {output_file}")

df.to_sql('issues', engine, if_exists='replace', index=False)