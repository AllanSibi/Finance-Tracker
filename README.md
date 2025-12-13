# 💰 Finance Tracker

A **secure, full-stack personal finance tracking application** built using **Spring Boot (Java)** for the backend and **HTML, CSS, and JavaScript** for the frontend. The system helps users manage **expenses and users** with **JWT-based authentication** and **role-based access control**.

This project focuses on strong backend fundamentals, clean REST APIs, and a simple, understandable frontend without heavy frameworks.

---

## 🌟 Key Features

### 🔐 Authentication & Security

* Spring Security with **JWT (JSON Web Tokens)**
* Secure user login and registration
* Role-based access control (**USER / ADMIN**)
* Stateless authentication (no session-based login)

### 💳 Expense Management

* Add, update, and delete expenses
* User-specific expense data isolation
* DTO-based request/response handling

### 📊 Financial Tracking

* Track personal expenses
* Persistent storage using **PostgreSQL**

### 📤 Export Capabilities

* CSV export support (Apache Commons CSV)
* PDF generation support (Apache PDFBox)

---

## 🧰 Tech Stack

### Backend

* **Spring Boot 3.5.x**
* Spring Web (REST APIs)
* Spring Security
* JWT (jjwt)
* Spring Data JPA (Hibernate)
* PostgreSQL
* Maven

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)

---

## ⚡ Quick Start Guide

### 📋 Prerequisites

Ensure the following are installed:

* Java JDK **17+**
* Maven
* PostgreSQL
* Git

---

## 🗄️ Database Setup (PostgreSQL)

1. Create a database:

```sql
CREATE DATABASE financetracker;
```

2. Update credentials in `application.properties` if required.

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AllanSibi/Finance-Tracker.git
cd Finance_Tracker
```

---

### 2️⃣ Backend Setup (Spring Boot)

```bash
mvn clean install
mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

---

### 3️⃣ Frontend Setup (HTML / CSS / JS)

The frontend uses static HTML pages.

Open directly in browser or serve via Spring Boot:

```
Frontend/Frontend/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── addexpense.html
└── assets/
```

You can open `index.html` directly in a browser.

---

## 📁 Project Structure

```
Finance_Tracker/
├── project/
│   ├── src/main/java/com/budgetproj/project/
│   │   ├── controllers/
│   │   │   ├── AuthControllerV2.java
│   │   │   └── ExpenseControllerV2.java
│   │   ├── dto/
│   │   │   ├── AuthRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   └── ExpenseDTO.java
│   │   ├── models/
│   │   │   ├── User.java
│   │   │   └── Expenses.java
│   │   ├── repositories/
│   │   │   ├── UserRepository.java
│   │   │   └── ExpenseRepository.java
│   │   ├── security/
│   │   │   ├── JwtAuthFilter.java
│   │   │   ├── JwtUtil.java
│   │   │   └── SecurityConfig.java
│   │   ├── services/
│   │   │   └── ExpenseService.java
│   │   └── ProjectApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── Frontend/Frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── addexpense.html
│   └── assets/
├── README.md
└── .gitignore
```

---

## 🔌 API Endpoints

### 🔐 Authentication

* `POST /api/auth/login` – User login
* `POST /api/auth/register` – User registration

### 💳 Expenses

* `GET /api/expenses` – Get user expenses
* `POST /api/expenses` – Add expense
* `PUT /api/expenses/{id}` – Update expense
* `DELETE /api/expenses/{id}` – Delete expense

---

## 🔐 Security Notes

* JWT token must be sent in headers:

```http
Authorization: Bearer <token>
```

* All expense APIs are protected

---

## 🚀 Build & Run

### Build JAR

```bash
mvn clean package
```

### Run Application

```bash
java -jar target/project-0.0.1-SNAPSHOT.jar
```

---

## 🧪 Common Issues

### ❌ Database Connection Failed

* Ensure PostgreSQL is running
* Verify DB credentials in `application.properties`

### ❌ Port Already in Use

```bash
npx kill-port 8080
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch:

```bash
git checkout -b feature/your-feature
```

3. Commit changes:

```bash
git commit -m "Add feature: description"
```

4. Push and create a Pull Request

---

## 📜 License

This project is developed for **educational and learning purposes**.

---

## 👨‍💻 Author

**Allan Sibi**
GitHub: [https://github.com/AllanSibi](https://github.com/AllanSibi)

---

✨ *A clean and secure finance tracker using Spring Boot and vanilla web technologies.*
