import 'dotenv/config';
import express from 'express';

import cors from 'cors';
import connectDB from './configs/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
   

//App Config
const PORT = process.env.PORT || 4000;
const app = express();
await connectDB();



//Middlewares
app.use(express.json());
app.use(cors());

//App routes
app.get('/', (req, res) => res.send('API working'));
app.use('/api/user', userRouter);
app.use('/api/image',imageRouter)

//Listener
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));