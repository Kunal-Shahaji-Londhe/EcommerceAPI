const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const bodyParser = require('body-parser');
app.use(cors());
app.options('*', cors())

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const reviewsRoutes = require('./routes/reviews')
const analyticsRoutes = require('./routes/analytics');
const discountRoutes = require('./routes/discounts');
const returnOrderRoutes = require('./routes/returnOrders');
const Razorpay = require('razorpay');

const api = process.env.API_URL;
const razorpay_key_id = 'rzp_test_gqIHaDQQDjWl67'
const razorpay_key_secret = 'SUBVqgIoHKWkjif0vzy7iPPH'

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/reviews`, reviewsRoutes);
app.use(`${api}/analytics`, analyticsRoutes);
app.use(`${api}/return`, returnOrderRoutes);
app.use(`${api}/discounts`, discountRoutes);




// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: razorpay_key_id,
    key_secret: razorpay_key_secret
});

app.use(bodyParser.json());

// ...

app.post('/process_payment', async (req, res) => {
    try {
      const { amount } = req.body;
  
      const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: 'INR',
        receipt: `order_rcptid_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      });
  
      res.json({ order_id: order.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

  

//Database
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})



//Server
app.listen(3000, ()=>{

    console.log('server is running http://localhost:3000');
})