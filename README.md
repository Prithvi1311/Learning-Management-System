# Binary Academy - Learning Management System (LMS)

Binary Academy is a robust, full-featured Learning Management System designed to bridge the gap between instructors and students. It offers a seamless experience for course creation, enrollment, learning, assessment, and certification.

## 🚀 Features

### 🎓 For Students
*   **Course Enrollment:** Browse and enroll in a wide variety of courses.
*   **Interactive Learning:** Watch video lessons and track progress.
*   **Assessments:** Take quizzes to test your knowledge.
*   **Certification:** Earn and download a professional PDF certificate upon passing assessments (Score > 60%).
*   **Student Dashboard:** Manage enrolled courses and view progress.

### 👨‍🏫 For Instructors
*   **Course Management:** Create, update, and delete courses.
*   **Lesson Management:** Upload video lessons and organize course content.
*   **Quiz Creation:** Add questions to courses to assess students.
*   **Instructor Dashboard:** View your courses and student enrollments.

### 🛡️ For Administrators
*   **User Management:** Manage students and instructors.
*   **Course Oversight:** Monitor all courses on the platform.
*   **Admin Dashboard:** Overview of platform statistics.

## 🛠️ Tech Stack

*   **Frontend:** React.js, Tailwind CSS, Ant Design
*   **Backend:** Java Spring Boot, Hibernate, JPA
*   **Database:** MySQL
*   **PDF Generation:** iText (OpenPDF)
*   **Build Tools:** Maven (Backend), NPM (Frontend)

---

## 💻 Local Setup Guide

### Prerequisites
*   Java Development Kit (JDK) 17 or higher
*   Node.js (v18+) and npm
*   MySQL Server

### 1. Database Setup
1.  Open your MySQL Workbench or CLI.
2.  Create a database:
    ```sql
    CREATE DATABASE lms_db;
    ```
3.  Update the database credentials in `backend/src/main/resources/application.yml`.

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Build the project and download dependencies:
    ```bash
    mvn clean install
    ```
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    *The backend server will start on `http://localhost:8080`.*

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    *The frontend will open at `http://localhost:3000`.*

---

## ☁️ Deployment Guide (Railway / Docker)

 This project is configured for deployment using Docker, making it easy to deploy on platforms like **Railway**, **Render**, or **AWS**.

### Option A: Deploying on Railway (Recommended)

**Step 1: Prepare Database**
1.  Create a MySQL service on Railway.
2.  Note down the connection variables: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`.

**Step 2: Backend Deployment**
1.  Fork/Upload this repository to GitHub.
2.  Create a new Service on Railway from your GitHub repo.
3.  Select the **Root Directory** as `/backend`.
4.  Add the following Environment Variables in Railway:
    *   `SPRING_DATASOURCE_URL`: `jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}`
    *   `SPRING_DATASOURCE_USERNAME`: `${MYSQLUSER}`
    *   `SPRING_DATASOURCE_PASSWORD`: `${MYSQLPASSWORD}`
5.  Railway will automatically detect the `Dockerfile` in the backend folder and build it.

**Step 3: Frontend Deployment**
1.  Create another Service on Railway from the same GitHub repo.
2.  Select the **Root Directory** as `/frontend`.
3.  Add an Environment Variable:
    *   `REACT_APP_API_URL`: The URL of your deployed Backend service (e.g., `https://backend-production.up.railway.app`).
4.  Railway will detect the `Dockerfile` (or you can use a static site build command) to deploy the React app.

### Option B: Manual Docker Build

If you want to run the containers locally or on a VPS:

**Backend:**
```bash
cd backend
docker build -t lms-backend .
docker run -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/lms_db -e SPRING_DATASOURCE_USERNAME=root -e SPRING_DATASOURCE_PASSWORD=password lms-backend
```

**Frontend:**
```bash
cd frontend
docker build -t lms-frontend .
docker run -p 3000:3000 -e REACT_APP_API_URL=http://localhost:8080 lms-frontend
```

## 📜 Certificate Configuration
To customize the certificate logo or signature:
1.  Replace `backend/src/main/resources/logo.png`.
2.  Replace `backend/src/main/resources/signature.png`.
3.  Rebuild the backend.

---
**Binary Academy** &copy; 2024
