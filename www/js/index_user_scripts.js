(function() {
 "use strict";
 
    //hook up event handlers 
    function register_event_handlers() {
    
    
         /* button  Home */
        $(document).on("click", ".uib_w_7", function(evt) {
             activate_subpage("#uib_page_2"); 
        });
    
    
        /* button  messages */
        $(document).on("click", ".uib_w_3", function(evt) {
             activate_subpage("#uib_page_4"); 
        });
    
        /* button  Profile */
        $(document).on("click", ".uib_w_4", function(evt) {
             activate_subpage("#uib_page_5"); 
        });
    
        /* button  Kamera */
        $(document).on("click", ".uib_w_13", function(evt) {

            $('#searchInput').val("this is a test");

            navigator.camera.getPicture(onSuccess, onFail, { 
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL
            });


            function onSuccess(imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
        });
    
        /* button  Strek-Kode */
        $(document).on("click", ".uib_w_12", function(evt) {

        });
    


        //SEARCH
        $(document).on("click", ".uib_w_16", function(evt) {
            var txt = $('#searchInput').val();
            console.log(txt);
            $('#searchInput').val("");
        });
    


    
        /* button  Varehus */
        $(document).on("click", ".uib_w_40", function(evt) {
             activate_subpage("#uib_page_4"); 
        });
    
        /* button  Instillinger */
        $(document).on("click", ".uib_w_39", function(evt) {
             activate_subpage("#uib_page_5"); 
        });
    
    
        /* button  Hjem */
        $(document).on("click", ".uib_w_42", function(evt) {
             activate_subpage("#uib_page_2"); 
        });
    



        //BUTTON CATALOGS CLICK EVENT
        $(document).on("click", ".uib_w_6", function(evt) {

            //Open Catalogs
            angular.element($('#afui')).scope().openCatalogs();
            
            //new view
            activate_subpage("#uib_page_3"); 
        });




        $(document).on("click", "#returnToCatalogs", function(evt) {

            //Open Catalogs
            angular.element($('#afui')).scope().openCatalogs();
            
            //new view
            activate_subpage("#uib_page_3"); 
        });



        //BUTTON 'Cataloger'
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
    
    


        //BUTTON 'Synkroniser'
        $(document).on("click", ".uib_w_54", function(evt) {

            //CONNECT TO API AND GET DATA
            angular.element($('html')).scope().connectWithAPI();
        });
    }

    document.addEventListener("app.Ready", register_event_handlers, false);
    
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(navigator.camera);
    }
 
})();
