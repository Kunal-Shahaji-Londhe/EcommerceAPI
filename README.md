# EcommerceAPI 🌐💼

Welcome to EcommerceAPI – Your All-in-One Backend Solution for E-commerce Operations!

## Overview 🚀

EcommerceAPI is a robust Node.js Express application with MongoDB as the database, providing a comprehensive set of routes for managing products, orders, and users in your e-commerce platform. This API facilitates seamless integration and efficient handling of essential operations.

## Routes 🛣️

### Products

- **GET /api/v1/products**
- **GET /api/v1/products/:id**
- **POST /api/v1/products**
- **PUT /api/v1/products/:id**
- **DELETE /api/v1/products/:id**
- **PUT /api/v1/products/gallery-images/:id**
- **GET /api/v1/products/get/featured/:count**
- **GET /api/v1/products/get/count**

### Orders

- **GET /api/v1/orders**
- **GET /api/v1/orders/:id**
- **POST /api/v1/orders**
- **PUT /api/v1/orders/:id**
- **DELETE /api/v1/orders/:id**
- **GET /api/v1/orders/get/count**

### Users

- **GET /api/v1/users**
- **GET /api/v1/users/:id**
- **POST /api/v1/users**
- **PUT /api/v1/users/:id**
- **DELETE /api/v1/users/:id**
- **GET /api/v1/users/get/count**

### User Authentication

- **POST /api/v1/users/register**
- **POST /api/v1/users/login**

## Getting Started 🚀

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/EcommerceAPI.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd EcommerceAPI
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Set up your MongoDB connection:**
   - Update the MongoDB connection details in the `.env` file.

5. **Run the application:**

    ```bash
    npm start
    ```

    The API will be accessible at [http://localhost:3000](http://localhost:3000).

## Documentation 📚

For detailed documentation on each route and its usage, refer to the API documentation included in the `docs` directory.

## Contributing 🤝

Contributions are welcome! Feel free to open issues or pull requests to enhance the functionality of the API.
