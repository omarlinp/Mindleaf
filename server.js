import express from 'express';
import dotenv from 'dotenv';

// starting dotenv
dotenv.config();

const app = express();

app.get('/',(req,res)=>{
    res.send('hello world')
});

const PORT = process.env.PORT || 3000;

// Start the server and listen to the PORT
app.listen(PORT, () =>{
    console.log(`Server is running and on http://127.0.0.1:${PORT}`);
});