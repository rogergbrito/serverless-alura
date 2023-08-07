const { MongoClient, ObjectId } = require('mongodb');

let connectionInstance = null;
async function connectToDatabase() {
  if (connectionInstance) return connectionInstance; // se a instancia ja foi criada, não precisamos fazer a conexão duas vezes

  const client = new MongoClient(process.env.MONGODB_CONNECTIONSTRING); // busca o environment do serverless.yml
  const connection = await client.connect();

  connectionInstance = connection.db(process.env.MONGODB_DB_NAME);
  return connectionInstance;
};

async function getUserByCredentials(username, password) {
  const client = await connectToDatabase();
  const collection = await client.collection('users');
  const user = await collection.findOne({
    name: username,
    password: password
  })

  if (!user) return null;
  return user;
};

async function saveResultsToDatabase(result) {
  const client = await connectToDatabase();
  const collection = await client.collection('results'); // usa a collection 'results'
  const { insertedId } = await collection.insertOne(result);
  return insertedId;
};

async function getResultById(id) {
  const client = await connectToDatabase();
  const collection = await client.collection('results');

  const result = await collection.findOne({
    _id: new ObjectId(id),
  });

  if (!result) return null;
  return result;
}

module.exports = {
  getUserByCredentials,
  saveResultsToDatabase,
  getResultById
};