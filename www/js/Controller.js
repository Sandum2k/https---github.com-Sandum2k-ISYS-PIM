//--------------------------//
//      DECLARE APP         //
//--------------------------//
var pim = angular.module("PIM", []);
 
 
 
 
//--------------------------//
//      IMPORT CONTROLLER   //
//--------------------------//
//this controller connects with the isys api
//and retrieves objects before passing objects to DBstorage.js -functions
pim.controller('Import', function($scope, $http, $filter) {
    console.info('import controller loaded');
 
    //GET CATALOG INFORMATION FROM API
    //collects catalog data using the 'Catalog/GetAll' api
    //loops through each catalog and passes info to the 'searchForNodes' -function
    
    $scope.connectWithAPI = function() {
        var getCatalogs = $http.get('http://isys-pim-dev.isys.no/ibridge/ws/Catalog/GetAll');
 
        getCatalogs.success(function(data, status, headers, config) {
            $scope.catalogs = data.Catalogs;
 
            //LOOP THROUGH EVERY CATALOG & CATCH DATA
            angular.forEach(data.Catalogs, function(isCatalog) {
 
                //ADD CATALOGS TO POUCH DB
                addCatalogs(isCatalog);
 
                //SEARCH CATALOGS FOR NODES
                searchForNodes(isCatalog);
            });
        });
 
        //ERROR: COULD NOT GET CATALOG INFO FROM API
        getCatalogs.error(function(data, status, headers, config) {
            console.error(status);
        });
    }
 
 
    //GET NODE INFORMATION FROM API
    //Collects node data using the 'CatalogId' from node Object passed from 'getCatalogs' -function
    //This function will run each time 'getCatalogs' -function loops through
    //a new catalog.
    function searchForNodes(isCatalog) {
 
        //CONNECT TO THE iSYS API AND GET NODE STRUCTURE
        var getNodes = $http.get('http://isys-pim-dev.isys.no/ibridge/ws/Catalog/GetStructure?', {
            params: { CATALOG_ID: isCatalog.CatalogId }
        });
 
        //ON SUCCESS: RETRIEVE NODE INFO
        getNodes.success(function(data, status) {
 
            //LOOP THROUGH EVERY NODE
            angular.forEach(data.Nodes, function(isNode) {
 
                //ADD NODES TO POUCH DB
                addNode(isNode);
 
                //SEARCH NODE FOR PRODUCTS
                searchForProducts(isNode);
            }); 
        });
 
        //ERROR: COULD NOT GET NODE INFO FROM API
        getNodes.error(function(data, status) {
            console.error(status);
        });
    }
 
 
    //GET PRODUCT INFORMATION FROM API
    //Collects product information using the 'ProductId' from node Object passed from 'searchForNodes' -function
    //This function is the third and last level of procuring information from iSYS api,
    //the previous being 'searchForNodes' -function.
    function searchForProducts(isNode) {
         
        //IF NODE TYPE IS PRODUCT
        if(isNode.NodeType === 'PRODUCT') {
 
            //CONNECT TO THE iSYS API AND GET PRODUCT INFO BY NODE PRODUCT ID
            var getProductInfo = $http.get('http://isys-pim-dev.isys.no/ibridge/ws/Product/Get?', {
                params: { PRODUCT_ID: isNode.ProductId }
            });
 
            //ON SUCCESS: RETIRIEVE PRODUCT INFO
            getProductInfo.success(function(data, status) {
 
                //LOPP THROUGH EVERY PRODUCT
                angular.forEach(data.Product, function(isProduct){
                     
                    //ADD PRODUCT INFO TO POUCH DB
                    addProduct(isProduct);
                });
            });
 
            //ERROR: COULD NOT GET PRODUCT INFORMATION FROM API
            getProductInfo.error(function(data, status){
                console.error(status);
            });
        }
 
        //IF NODE TYPE IS NOT PRODUCT: RETURN SEARCHING FOR NODES
        else { return; }
    }
});
 
 
 
 
//--------------------------//
//      VIEW CONTROLLER     //
//--------------------------//
//Handles what is shown in the view based on click events.
pim.controller('ViewData', function($scope, $q, $http, $window) {
    console.info('view data controller enabled');
 
    //USED TO DETERMINE ACTIVE VIEW
    //'nav' saves the object of which '_id'
    //is used to search for its children.
    var nav;
    $scope.viewNode;
 
    //'Back' -functionality
    $scope.back = function() {
 
        //IF NAV IS NOT DEFINED: DO NOTHING
        if(!nav) { return; }
 
        //IF NAV OBJECT TYPE IS CATALOG: OPEN CATALOGS
        if(nav.NodeType === 'CATALOG') { openNodeCatalogs(); }
 
        //ELSE OPEN PARENT NODE
        else { $scope.openNode(nav.parentId); }
    }
 
 
    //'Load Catalogs' -functionality
    $scope.openCatalogs = function() {
        console.log("Open catalog");
        openNodeCatalogs();
    }
 
 
    //DETERMINES WHAT NODE HAS BEEN CLICKED AND UPDATES VIEW
    //Will try to access children of object clicked
    //Depentant on click event sending '_id' of object clicked
    $scope.openNode = function(id) { 

        console.log(id);
 
        //Sends request to DBstorage and expects a result
        var promise = searchDB_byId(id);
 
        //saves result when it returns
        promise.then(function(result) {
 
            //LOOPS THROUGH RESULTS
            //We know this will only produce one result,
            //because no documents in DB shares '_id'
            angular.forEach(result.docs, function(nodeObject){
 
                //DETERMINE ACTION BASED ON NODE TYPE
                switch(nodeObject.NodeType) {
 
                    //GET SECTION CHILDREN OF OBJECT
                    case 'CATALOG': openNodeSections(nodeObject);
                    break;
 
                    //GET PRODUCT CHILDREN OF OBJECT
                    case 'SECTION': openNodeProducts(nodeObject);
                    break;
 
                    //GET PRODUCT INFORMATION OF OBJECT
                    case 'PRODUCT': openProductInfo(nodeObject);
                    break;
                }
            });
 
        //SOMETHING WENT WRONG DETERMINING NODE TYPE
        }).catch(function(err){
            console.log(err.status);
        });
    }
 
 
    //GET NODES OF TYPE CATALOGS AND UPDATES VIEW WITH RESULT
    //Does not require an id
    function openNodeCatalogs() {
 
        //SEARCH DB FOR ENTRIES OF NODE TYPE CATALOG
        var promise = searchDB_forCatalogs();
 
        //WAIT FOR RESULT
        promise.then(function(result) {
 
            //APPLY RESULT TO SCOPE & UPDATE VIEW
            $scope.$apply(function(){
                console.info('Dispaly Catalogs');
                nav                     = false;
                $scope.viewNode         = 'CATALOGS'
                $scope.listStructure    = result.docs;
                console.log('nav is: ' + nav);
            });
 
        //ERROR SEARCHING DB
        }).catch(function(err){
            console.log('Something went wrong searching DB for Catalogs');
            console.error(err);
        }); 
    }
 
 
    //GET NODES OF TYPE SECTION AND UPDATE VIEW WITH RESULT
    //Does require object parameter in order to search DB.
    function openNodeSections(nodeObject) {
 
        //GET '_id' ATTRIBUTE FROM OBJECT
        var id = nodeObject._id;
 
        //SEARCH DB FOR ENTRIES OF NODE TYPE SECTION
        var sections = searchDB_forSections(id);
 
        //UPDATES VIEW WITH RESULT
        sections.then(function(result) {
 
            //DISPLAY CURRENT NODE TYPE: SECTION
            angular.forEach(result.docs, function(obj){
                $scope.viewNode = obj.NodeType;
            });
 
            //UPDATE VIEW
            $scope.$apply(function(){
                console.info('Display Sections');
                nav                     = nodeObject;
                $scope.listStructure    = result.docs;
 
                console.log('nav is: ' + nav.NodeType +': ' + nav.nodeName);
            });
 
        //COULD NOT RETRIEVE SECTION NODES FROM DB
        }).catch(function(err){
            console.error(err.status);
        });
    }
 
    //GET NODES OF TYPE SECTION AND UPDATE VIEW WITH RESULT
    //Does require object parameter in order to search DB.
    function openNodeProducts(nodeObject) {
 
        //GET '_id' ATTRIBUTE FROM OBJECT
        var id = nodeObject._id;
 
        //SEARCH DB FOR ENTRIES OF NODE TYPE PRODUCT
        var products = searchDB_forProducts(id);
 
        //UPDATES VIEW WITH RESULT
        products.then(function(result) {
 
            //DISPLAY CURRENT NODE TYPE: PRODUCT
            angular.forEach(result.docs, function(obj){
                $scope.viewNode = obj.NodeType;
            });
 
            //UPDATE VIEW
            $scope.$apply(function(){
                console.info('Display Products');
                nav                     = nodeObject;
                $scope.listStructure    = result.docs;
 
                console.log('nav is: ' + nav.NodeType +': ' + nav.nodeName);
            });
 
        //COULD NOT RETRIEVE PRODUCT NODES FROM DB
        }).catch(function(err) {
            console.error(err.status);
        });
    }
 
    //GET PRODUCT INFORMATION AND UPDATE VIEW WITH RESULT
    //Does require object parameter to determine 'productId'.
    function openProductInfo(nodeObject) {
 
        //GET PRODUCT ID ATTRIBUTE FROM PRODUCT NODE
        var productId   = nodeObject.productId;
 
        //SEARCH DB FOR ENTRIES WITH PRODUCT ID
        var productInfo = searchDB_byId(productId);
 
        //UPDATE VIEW WITH RESULT
        productInfo.then(function(result) {
 
            //DISPLAY CURRENT NODE: PRODUCT INFORMATION
            $scope.viewNode = 'PRODUCT INFO';
 
            //UPDATE VIEW
            $scope.$apply(function(){
                console.info('Display Product Info');
                nav                     = nodeObject;
                $scope.listStructure    = result.docs;
 
                console.log('nav is: ' + nav.NodeType +': ' + nav.nodeName);
                console.info($scope.listStructure);
            });
 
        //COULD NOT RETRIEVE PRODUCT INFORMATION FROM DB
        }).catch(function(err) {
            console.error(err.status);
        });
    }
 


    //SEARCH
    




});