const express = require('express');
const cors = require('cors');;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', require('./Router/Router'));

app.listen(8080, () => {
    console.log("server is running at port 8080");
});