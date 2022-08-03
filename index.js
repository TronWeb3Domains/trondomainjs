const TronWeb = require('tronweb');

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

const defaultKeys = ["avatar","cover","website","email","social:twitter","social:facebook","social:telegram","social:discord","social:instagram"];

var exports=module.exports={};

exports.SDK = async function(options) {
	
	var _config = config;
	if (options){
		_config  = options;
	}
	
	var rpcUrl = config.mainnet.rpcUrl;
	var contractAddress = config.mainnet.contractAddress;
	var apiKey = config.mainnet.apiKey;
	
	if (_config.defaultNetwork == 'testnet'){
		rpcUrl = _config.testnet.rpcUrl;
		contractAddress = _config.testnet.contractAddress;
		if (typeof contractAddress == 'undefined'){
			contractAddress = _config.testnet.contactAddress;
		}
	}
	if (_config.defaultNetwork == 'mainnet'){
		rpcUrl = _config.mainnet.rpcUrl;
		contractAddress = _config.mainnet.contractAddress;
		if (typeof contractAddress == 'undefined'){
			contractAddress = _config.mainnet.contactAddress;
		}
		apiKey = config.mainnet.apiKey;
	}

	const tronWeb = new TronWeb({
		fullHost: rpcUrl,
		headers: { "TRON-PRO-API-KEY": apiKey },
		privateKey: ''
	});
	
	tronWeb.setAddress('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t');
	
	const contractFirst = await tronWeb.contract().at(contractAddress);
	
	const func = new Object();
	
	func.balanceOf = async (address) => 
	{
		const balance = await contractFirst.balanceOf(address).call();
		return balance.toString();
	}
	
	
	func.getOwner = async (domain, metadata = false) => 
	{
		const ownerAddress = await contractFirst.getOwner(domain).call();
		const obj = new Object();
		obj.owner = tronWeb.address.fromHex(ownerAddress);
		obj.hex = ownerAddress;
		var arg = [];
		if (metadata == true){
			const tokenId = await contractFirst.genTokenId(domain).call();
			const values = await contractFirst.getMany(defaultKeys, tokenId).call();

			for (let i = 0; i < defaultKeys.length; ++i) {
				const _obj = new Object();
				_obj.key = defaultKeys[i];
				_obj.value = values[i];
				arg.push(_obj)
			}
		}
		obj.metadata = arg;
		return obj;
	}
	
	func.getDomain = async (_address) => 
	{
		try{
			const defaultDomain = await contractFirst.reverseOf(_address).call();
			return defaultDomain
		}catch{}
		return "";
	}
  
    func.getDomains = async (address) => 
	{
		const domains = [];
		try{
			const balance = await contractFirst.balanceOf(address).call();
			for (i = 0; i < balance; i++) 
			{
				const tokenId = await contractFirst.tokenOfOwnerByIndex(address, i).call();
				try{
					const domain = await contractFirst._tokenURIs(tokenId).call();
					domains.push(domain);
				}catch{}
			};
		}catch{}
		return domains;
	}
	
	func.getMetadata = async (key, domain) => 
	{
		const tokenId = await contractFirst.genTokenId(domain).call();
		var value = await contractFirst.get(key, tokenId).call();
		var obj = new Object();
		obj.key = key
		obj.value = value
		return obj;
	}
	
	func.getMetadatas = async (keys, domain) => 
	{
		const tokenId = await contractFirst.genTokenId(domain).call();
		const values = await contractFirst.getMany(keys, tokenId).call();
		var arg = [];
		for (let i = 0; i < keys.length; ++i) {
			var obj = new Object();
			obj.key = keys[i];
			obj.value = values[i];
			arg.push(obj)
		}
		return arg;
	}
	
	func.hashname = async (domain) => 
	{
		const hash = await contractFirst.genTokenId(domain).call();
		return hash;
	}
	
	return func;	
}


