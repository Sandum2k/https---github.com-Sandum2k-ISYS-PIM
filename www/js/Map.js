
var geoMsg  = '';
    
function getLocation() {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(showPosition);
    } 

    else {
        geoMsg = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {

    var lat  = position.coords.latitude;
    var lon = position.coords.longitude;

    console.info('coordinates: ' + lat + ',' + lon); 

    var latlon = new google.maps.LatLng(lat, lon);

    var h = $('#uib_page_4').height();
    console.log(h);

    mapholder = document.getElementById('mapholder');
    mapholder.style.height = '500px';
    mapholder.style.width = '500px';


    var myOptions = {
        center:latlon,zoom:14,
        mapTypeId:google.maps.MapTypeId.ROADMAP,
        mapTypeControl:false,
        navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
    }
    
    var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
    var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
}