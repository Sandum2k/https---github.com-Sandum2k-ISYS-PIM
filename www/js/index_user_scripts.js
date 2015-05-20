(function() {
 "use strict";
 
    //HOOKUP EVENT HANDLER S
    function register_event_handlers() {
    
    
        //BUTTON: HOME
        $(document).on("click", ".uib_w_7", function(evt) {
             activate_subpage("#uib_page_2"); 
        });
    
        //BUTTON: ??
        $(document).on("click", ".uib_w_3", function(evt) {
             activate_subpage("#uib_page_4"); 
        });
    
        //BUTTON: ??
        $(document).on("click", ".uib_w_4", function(evt) {
             activate_subpage("#uib_page_5"); 
        });
    
        //BUTTON: CAMERA
        $(document).on("click", ".uib_w_13", function(evt) {

            //GET BARCODE INPUT
            intel.xdk.device.scanBarcode();

            //APPLY INPUT TO SEARCH FIELD
            document.addEventListener("intel.xdk.device.barcode.scan", function(evt) {
                navigator.notification.beep(1);
                if (evt.success == true) {
                    $('#searchInput').val(evt.codedata);
                }
                else { console.error(evt.error); }
            },false);
        });
    
        //BUTTON: ??
        $(document).on("click", ".uib_w_12", function(evt) {

        });


        //BUTTON: SEARCH
        $(document).on("click", ".uib_w_16", function(evt) {
            var txt = $('#searchInput').val();
            console.info('Search string: ' + txt);

            

            //CLEAR SEARCH FIELD VALUE
            $('#searchInput').val("");
        });
    


    
        //BUTTON: MAP
        $(document).on("click", ".uib_w_40", function(evt) {
             activate_subpage("#uib_page_4");

             console.log('CLICK ME');

        });
    
        //BUTTON: INFO
        $(document).on("click", ".uib_w_39", function(evt) {
             activate_subpage("#uib_page_5"); 
        });
    
    
        //BUTTON: HOME
        $(document).on("click", ".uib_w_42", function(evt) {
             activate_subpage("#uib_page_2"); 
        });
    

        //BUTTON: CATALOGS
        $(document).on("click", ".uib_w_6", function(evt) {

            //Open Catalogs
            angular.element($('#afui')).scope().openCatalogs();
            
            //new view
            activate_subpage("#uib_page_3"); 
        });



        //BUTTON: SECTIONS BACK BUTTON
        $(document).on("click", "#returnToCatalogs", function(evt) {

            //Open Catalogs
            angular.element($('html')).scope().openCatalogs();
            
            //new view
            activate_subpage("#uib_page_3"); 
        });



        //BUTTON: ??
        $(document).on("click", ".uib_w_41", function(evt) {
             activate_subpage("#uib_page_3");
             
        });



    
        /* listitem  List Item_sub_Produkter */
        $(document).on("click", ".uib_w_44", function(evt) {
             activate_subpage("#uib_page_sub_Produkt_info"); 
        });
    
        /* listitem  Listelement seksjon */
        $(document).on("click", ".uib_w_42", function(evt) {
             activate_subpage("#uib_page_sub_Produkter"); 
        });
    
    


        //BUTTON: SYNCRONIZE
        $(document).on("click", ".uib_w_54", function(evt) {

            //CONNECT TO API AND GET DATA
            
            angular.element($('html')).scope().connectWithAPI();
            alert("tadaa 1 ");
        });
    }

    document.addEventListener("app.Ready", register_event_handlers, false);
    
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(navigator.notification);
    }
 
})();
