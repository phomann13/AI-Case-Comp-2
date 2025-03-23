import nltk
# nltk.download('stopwords')
# nltk.download('punkt')
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from textblob import TextBlob
import spacy
import re
import string
import sqlite3
from sqlalchemy import create_engine
import psycopg2
# Database URL
# db_url = "postgresql://root:password1@localhost:5432/postgres"
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

# Create a connection engine using SQLAlchemy
# engine = create_engine(db_url)

# Define your SQL query
# query = "SELECT * FROM your_table_name"

# Load the query result directly into a DataFrame
df = pd.read_sql(query, conn)

# View the DataFrame
print(df.head())


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
# Data Preprocessing
def clean_text(text):
    if isinstance(text, str):
        # Remove non-alphabetic characters and lowercase the text
        text = re.sub(f"[{string.punctuation}]", "", text.lower())
        return text
    return ""
# Apply text cleaning to relevant columns
df['clean_summary'] = df['summary'].apply(clean_text)
df['clean_description'] = df['description'].apply(clean_text)
df['clean_comments'] = df['comments'].apply(lambda x: ' '.join([clean_text(comment) for comment in x.split(';')]))

# Handle missing values (drop rows with missing important columns)
df.dropna(subset=['summary', 'priority', 'issueType', 'status', 'comments'], inplace=True)

# Tokenization and stopword removal
stop_words = set(stopwords.words('english'))

def remove_stopwords(text):
    return ' '.join([word for word in word_tokenize(text) if word not in stop_words])

df['clean_summary'] = df['clean_summary'].apply(remove_stopwords)
df['clean_description'] = df['clean_description'].apply(remove_stopwords)
df['clean_comments'] = df['clean_comments'].apply(remove_stopwords)

# Exploratory Data Analysis
# Ticket distribution by issueType and priority
plt.figure(figsize=(10, 6))
sns.countplot(data=df, x='issueType', hue='priority')
plt.title("Ticket Distribution by Issue Type and Priority")
plt.xticks(rotation=45)
plt.show()

# Satisfaction rating vs issue type
df['satisfactionRating'] = pd.to_numeric(df['satisfactionRating'], errors='coerce')
plt.figure(figsize=(10, 6))
sns.boxplot(data=df, x='issueType', y='satisfactionRating')
plt.title("Satisfaction Rating by Issue Type")
plt.xticks(rotation=45)
plt.show()

# Time to resolution analysis
df['time_to_resolution'] = df['timeToResolution'].apply(lambda x: x if pd.notnull(x) else 0)
plt.figure(figsize=(10, 6))
sns.histplot(df['time_to_resolution'], kde=True)
plt.title("Time to Resolution Distribution")
plt.show()

# Sentiment Analysis on Comments using TextBlob
def get_sentiment(text):
    sentiment = TextBlob(text).sentiment
    return sentiment.polarity

df['comment_sentiment'] = df['clean_comments'].apply(get_sentiment)

# Sentiment Distribution
plt.figure(figsize=(10, 6))
sns.histplot(df['comment_sentiment'], kde=True)
plt.title("Sentiment Analysis of Comments")
plt.show()

# Topic Modeling using LDA
# Vectorize the text data
vectorizer = CountVectorizer(stop_words='english')
X = vectorizer.fit_transform(df['clean_comments'])

# Apply LDA
lda = LatentDirichletAllocation(n_components=5, random_state=42)
lda.fit(X)

# Display topics
for index, topic in enumerate(lda.components_):
    print(f"Topic {index}:")
    print([vectorizer.get_feature_names_out()[i] for i in topic.argsort()[:-11 - 1:-1]])

# Train a Classifier to predict if a ticket can be handled by the bot or needs escalation
# Use 'summary' and 'description' as features
X = df[['clean_summary', 'clean_description']]
y = df['priority'].apply(lambda x: 1 if x == 'High' else 0)  # High priority -> 1 (escalation), Low/Medium -> 0 (bot can handle)

# Vectorize text data
X_text = X.apply(lambda row: row['clean_summary'] + ' ' + row['clean_description'], axis=1)
X_text_vec = vectorizer.fit_transform(X_text)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_text_vec, y, test_size=0.2, random_state=42)

# Train Random Forest Classifier
clf = RandomForestClassifier(random_state=42)
clf.fit(X_train, y_train)

# Predict and evaluate
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))

# Bot Context Creation (using a sample query)
def generate_ticket_context(ticket_id):
    ticket = df[df['issueKey'] == ticket_id]
    if ticket.empty:
        return "Ticket not found."
    
    context = {
        'summary': ticket['summary'].values[0],
        'priority': ticket['priority'].values[0],
        'status': ticket['status'].values[0],
        'description': ticket['description'].values[0],
        'comments': ticket['comments'].values[0]
    }
    
    return context

# Example usage:
ticket_id = 'TICKET-123'
print(generate_ticket_context(ticket_id))

