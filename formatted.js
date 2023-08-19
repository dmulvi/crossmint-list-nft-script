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
const perPage = 100;

let page = 1; //starting from page 1 
let data = [];

async function getData() {
  const url = `https://www.crossmint.com/api/2022-06-09/collections/${collectionId}/nfts?page=${page}&perPage=${perPage}`;

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    if (response.ok && json.length > 0) { //if the request was successful and there's data
      console.log("Fetched data from page", page);

      let formattedData = formatData(json); // format the data
      data = [...data, ...formattedData]; //add data to existing data
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

function formatData(data) {
  let result = data.map((item) => {
    
    let formattedItem = {
      id: item.id,
      owner: item.onChain.owner,
      txId: item.onChain.txId,
      tokenId: item.onChain.tokenId
    }
    return formattedItem;   
  });

  return result;
}

function createCSV(jsonData) {
  const csv = json2csv(jsonData, { fields: ["id", "owner", "txId", "tokenId"] });
  fs.writeFile('data.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
}

getData();
