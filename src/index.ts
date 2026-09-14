import 'dotenv/config'; 
import app from './app'; 

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server Backend berjalan dengan baik di http://localhost:${port}`);
});