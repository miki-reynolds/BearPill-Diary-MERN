import express from 'express';
// import userRoutes from './routes/userRoutes.mjs';
// import authRoutes from './routes/authRoutes.mjs';
import contactRoutes from './routes/contactRoutes.mjs';
import medicationRoutes from './routes/medicationRoutes.mjs';
import measurementRoutes from './routes/measurementRoutes.mjs';
import allergyRoutes from './routes/allergyRoutes.mjs';
import moodRoutes from './routes/moodRoutes.mjs';
import * as middleware from './middleware/middleware.mjs';


const app = express();
// app.use(cors())
// app.use(express.static('build'))
app.use(express.json()); // REST needs JSON MIME type.
app.use(middleware.requestLogger)

// app.use('/users', userRoutes);
// app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/medications', medicationRoutes);
app.use('/measurements', measurementRoutes);
app.use('/allergies', allergyRoutes);
app.use('/moods', moodRoutes);

// Errors-handling
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


export default app;