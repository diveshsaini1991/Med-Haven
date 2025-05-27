
# MedHaven - Care Network 🏥️

MedHaven - It is a comprehensive Hospital Management System built using the MERN (MongoDB, Express, React, Node.js) stack. The system is designed to manage hospital operations, including patient registration, appointment scheduling, medical records, and Listing Doctors.





## Features

- Patient registration and management
- Appointment scheduling and management
- Medical records management
- Admin dashboard for hospital staff

- **Password Hashing:** Passwords are hashed using bcrypt for secure storage in the database.
- **JWT Token Authentication:** JSON Web Tokens (JWT) are used to authenticate users and authorize access to protected routes.
- **Input Validation:** Input fields are validated to ensure that users enter valid data.



## Technical Details

**Frontend:** React

**Backend:** Node.js, Express

**Database:** MongoDB

**Authentication:** JSON Web Tokens (JWT)

**Password Hashing:** bcrypt

**CORS:** Enabled for cross-origin resource sharing

**Testing:**  APIs tested using Postman

**Containerization:** Docker & Docker Compose


## API Endpoints 


#### User 

```http
  POST /api/v1/user/patient/register
  POST /api/v1/user/login
  POST /api/v1/user/admin/addnew
  GET /api/v1/user/doctors
  GET /api/v1/user/admin/me
  GET /api/v1/user/patient/me
  GET /api/v1/user/admin/logout
  GET /api/v1/user/patient/logout
  POST /api/v1/user/doctor/addnew
```

#### Appointment

```http
  POST /api/v1/appointment/post
  GET /api/v1/appointment/getall
  PUT /api/v1/appointment/update/:id
  DELETE /api/v1/appointment/delete/:id
```
#### Message

```http
  GET /api/v1/message/getall/send
  POST /api/v1/message/send
```



## 📦 Dockerized Setup

MedHaven is fully containerized using Docker and Docker Compose, enabling consistent development and deployment environments.

### 🐳 Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed
- [Docker Compose](https://docs.docker.com/compose/) installed

---

### 🔧 Running the Project with Docker

**Clone the repository:**

```bash
git clone https://github.com/diveshsaini1991/Med-Haven.git
cd Med-Haven
```

**Start all services using Docker Compose:**

```bash
docker-compose up --build
```
This command builds and runs:

- MongoDB
- Backend API (Node.js + Express)
- Frontend (React)
- Admin Dashboard
- Doctor Dashboard

**🌐 Access Locally**

| Service          | URL                                            |
| ---------------- | ---------------------------------------------- |
| Frontend (User)  | [http://localhost:5173](http://localhost:5173) |
| Admin Dashboard  | [http://localhost:5174](http://localhost:5174) |
| Doctor Dashboard | [http://localhost:5175](http://localhost:5175) |
| Backend API      | [http://localhost:4000](http://localhost:4000) |
| MongoDB          | Runs on port `27017`                           |

**⚙️ Environments & Configuration**

- Each service has its own Docker image.

- Environment variables for the backend are defined inside docker-compose.yml .

- Volumes are used to persist MongoDB data and sync local code for development.


**🛑 Stopping All Services**

```bash
docker-compose down
```


## Run Locally without docker

Clone the project

```bash
  git clone https://github.com/diveshsaini1991/Med-Haven.git
```
Go to the backend directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

create **config.env file** in a folder named "config" using **```config.env.example```**

Start the server

```bash
  npm run dev
```

Go to the frontend directory using Other Terminal

```bash
  cd ./frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


Go to the Dashboard directory using Other Terminal

```bash
  cd ./dashboard
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Demo

frontend link - https://med-haven-frontend.vercel.app


docter dashBoard link - https://med-haven-doc-dashboad.vercel.app

email to use as docter - meera@gmail.com

password - 123456


admin dashBoard link - https://med-haven-admin-dashboard.vercel.app

email to use as admin - admin@gmail.com

password - 123456



# Contributing to the MedHaven 🤝

We welcome and appreciate contributions from the community to enhance and improve the MedHaven . Whether you're a developer, designer, tester, or someone with valuable feedback, your input is valuable.
## Thank You!❤️

Thank you for considering contributing to the MedHaven. Your efforts help make this project better for everyone. If you have any questions or need assistance, feel free to reach out through the issue tracker or discussions. Happy coding🤩!
