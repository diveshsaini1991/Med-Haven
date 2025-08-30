<div align="center">

# MED-HAVEN

Transforming Healthcare, Empowering Lives Daily

![last commit](https://img.shields.io/badge/last_commit-august-blue)
![javascript](https://img.shields.io/badge/javascript-93.7%25-yellow)
![languages](https://img.shields.io/badge/languages-3-blue)

_Built with the tools and technologies:_

![Express](https://img.shields.io/badge/Express-black?logo=express&logoColor=white&style=flat)
![JSON](https://img.shields.io/badge/JSON-black?logo=json&logoColor=white&style=flat)
![Markdown](https://img.shields.io/badge/Markdown-black?logo=markdown&logoColor=white&style=flat)
![Socket.io](https://img.shields.io/badge/Socket.io-black?logo=socketdotio&logoColor=white&style=flat)
![npm](https://img.shields.io/badge/npm-red?logo=npm&logoColor=white&style=flat)
![Mongoose](https://img.shields.io/badge/Mongoose-red?logo=mongoose&logoColor=white&style=flat)
![.ENV](https://img.shields.io/badge/.ENV-yellow?logo=dotenv&logoColor=black&style=flat)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow?logo=javascript&logoColor=black&style=flat)
![MongoDB](https://img.shields.io/badge/MongoDB-green?logo=mongodb&logoColor=white&style=flat)
![React](https://img.shields.io/badge/React-blue?logo=react&logoColor=white&style=flat)
![Docker](https://img.shields.io/badge/Docker-blue?logo=docker&logoColor=white&style=flat)
![Cloudinary](https://img.shields.io/badge/Cloudinary-blueviolet?logo=cloudinary&logoColor=white&style=flat)
![Vite](https://img.shields.io/badge/Vite-blueviolet?logo=vite&logoColor=white&style=flat)
![ESLint](https://img.shields.io/badge/ESLint-blueviolet?logo=eslint&logoColor=white&style=flat)
![Axios](https://img.shields.io/badge/Axios-blueviolet?logo=axios&logoColor=white&style=flat)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Features](#features)
- [Technical Details](#technical-details)
- [API Endpoints](#api-endpoints)
- [Dockerized Setup](#dockerized-setup)
- [Run Locally without Docker](#run-locally-without-docker)
- [Demo](#demo)
- [Contributing](#contributing-to-the-medhaven)
- [Thank You](#thank-you)

---

## Overview

MedHaven is a hospital management system built on the MERN stack, enabling operations like patient registration, appointment scheduling, medical records management, and real-time doctor-patient chat.

## Getting Started

To get started, clone the repo and follow the instructions for either Dockerized deployment or local setup below.

## Features

- **Real-time chat** between doctors and patients with chatroom and profile views.
- **Responsive UI** supporting both desktop and mobile devices.
- Doctor profiles with detailed info and **interactive animations**.
- Comprehensive appointment management: scheduling, editing, and deletion.
- **Secure authentication** with JWT and bcrypt hashing.
- **OTP email verification** for enhanced security.
- **API rate limiting** for performance and reliability.
- Fully containerized backend and frontend using Docker.
- Automated deployment and hosting on Vercel and Render.

## Technical Details

- **Frontend:** React, Tailwind CSS, GSAP animations
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Real-time:** Socket.io
- **Authentication:** JWT, bcrypt
- **Email Service:** Nodemailer (OTP verification)
- **Containerization:** Docker & Docker Compose
- **Deployment:** Vercel, Render
- **Testing:** APIs tested using Postman

## API Endpoints 

#### User 

```http
  POST /api/v1/user/patient/register            # Patient registration
  POST /api/v1/user/login                       # User login (all roles)
  POST /api/v1/user/admin/addnew                # Add new admin (Admin only)
  POST /api/v1/user/doctor/addnew                # Add new doctor (Admin only)
  POST /api/v1/user/patient/verify-otp          # Verify OTP for patient registration
  POST /api/v1/user/patient/resend-otp           # Resend OTP to patient

  GET /api/v1/user/doctors                      # Get list of all doctors (Public)
  GET /api/v1/user/admin/me                      # Get logged-in admin details (Admin only)
  GET /api/v1/user/doctor/me                      # Get logged-in doctor details (Doctor only)
  GET /api/v1/user/patient/me                     # Get logged-in patient details (Patient only)

  GET /api/v1/user/admin/logout                   # Admin logout (Admin only)
  GET /api/v1/user/doctor/logout                  # Doctor logout (Doctor only)
  GET /api/v1/user/patient/logout                 # Patient logout (Patient only)

```

#### Appointment

```http
  POST /api/v1/appointment/post                   # Create a new appointment (Patient only)
  GET /api/v1/appointment/getall                   # Get all appointments (Admin only)
  GET /api/v1/appointment/get                      # Get appointments of logged-in doctor (Doctor only)

  PUT /api/v1/appointment/update/:id               # Update appointment status (Admin only)
  DELETE /api/v1/appointment/delete/:id            # Delete appointment (Admin only)

  PUT /api/v1/appointment/doctor/update/:id        # Update appointment status (Doctor only)
  DELETE /api/v1/appointment/doctor/delete/:id     # Delete appointment (Doctor only)

  GET /api/v1/appointment/myappointments            # Get appointments of logged-in patient (Patient only)
  PUT /api/v1/appointment/patient/update/:id        # Update patient appointment details (Patient only)

```
#### Chat
```http
  POST /api/v1/chat/createRoom                      # Create a chat room (Patient only)
  POST /api/v1/chat/send                            # Send a message (Patient or Doctor)
  PUT /api/v1/chat/edit/:id                         # Edit a chat message (Patient only)

  GET /api/v1/chat/room/:chatRoomId                 # Get messages by chat room (Patient only)
  PUT /api/v1/chat/read/:id                          # Mark chat message as read (Patient only)
  GET /api/v1/chat/unread/:userId                    # Get unread chat count/messages (Patient only)

  GET /api/v1/chat/patientlist                       # Get patient list for doctor (Doctor only)


```

#### Message

```http
  POST /api/v1/message/send                         # Send a message (no auth specified)
  GET /api/v1/message/getall/send                   # Get all messages sent (Admin only)
  GET /api/v1/message/get                           # Get messages of logged-in doctor (Doctor only)

```




## Dockerized Setup

MedHaven is fully containerized using Docker and Docker Compose, enabling consistent development and deployment environments.

### Prerequisites
- Docker installed
- Docker Compose installed

---

### Running the Project with Docker

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



## Contributing to the MedHaven 

We welcome and appreciate contributions from the community to enhance and improve MedHaven. Whether you're a developer, designer, tester, or someone with valuable feedback, your input is valuable.

---

## Thank You

Thank you for considering contributing to MedHaven. Your efforts help make this project better for everyone. If you have any questions or need assistance, feel free to reach out through the issue tracker or discussions. Happy coding!
