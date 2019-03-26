const app = require("./app");
require('dotenv').config();
const port = process.env.PORT || 5000;

app.listen(port, (err) => {
    if (err) {
        console.log(`Server is not listening on port : ${port}`);
        pool.end();
    } else {
        console.log(`Server is listening on port : ${port}`);
    }
});