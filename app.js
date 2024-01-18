const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const Product = require('./models/product')
const productsRoutes = require('./routers/products')
const categoriesRoutes = require('./routes/categories')
const usersRoutes = require('./routes/users')
const ordersRoutes = require('./routes/orders')

require('dotenv/config')
const api = process.env.API_URL

app.use(cors())
app.options('*',cors())

//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))


//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);


//mongodb connect
mongoose.connect('mongodb+srv://toy-store-user:iam277353@cluster0.hodxf.mongodb.net/toy-store-database')
.then(()=>{
    console.log('database connection is ready...')
})
.catch((err)=>{
    console.log(err)
})


app.listen(port, () => {
    console.log(api)
    console.log(`server running on http://localhost:${port}` )
})