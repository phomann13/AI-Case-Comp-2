import pandas as pd

# Load the cleaned CSV file
file_path = "./processed_data_clean.csv"
df = pd.read_csv(file_path)

# Checking uniques of values in Issue Key
print("Issue Key Uniques: ", len(df["Issue key"].unique())== len(df))

# Checking uniques of values in Issue Type
print('Unique Issue Types: ', df["Issue Type"].unique())

# Checking uniques of values in status
print('Unique Status: ', df["Status"].unique())

# Checking uniques of values in Project Key
print('Unique Project Key: ', df["Project key"].unique())

# Checking uniques of values in Project Name
print('Unique Project Name: ', df["Project name"].unique())

# Checking uniques of values in Resolution
print('Unique Resolution: ', df["Resolution"].unique())

# Checking uniques of values in Priority
print('Unique Priority: ', df["Priority"].unique())

# Checking uniques of values in Status Category
print('Unique Status Category: ', df["Status Category"].unique())

# Checking uniques of values in Assignee
print('Unique Assignee: ', df["Assignee"].unique())

# Checking uniques of values in Custom field (Cause of issue)
print('Unique Cause of issue: ', df["Custom field (Cause of issue)"].unique())

# Checking Uniques of values in Custom field (Relevant Departments)
print('Unique Relevant Departments: ', df["Custom field (Relevant Departments)"].unique())

# Checking Uniques of values in Custom field (Relevant Departments).1
print('Unique Relevant Departments.1: ', df["Custom field (Relevant Departments).1"].unique())

# Checking Uniques of values in Custom field (Request Category)
print('Unique Request Category: ', df["Custom field (Request Category)"].unique())

#Checking Uniqueness values in Custom Field (Request Type)
print('Unique Request Type: ', df["Custom field (Request Type)"].unique())

#Checking Uniqueness values in Custom Field (Resolution Action)
print('Unique Resolution Action: ', df["Custom field (Resolution Action)"].unique())

#Checking Uniqueness values in Custom Field 






