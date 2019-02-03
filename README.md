# Burst-MemPool-Monitor
Explore unconfirmed transaction on the Burst blockchain.

It's not pretty but it works. No guarentees I will keep working on it, but pull requests or issues are welcome.

## How to use

1. Have a node you are able to use for API calls.
	1. You will need to set `API.CrossOriginFilter` to `on` in `brs.properties`.
	2. The default is set to use `localhost:8125`. If you are not using a local node or are using a different port, you need to adjust this setting in `extract.js`.
2. Download the master directory.
3. Make sure the node you are using is running and the database is up to date 
4. Open `index.html`

## Things to fix

* Currently not using async requests.
* CSS is far from complete.
* Some text is not very user friendly.
