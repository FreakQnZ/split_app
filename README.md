This is a Ready Made Authentication module built in [Next.js](https://nextjs.org/)

## Project Speicifcations

Authentication details

- [JWT-TOKEN] - Uses JWT to store and authenticate login information
- [JWT-Expose-Protection] - Safeguarding from exposed JWT by storing token version after password change
- [BCRYPT] - Uses bcrypt to hash the password before storing in database
- [Login] - Uses Username and passwords for login with 2 forms of error handling, Wrong Password and User not existing
- [Signup] - Uses email, username, password, and confirm password with normal REGEX checks and error handling for type of data
- [Forgot-Password] - Forgot Password Input available with event empty to be filled by user according to specifications
- [Database] - Uses Vercel Database (Postgres)
- [Dependencies] - Tailwind CSS, DaisyUI, Bcrypt, Jsonwebtoken, Pg

.env Specifications

```bash
POSTGRES_URL="postgres:XXXXXXX"
JWT_SECRET="XXXXXX"
```

## Getting Started
First, clone the project

```bash
git clone https://github.com/FreakQnZ/Auth-Next.js.git
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
