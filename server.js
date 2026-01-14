const express = require('express');
const studentRoutes = require('./src/presentation/routes/studentRoutes');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use('/api/students', studentRoutes);

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Student Management System running on http://localhost:${PORT}`);
});