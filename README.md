Clone this repo and install dependencies
```
git clone git@github.com:dmulvi/crossmint-list-nft-script.git
cd crossmint-list-nft-script
yarn install
```

Create a .env file and save the following into it: 

```
CLIENT_SECRET=
PROJECT_ID=
COLLECTION_ID=
```

create an empty `data.csv` file in the root of your project

run standard with 
```
node index.js
```

formatted output (id, owner, txId, tokenId)
```
node formatted.js
```