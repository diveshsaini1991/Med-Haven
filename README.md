
# MedHaven - Care Network 🏥️

MedHaven - Care Network is a comprehensive Hospital Management System built using the MERN (MongoDB, Express, React, Node.js) stack. The system is designed to manage hospital operations, including patient registration, appointment scheduling, medical records, and Listing Doctors.





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



## Run Locally

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

create **.env file** in a folder named "config" following next section

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


## Environment Variables

create **.env** file in **backend** directory only

```dotenv
PORT = 4000

MONGO_URI = YOUR_MONGO_URL

FRONTEND_URL = http://localhost:5173

DASHBOAD_URL = http://localhost:5174

JWT_SECRET_KEY = YOUR_JWT_SECRET_KEY

JWT_EXPIRES = 7d

COOKIE_EXPIRE = 7

CLOUDINARY_CLOUD_NAME = YOUR_CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_SECRET = YOUR_CLOUDINARY_API_SECRET

CLOUDINARY_API_KEY = YOUR_CLOUDINARY_API_KEY
```


## Demo

frontend link - https://med-haven-frontend.vercel.app

docter dashBoard link - https://med-haven-doc-dashboad.vercel.app

admin dashBoard link - https://med-haven-admin-dashboard.vercel.app



# Contributing to the MedHaven 🤝

We welcome and appreciate contributions from the community to enhance and improve the MedHaven . Whether you're a developer, designer, tester, or someone with valuable feedback, your input is valuable.
## Thank You!❤️

Thank you for considering contributing to the MedHaven. Your efforts help make this project better for everyone. If you have any questions or need assistance, feel free to reach out through the issue tracker or discussions. Happy coding🤩!
