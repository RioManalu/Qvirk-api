const express = require('express');

const app = express();
const port = 7000;

app.get('/', (req, res) => {
  res.send('hello world');
});


app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});