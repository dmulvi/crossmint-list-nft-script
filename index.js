const fetch = require('node-fetch');
const fs = require('fs');
const json2csv = require('json2csv').parse;
require('dotenv').config();

const options = {
  method: 'GET',
  headers: {
    'x-client-secret': process.env.CLIENT_SECRET,
    'x-project-id': process.env.PROJECT_ID
  }
};

const collectionId = process.env.COLLECTION_ID;

let page = 49; //starting from page 1 
let data = [];

async function getData() {
  const url = `https://www.crossmint.com/api/2022-06-09/collections/${collectionId}/nfts?page=${page}&perPage=100`;

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    if (response.ok && json.length > 0) { //if the request was successful and there's data
      console.log("Fetched data from page", page);
      data = [...data, ...json]; //add data to existing data
      page++;
      getData(); //recursively get next page data
    } else {
      console.log(JSON.stringify(json)); // log error
      console.log('Writing data to CSV...')
      createCSV(data);
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

function createCSV(jsonData) {
  const csv = json2csv(jsonData, { fields: ["id", "metadata", "onChain"] });
  fs.writeFile('data.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
}

getData();
