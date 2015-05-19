//This document handles DB transactions
//data is saved, updated and mapped to make it searchable.
//DB used is Pouch DB (pouchdb.com)


//NEW DB
var db = PouchDB('PIM_Storage');

//CONSOLE INFO ON WEB-ADAPTER
console.info('web-adapter: ' + db.adapter);



//--------------------------//
//		ADD DATA TO DB 		//
//--------------------------//

//ADD CATALOGS to POUCH DB
//Retrieves data from the 'getCatalogs' -function, 
//creates a new object with
//'NodeType' -attribute, and saves object to database.
function addCatalogs(isCatalog) {

	//DEFINE OBJECT INJECTED TO DB
	var catalog = {
		_id: 		isCatalog.NodeId,
		catId: 		isCatalog.CatalogId,
		nodeName: 	isCatalog.CatalogName,
		NodeType: 	'CATALOG'
	};

	//INSERT CATALOG OBJECT INTO DB
	db.put(catalog, function callback(err, result) {
		if(!err) { console.info('successfully saved new DB Catalog entry: ' + isCatalog.NodeName); }
	});
}

//ADD NODES TO POUCH DB
//Retrieves data object from the 'getNodes' -function
//and saves the object to database.
function addNode(isNode) {

	//CHECK IF NODE IS SECTION OR PRODUCT
	//IF PRODUCT, APPLY PRODUCT ID
	var prodID = ' ';
	if (isNode.NodeType === 'PRODUCT') {
		prodID = isNode.ProductId;
	};

	//DEFINE OBJECT INJECTED TO DB
	var node = {
		_id: 		isNode.NodeId,
		nodeName: 	isNode.NodeName,
		parentId: 	isNode.ParentNodeId,
		sortNr: 	isNode.SortNo,
		productId: 	prodID,
		NodeType: 	isNode.NodeType
	};

	//INSERT NODE OBJECT INTO DB
	db.put(node, function callback(err, result) {
		if(!err) { console.info('successfully saved new DB Node entry: ' + isNode.NodeName); }
	});
}

//ADD PRODUCT INFO TO POUCH DB
//Retrieves data object from the 'getProductInfo' -function
//and saves tje object to database
function addProduct(isProduct) {

	//DEFINE OBJECT INJECTED TO DB
	var product = {
		_id: 			isProduct.ProductId,
		productName: 	isProduct.ProductName,
		productNr: 		isProduct.ProductNo,
		productGroup: 	isProduct.ProductGroup,
		description: 	isProduct.ProductText,
		color: 			isProduct.Color,
		size: 			isProduct.Size,
		price: 			isProduct.Price
	};

	//INSERT PRODUCT INFORMATION OBJECT INTO DB
	db.put(product, function callback(err, result) {
		if(!err) { console.info('successfully saved new product info entry: ' + isProduct.ProductName); }
	});
}




//--------------------------//
//		CREATE INDEXES 		//
//--------------------------//

//CREATE INDEX OVER NODE NAMES
//used mainly to sort search results
db.createIndex({
	index: { 
		fields: ['nodeName'],
		name: 'nameIndex' 
	}
});

//CREATE INDEX OVER NODE TYPES
db.createIndex({
	index: {
		fields: ['NodeType'],
		name: 'nodeTypeIndex'
	}
});

//CREATE INDEX OVER PARENT ID
db.createIndex({
	index: {
		fields: ['parentId'],
		name: 'parentIdIndex'
	}
});

//CREATE INDEX OVER OBJECT ID
db.createIndex({
	index: {
		fields: ['_id']
	}
});

//CREATE INDEX OVER PRODUCT NAME
db.createIndex({
	index: {
		fields: ['productName'],
		name: 'productIndex'
	}
});


//--------------------------//
//		SEARCH DB 	 		//
//--------------------------//

//SEARCH DB FOR CATALOG LISTINGS
function searchDB_forCatalogs() {
	return db.find({
		selector: {
			NodeType: {$eq: 'CATALOG'},
			nodeName: {$exists: true} 
		},
		sort: ['nodeName']
	});
}

//SEARCH DB FOR SECTIONS BY NODE ID
function searchDB_forSections(id) {
	return db.find({
		selector: { 
			NodeType: {$eq: 'SECTION'}, 
			parentId: {$eq: id},
			nodeName: {$exists: true}
		},
		sort: ['nodeName']
	});
}

//SEARCH DB FOR PRODUCT NODES BY NODE ID
function searchDB_forProducts(id) {
	return db.find({
		selector: {
			NodeType: {$eq: 'PRODUCT'},
			parentId: {$eq: id},
			nodeName: {$exists: true}
		},
		sort: ['nodeName']
	});
}

//SEARCH DB FOR DOCUMENTS WITH SPECIFIC ID
function searchDB_byId(id) {
	return db.find({
		selector: { _id: {$eq: id} }
	});
}

//SEARCH FOR ANYTHING
function searchDB_all(string) {
	var results;


}




//--------------------------//
//		CONSOLE LOG 		//
//--------------------------//

//console.log basic DB info
db.info().then(function(info) {
  console.log(info);
});

//console.log indexes
db.getIndexes().then(function(result) {
  console.log(result);

 //error getting indexes
}).catch(function(err) {
  console.log(err);
});






