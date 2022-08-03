const domainjs = require('trondomainjs');

// set config
const config = 
{
	testnet:{
		rpcUrl: "",
		contractAddress: "",
		apiKey: ""
	},
	mainnet:{ 
		rpcUrl: "https://api.trongrid.io",
		contractAddress: "TAtgoVq9xqv1C65hjFTerJQZFt4rbAPea6",
		apiKey: "a082b09e-9a96-417d-9508-2868b20cfeda"
	},
	defaultNetwork: "mainnet"
}

async function call(){
	
	// install
	const sdk = await domainjs.SDK(config);

	// change your domains
	const _domain = "domains.trx";
	
	// change your address
	const _address = "TLPXPmboPiLr6Yo6xL3hvhKEbTvsBYnzE5";
	
	// resolve domain to get the address of the owner. metadata: true // false default return metadata along with domain information
	const owner = await sdk.getOwner(_domain, false);

	console.log(owner);

	// get total domains
	const balance = await sdk.balanceOf(_address);

	console.log(balance.toString());

	// get a domain default from a user's address, requiring the user to set the default domain name initially.
	const domain = await sdk.getDomain(_address);

	console.log(domain);
	
	// gets all the domains owned by an wallet address.
	const domains = await sdk.getDomains(_address);

	console.log(domains);
	
	//get a value of metadata from the domain name
	const _avatar = await sdk.getMetadata("avatar", _domain);

	console.log(_avatar);
	
	//get values of metadata from the domain name
	const _values = await sdk.getMetadatas(["avatar", "website", "social:twitter"], _domain);

	console.log(_values);
	
	//namehash is a recursive process that can generate a unique hash for any valid domain name.
	const hashname = await sdk.hashname(_domain);

	console.log(hashname.toString());
}

call();