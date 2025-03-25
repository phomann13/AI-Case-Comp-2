import pandas as pd
import psycopg2
from sqlalchemy import create_engine
global df
# Function to assign numeric values to categories
def assign_category_and_subcategory_numbers(categories, subcategories):
    category_map = {category: i for i, category in enumerate(categories)}
    subcategory_map = {category: {sub: i for i, sub in enumerate(subs)} for category, subs in subcategories.items()}
    return category_map, subcategory_map
def save_df():
    global df
    # Create a connection string using SQLAlchemy
    engine = create_engine('postgresql://root:password1@localhost:5432/postgres')  # Use the appropriate credentials

    # Ensure that your DataFrame has the correct column names as per your database schema
    df_to_save = df[["issueKey", "category", "subcategory"]]  # Selecting the relevant columns to save
    
    try:
        # Save to the PostgreSQL database, replace if the table exists, and make sure the index is not included
        df_to_save.to_sql('issue', engine, if_exists='replace', index=False)
        print("DataFrame has been saved to the database.")
    except Exception as e:
        print(f"Error while saving to the database: {e}")
    finally:
        engine.dispose()  # Dispose of the engine after use
def update_ticket_category_subcategory():
    global df
    # Establish a database connection
    conn = psycopg2.connect(
        dbname="postgres", 
        user="root", 
        password="password1", 
        host="localhost", 
        port="5432"
    )
    cursor = conn.cursor()
    for index, row in df.iterrows():
        # Prepare the SQL query to update the ticket's category and subcategory

        update_query = """
            UPDATE "Issue"
            SET "category" = %s, "subcategory" = %s
            WHERE "Issue id" = %s;
        """
        cursor.execute(update_query, (row['category'], row['subcategory'], row['issueId']))
    
    conn.commit()  # Commit the changes
    cursor.close()
    conn.close()  # Close the connection
    print("DataFrame has been updated in the database.")
# Function to display ticket details and prompt for category assignment
def classify_ticket_interactively(ticket_data, category_map, subcategory_map, current_index):
    print(f"\nTicket Details (Index {current_index+1}):")
    print(f"Issue ID: {ticket_data['issueId']}")
    print(f"Request Type: {ticket_data['requestType']}")
    print(f"Source: {ticket_data['causeOfIssue']}")
    print(f"Description: {ticket_data['description']}")
    print(f"Summary: {ticket_data['summary']}")

    # Display categories and prompt for user input
    print("\nPlease choose a category for this ticket:")
    for category, num in category_map.items():
        print(f"{num}. {category}")

    while True:
        try:
            category_input = input(f"Enter the category number (0-{len(category_map)-1}), or 'b' to go back, 's' to save: ")

            if category_input.lower() == 'b':
                return None, None  # Allow going back
            elif category_input.lower() == 's':
                update_ticket_category_subcategory()
                continue  # Allow saving
            category_input = int(category_input)
            if category_input in category_map.values():
                category = [k for k, v in category_map.items() if v == category_input][0]
                break
            else:
                print("Invalid input. Please try again.")
        except ValueError:
            print("Invalid input. Please enter a valid number or 'b' to go back.")

    # Display subcategories for the selected category
    print(f"\nPlease choose a subcategory for '{category}':")
    subcategories = subcategory_map.get(category, [])
    for subcategory, num in subcategories.items():
        print(f"{num}. {subcategory}")

    while True:
        try:
            subcategory_input = input(f"Enter the subcategory number (0-{len(subcategories)-1}), or 'b' to go back: ")
            if subcategory_input.lower() == 'b':
                return None, None  # Allow going back
            subcategory_input = int(subcategory_input)
            if subcategory_input in subcategories.values():
                subcategory = [k for k, v in subcategories.items() if v == subcategory_input][0]
                return category, subcategory
            else:
                print("Invalid input. Please try again.")
        except ValueError:
            print("Invalid input. Please enter a valid number or 'b' to go back.")

# Main function to classify tickets and update DataFrame
def classify_tickets(category_map, subcategory_map, start_index):
    global df
    if 'category' not in df.columns:
        df["category"] = None  # Initialize the category column
    if 'subcategory' not in df.columns:
        df["subcategory"] = None  # Initialize the subcategory column

    current_index = start_index
    while current_index < len(df):
        print(f"\nClassifying ticket {current_index+1}/{len(df)}:")
        assigned_category, assigned_subcategory = classify_ticket_interactively(df.iloc[current_index], category_map, subcategory_map, current_index)
        if assigned_category is None and assigned_subcategory is None:
            print("Going back to the previous ticket.")
            if current_index > start_index:
                current_index -= 1  # Go back to previous ticket if user chooses to go back
            continue  # Continue to next iteration without updating the current ticket
        else:
            df.loc[df.index[current_index], "category"] = assigned_category
            df.loc[df.index[current_index], "subcategory"] = assigned_subcategory

            print(f"Assigned Category: {assigned_category}, Subcategory: {assigned_subcategory}")
            print(df.iloc[current_index][["issueId", "category", "subcategory"]])
            current_index += 1  # Move to next ticket
    
    return df




# Connect to PostgreSQL database
conn = psycopg2.connect(
    dbname="postgres", 
    user="root", 
    password="password1", 
    host="localhost", 
    port="5432"
)

# Define your SQL query
query = 'SELECT * FROM "Issue"'

# Execute the query and load the result into a DataFrame
df = pd.read_sql(query, conn)

# Define the column mapping
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

# Rename the columns in the DataFrame
df.rename(columns=column_mapping, inplace=True)
df.sort_values(by='issueId', inplace=True)
# Categories and subcategories definition
categories = ["Order Modification", 
              "Order Cancellation",
              "Status Check", 
              "Refund Request", 
              "Delivery Issue", 
              "Payment Issue", 
              "Account Issue", 
              "Unidentified", 
              "Remove", 
              "General Questions",
              "System Issue",
              "Other"]

subcategories = {
    "Order Modification": ["Add to Order", "Remove from Order", "Change Delivery Date", "Change Delivery Address", "Change Delivery Instructions"],
    "Order Cancellation": ["Cancel Order", "Incorrect Cancellation"],
    "Status Check": ["Track Shipment", "Check Order Status"],
    "Refund Request": ["Request Refund", "Refund Due to Error"],
    "Delivery Issue": ["Delivery Late", "Delivery Early", "Delivery Damaged", "Delivery Lost"],
    "Payment Issue": ["Payment Due", "Payment Late", "Payment Failed", "Payment Dispute"],
    "Account Issue": ["Account Issue", "Account Suspension", "Account Closure"],
    "Unidentified": ["Unidentified"],
    "Remove": ["Remove"],
    "General Questions": ["Product Information", "Order Information", "Payment Information", "Account Information", "Hours of Operation", "About Us", "Contact Us", "Locations", "Volunteer", "Partner", "Donation"],
    "System Issue": ["System Issue", "System Error", "System Down"],
    "Other": ["Other"]
}


# Assign numeric values to categories
category_map, subcategory_map = assign_category_and_subcategory_numbers(categories, subcategories)

# Ask for the starting index
start_index = int(input(f"Enter the starting index (0-{len(df)-1}): "))

# Classify tickets interactively
df = classify_tickets(category_map, subcategory_map, start_index)

# Show the updated DataFrame with the assigned categories
print("\nUpdated DataFrame with assigned categories:")
print(df)

# Print description and categories for rows 160-170
# df = pd.read_csv("categorized_tickets.csv")
# df.sort_values(by='issueId', inplace=True)
# print("\nTickets 160-170:")
# for idx in range(160, 170):
#     if idx < len(df):
#         print(f"\nTicket {idx}:")
#         print("Description:", df.iloc[idx]['description'])
#         print("Category:", df.iloc[idx]['Category'])
#         print("Subcategory:", df.iloc[idx]['Subcategory'])
#         print("-" * 80)

