const express = require('express');
const app = express();
const connectDB = require('./config/db')
const productRoute = require('./routes/product.route')
const categoryRoute = require('./routes/category.route')
const authRoute = require('./routes/auth.routes')
const roleRoute = require('./routes/role.routes')
const orderRoute = require('./routes/order.routes')
const userRoute = require('./routes/user.routes')
const cartRoute = require('./routes/cart.routes')


const cors = require("cors");
app.use(express.json({ limit: "50mb" }));
app.use(cors()); // 🔥 thêm dòng này
connectDB()
app.get('/', async (req, res) => {
    try {
        res.send({ message: 'Welcome to Practical Exam!' });
    } catch (error) {
        res.send({ error: error.message });
    }
});
app.use('/', authRoute)
app.use('/products', productRoute)
app.use('/categories', categoryRoute)
app.use('/roles', roleRoute)
app.use('/orders', orderRoute)
app.use('/users', userRoute)
app.use('/carts', cartRoute)

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));