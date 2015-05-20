
    
function getLocation() {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(showPosition);
    } 

    else {
        $('#mapholder').text('Geolocation is not supported on this device.');
    }
}

function showPosition(position) {

    var lat  = position.coords.latitude;
    var lon = position.coords.longitude;

    console.info('coordinates: ' + lat + ',' + lon); 

    var latlon = new google.maps.LatLng(lat, lon);

    var mapHeight   = $('#uib_page_4').height();
    var mapWidth    = $('#uib_page_4').width();

    console.info('page height: ' + mapHeight);
    console.info('page width: ' + mapWidth);

    mapholder = document.getElementById('mapholder');
    mapholder.style.height = mapHeight;
    mapholder.style.width = mapWidth;


    var myOptions = {
        center:latlon,zoom:14,
        mapTypeId:google.maps.MapTypeId.ROADMAP,
        mapTypeControl:false,
        navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
    }
    
    var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
    var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
}