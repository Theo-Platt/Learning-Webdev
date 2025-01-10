// Load express module using `require` directive 
let express = require('express')
let app = express() 
app.use(express.json());

var MongoClient = require('mongodb').MongoClient;
const mongo_uname = encodeURIComponent('root');
const mongo_pword = encodeURIComponent('root');
const clusterURI  = 'mongo:27017';
const mongo_auth  = 'DEFAULT';

const mongo_uri   = `mongodb://${mongo_uname}:${mongo_pword}@${clusterURI}/?authMechanism=${mongo_auth}`;
const client      = new MongoClient(mongo_uri);

async function getRandomDocument(col){
  try {
    await client.connect();
    const db = client.db('Helldive');
    const collection = db.collection(col);

    // Use the $sample stage in the aggregation pipeline
    const result = await collection.aggregate([
      { $sample: { size: 1 } }
    ]).toArray();

    return result[0]; // Return the first (and only) document

  } finally {
    await client.close();
  }
}

async function getSources(col){
  
}


  
// Define request response in root URL (/) 
app.get('/', function (req, res) { 
  
  console.log('basic / handler');
  res.status(200).send('hello world') 
  
}) 

app.get('/filters', async function (req, res) { 
  try {
    console.log('Recieved /filters request')
    await client.connect();
    const db = client.db('Helldive');
    const collection = db.collection('Sources');

    const result = await collection.find({}).toArray();
    
    const document = JSON.stringify(result.map(({ _id, ...rest }) => rest))

    res.status(200).send(document) 

  } catch(err){
    console.error('Error:', err);
  } finally {
    await client.close();
  }


  // getRandomDocument('Equipment').then(document => {
  //   console.log('Random Document:', document);
  //   res.status(200).send(document) 
  // }).catch(err => {
  //   console.error('Error:', err);
  // });  
}) 

app.post('/select',async function (req,res){
  try{
    const item = req.body.select
    const filters = req.body.filters

    console.log(`Recieved /select request for '${item}' using filters:[${filters}]`)

    await client.connect();
    const db = client.db('Helldive');
    const collection = db.collection('Equipment');

    const result = await collection.aggregate([{
      $match: {
        Class: item,
        Source: {$in: filters}
      }
    }]);

    const result2 = await result.toArray();
    const index = Math.floor(Math.random() * result2.length);
    const randomElement = result2[index];
    
    // console.log(result2)
    console.log(randomElement)
    res.status(200).send(randomElement)

  } catch(error){
    console.error(error)
  } finally {
    await client.close();
  }
})

// Launch listening server on port 3000
app.listen(3000, function () { 
  console.log('app listening on port 3000') 
})

