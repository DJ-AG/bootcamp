# [BOOTCAMP - SERVER SIDE]

Developed by DJ-AG

This project focuses on developing a backend RESTful API for a Bootcamp Directory App. The frontend/UI will be tackled in a subsequent phase and will reside in a separate 'client' folder. Here are the core features and functionalities of the backend:

Real World Backend API: This backend is designed to handle the specific needs of a Bootcamp Directory App, from basic CRUD operations to more complex functionalities.

HTTP Fundamentals: The API adheres to standard HTTP practices, encompassing the Request/Response Cycle and status codes.

Advanced Mongoose Queries: Complex data operations are made possible through the use of advanced Mongoose queries.

JWT/Cookie Authentication: The system utilizes JWT and Cookie-based methods to authenticate users and manage sessions.

Express & Mongoose Middleware: Key middlewares integrated include Geocoding, authentication processes, and error handling.

API Security: Measures are in place to prevent threats like NoSQL injection and XSS. Rate limiting has also been implemented to manage request traffic.

API Documentation & Deployment: Clear documentation aids in understanding and utilizing the API effectively. The deployment process ensures a seamless rollout for real-world use.

Additional features include authentication protocols, role-based permissions, email functionality, and password reset capabilities.

## Usage

Inside ./server Rename "your.env" to ".env" and update the values/settings to your own

## Install Dependencies

when your in ./server RUN commands below

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

```
# Destroy all data
node seeder -destroy

# Import all data
node seeder -import
