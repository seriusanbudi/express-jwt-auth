# Setting Up and Testing Express.js JWT Authentication API

Follow these steps to set up and test a simple Express.js JWT authentication API.

## Step 1: Install Dependencies

Open your terminal and run the following command to install the required dependencies using Yarn:

`yarn install`

## Step 2: Setup ENV

Copy the `.env.example` file to `.env`. You can change the value under `JWT_SECRET`

## Step 3: Start the Development Server

Start the development server by running the following command:

`yarn dev`

## Step 4: Authenticate with the API

Hit the `/auth/sign-in` endpoint using your preferred tool (e.g., Postman or curl) with an available user from the `db.js` file. This API call will provide you with a JWT token. Replace `<email>` and `<password>` with the actual email and password of the user from the `db.js` file:

POST http://localhost:3000/auth/sign-in<br/>
Body:

```javascript
{
  "email": "<email>",
  "password": "<password>"
}
```

This will return a JWT token in the response.

## Step 5: Test the Token

Now, you can test if the JWT token is working by making an authenticated request to the `/me` endpoint. Set the JWT token as the Authorization header in the request. Replace `<your_token>` with the JWT token obtained in Step 3:

GET http://localhost:3000/me<br/>
Headers:<br/>

```javascript
Authorization: Bearer <your_token>
```

If the token is valid, you should receive a response with the user's information. If it's invalid, you will get an authentication error.
