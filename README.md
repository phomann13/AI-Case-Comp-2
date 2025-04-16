# Project Overview

The purpose of this codebase is to facilitate the needs and creation of the Capital Area Food Bank (CAFB) and the AI case component. This application serves as a ticketing, automation, and research portal.

## Major Pages

### 1. Dashboard
- **Path:** `/dashboard`
- **Description:** The main hub for users to view and manage tickets, customer information, and analytics. It includes various components such as:
  - **Overview:** Displays key metrics and statistics.
  - **Tickets:** Allows users to monitor and manage ticket distribution.
  - **Priority:** Allows users to monitor and manage ticket priority.

### 2. Authentication
- **Sign In Page**
  - **Path:** `/auth/sign-in`
  - **Description:** Allows users to log into their accounts.
  
- **Sign Up Page**
  - **Path:** `/auth/sign-up`
  - **Description:** Enables new users to create an account.

- **Reset Password Page**
  - **Path:** `/auth/reset-password`
  - **Description:** Allows users to reset their passwords.

### 3. Settings
- **Path:** `/dashboard/settings`
- **Description:** Users can manage their account settings, including notifications and password updates.

### 4. Not Found
- **Path:** `/errors/not-found`
- **Description:** Displays a 404 error message when a user navigates to a non-existent page.

### 5. Automation Page
- **Emailing**
  - **Description:** Allows users view the processes of the automatic Customer service operations.

### 6. Business Analytics Page
- **Assistant**
  - **Description:** A AI business assistant that can answer questions about ticket trends overtime.

## Major Components

### 1. Layout Components
- **Layout**
  - **Description:** Provides a consistent layout structure for pages, including navigation and content areas.

- **AuthGuard**
  - **Description:** Protects routes that require authentication, redirecting unauthenticated users to the sign-in page.

- **GuestGuard**
  - **Description:** Prevents authenticated users from accessing sign-in and sign-up pages, redirecting them to the dashboard.

### 2. Dashboard Components
- **Status**
  - **Description:** Displays the status of tickets (e.g., Open, Closed) with visual indicators.

- **Distribution**
  - **Description:** Visualizes ticket distribution over time or by category.

- **Traffic**
  - **Description:** Shows the sources of ticket submissions (e.g., Email, Portal).

### 3. Authentication Components
- **SignInForm**
  - **Description:** Handles user sign-in logic and form validation.

- **SignUpForm**
  - **Description:** Manages user registration and form validation.


## APIs

### 1. Chat API
- **Path:** `/api/chat`
- **Description:** Handles user messages and responses from the AI assistant. It manages session IDs and returns relevant information based on user queries.

### 2. Log Response API
- **Path:** `/api/log_response`
- **Description:** Logs responses from the AI assistant for tracking and analysis.

### 3. Insights API
- **Path:** `/api/insights`
- **Description:** Provides insights and analytics based on ticket data.



## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
## Research (/data exploration)

### 1. Data Formatting
- **Path:** `/data_formatting`
- **Description:** Allows users to format the data for the postgresQL database.

### 2. Data Visualization
- **Path:** `/visualization`
- **Description:** Provides interactive visualizations of ticket data.

### 3. Comment Analysis
- **Path:** `/comment_analysis`
- **Description:** Analyze the comments of the tickets using various tools and models.

### 4. AI Business Insights
- **Path:** `/ai_business_insight`
- **Description:** Provides insights and analytics based on ticket data using AI models.

### 5. Category Prediction
- **Path:** `/category_assignment`
- **Description:** Predicts the category of the ticket based on the data.

### 6. EDA
- **Path:** `/eda`
- **Description:** Exploratory Data Analysis of the ticket data.

## License

This project is licensed under the MIT License.