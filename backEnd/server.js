const express = require('express');
const app = express();
const connectDB = require('./config/db')
const productRoute = require('./routes/product.route')
const categoryRoute = require('./routes/category.route')
const userRoute = require('./routes/auth.routes')
const roleRoute = require('./routes/role.routes')
const orderRoute = require('./routes/order.routes')


const cors = require("cors");
app.use(express.json());
app.use(cors()); // 🔥 thêm dòng này
connectDB()
app.get('/', async (req, res) => {
    try {
        res.send({ message: 'Welcome to Practical Exam!' });
    } catch (error) {
        res.send({ error: error.message });
    }
});
app.use('/', userRoute)
app.use('/products', productRoute)
app.use('/categories', categoryRoute)
app.use('/roles', roleRoute)
app.use('/orders', orderRoute)


const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));