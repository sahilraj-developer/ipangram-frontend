Employee Management System
This project implements an Employee Management System with features for both employees and managers. Below is an overview of the functionalities and how they are implemented.

Frontend Features
1. Signup/Login Page
Implemented a signup/login page for both employees and managers.
Users are authenticated using JWT tokens stored in local storage.

2. Department Management
Managers can create, update, and delete departments.
Employees have view-only access to department details.

3. Employee List Page
Displays a list of all employees.
Employees and managers can view basic employee details.

4. Employee Details Page/Modal
Provides detailed information about each employee.
Accessible to both managers and employees.

5. Filtering Employees
Implemented filtering based on employee name and location.
Sorting can be done in ascending and descending order via API endpoints.

6. Department Assignment
Managers can assign departments to employees.






Backend Features
1. Authentication
Implemented login/signup routes for user authentication using JWT tokens.

2. Department CRUD Operations
Created endpoints for creating, reading, updating, and deleting departments.
Only managers have permission to perform these operations.

3. Employee CRUD Operations
Implemented endpoints for managing employees, including create, read, update, and delete operations.
Only managers can update or delete employee records.

4. Filtering Endpoints
Implemented two endpoints to filter employees:
Sorting employees by location in ascending order.
Sorting employees by name in ascending and descending order based on user selection.



Configured a database with necessary tables and relationships to store employee and department data securely.

Data access control ensures that employees can only access their own data, while managers can view departmental data including assigned employees.

To run the project locally:

Clone this repository.
Install dependencies in both "frontend" and "employee-manager-backend" using npm install.
Start the frontend and backend servers concurrently using npm start.
Access the application at http://localhost:3000.



Technologies Used
React.js for frontend development.
Node.js and Express.js for backend API development.
MongoDB as the database.
Axios for handling API requests.
JWT for user authentication and authorization.