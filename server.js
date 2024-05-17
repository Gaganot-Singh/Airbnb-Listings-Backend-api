const express = require('express');
const cors = require('cors');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();


app.use(express.json())
app.use(cors());

require('dotenv').config(); 


// Routes

app.get('/', (req, res) => {
  res.json({message: 'API Listening'});
});


// /api/listings (POST ROUTE)
app.post('/api/listings', async (req, res) => {
    try {
      const newList = await db.addNewListing(req.body);
      res.status(201).json(newList);
    } catch (error) {
      res.status(500).json({error: 'Internal Server Error!!'});
    }
  });
  
  // /api/listings (GET ROUTE)
  app.get('/api/listings', async (req, res) => {
    try {
      const { page, perPage, name } = req.query;
      const allListings = await db.getAllListings(page, perPage, name);
      res.status(200).json(allListings);
    } catch (error) {
      res.status(500).json({error: 'Internal Server Error!!'});
    }
  });
  
  // /api/listings/(_id value) (GET ROUTE WITH ID)
  app.get('/api/listings/:id', async (req, res) => {
    try {
      const list = await db.getListingById(req.params.id);
      if (list) {
        res.status(200).json(list);
      } else {
        res.status(404).json({error: 'Listing not found!!'});
      }
    } catch (error) {
      res.status(500).json({error: 'Internal Server Error!!'});
    }
  });
  
  // /api/listings/(_id value) (PUT ROUTE)
  app.put('/api/listings/:id', async (req, res) => {
    try {
      const updatedListing = await db.updateListingById(req.body, req.params.id);
      if (updatedListing) {
        res.status(200).json(updatedListing);

      } else {
        res.status(404).json({error: 'Listing not found!!'});
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error!!' });
    }
  });
  
  // /api/listings/(_id value) (DELETE ROUTE)
  app.delete('/api/listings/:id', async (req, res) => {
    try {
      const result = await db.deleteListingById(req.params.id);
      if (result) {
        res.status(200).json({message: 'SUCCESS! Listing Deleted successfully'});
      } else {
        res.status(404).json({ error: 'Listing not found!!' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error!!' });
    }
  });


// Resource not found (this should be at the end)
app.use((req, res) => {
    res.status(404).send('Resource not found!!');
  });
  


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`Server listening: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});
