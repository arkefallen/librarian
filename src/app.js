const express = require('express');
const app = express();
const port = 9000;



app.get('/', (request, response) => {
    response.send('Hello World');
});

app.listen(port, () => {
    if (process.env.npm_lifecycle_event === 'start-dev') {
        console.log(`App succesfully run on port ${port}`);
    }
})