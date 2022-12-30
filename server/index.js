const express = require('express');
require('dotenv').config();
const colors = require('colors');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');

connectDB();
const app = express();
app.use('/graphql', graphqlHTTP({
    graphiql: process.env.NODE_ENV === 'development', // graphiql is a tool that allows us to make queries to our graphql server
    schema,
}));   // graphqlHTTP is a middleware function that handles all the requests to the /graphql endpoint

app.listen(port, console.log(`Server running on port ${port}`));