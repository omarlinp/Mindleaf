import express from 'express';
import path from 'path';
import { fileURLToPath} from 'url';
import Router from './src/routes/index.js';


//server configuration 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';


const app = express();

app.get('/',(req,res)=>{
    res.send('hello world')
});
app.set('view engine' , 'ejs');

app.set('views' , path.join(__dirname,'src/views'));


// Start the server and listen to the PORT
app.listen(PORT, () =>{
    console.log(`Server is running and on http://127.0.0.1:${PORT}`);
});