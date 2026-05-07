const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const os = require('os'); // Only needed to find network interfaces

const app = express();

const PORT = 5000;

app.use(express.json());
app.use(cors());

// 1. Mongoose Connection
// Replace the URI with your MongoDB Atlas string
const mongoURI = 'mongodb://todayshelperbot:Brant2027idk123@ac-zocmivr-shard-00-00.wdy3hnt.mongodb.net:27017,ac-zocmivr-shard-00-01.wdy3hnt.mongodb.net:27017,ac-zocmivr-shard-00-02.wdy3hnt.mongodb.net:27017/?ssl=true&replicaSet=atlas-ipl2is-shard-0&authSource=admin&appName=Cluster0/classVaultDB'; 
mongoose.connect(mongoURI)  
    .then(() => console.log('✅ Connected to MongoDB: ClassVault'))
    .catch(err => console.error('❌ Connection error:', err));

// 2. Schema & Model
const classesSchema = new mongoose.Schema({
    class_name: String,
    teacher: String,
    subject: String,
    classroom: String,
    classid: String,
    description: String
});
const Class = mongoose.model('Class', classesSchema);
// 3. RESTful API Routes
app.get('/api/classes', async (req, res) => {
    //const classes = await Class.find();
   // res.json(classes);
    console.log('Fetched all classes');
    try {
        const classes = await Class.find();
        res.json(classes);
        console.log('Fetched all classes');
    } catch (err) {
        console.error('Error fetching classes:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/classes', async (req, res) => {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
    console.log('New class created:', newClass);
});

app.put('/api/classes/:id', async (req, res) => {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClass);
    console.log('Class updated:', updatedClass);
});

app.delete('/api/classes/:id', async (req, res) => {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted successfully" });
    console.log('Class deleted');
});

// 4. Start Server and Display Network Addresses
app.listen(PORT, () => {
    // Get the local IP address (IPv4)
    const networkInterfaces = os.networkInterfaces();
    let lanIp = 'Not found';

    for (const interfaceName in networkInterfaces) {
        for (const iface of networkInterfaces[interfaceName]) {
            // Filter for IPv4 and skip internal (127.0.0.1) addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                lanIp = iface.address;
            }
        }
    }

    console.log(`
Backend API server is running!
---------------------------------------------
Local:   http://localhost:${PORT}/api/classes
Network: http://${lanIp}:${PORT}/api/classes
---------------------------------------------
    `);
});