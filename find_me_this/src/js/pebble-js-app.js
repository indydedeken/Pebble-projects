/*
 * http://www.sitepoint.com/pebble-watch-development-javascript/
 */

var locationOptions = {
    timeout: 15000,
    maximumAge: 60000
};

function fetch_location_data(pos) {
    var req = new XMLHttpRequest(),
        version = Date.now(),
        clientId = 'JUV3W2FJO2NESWHXW4PAP21LJ0F3UJFI0M30I1FYANQGE4H2',
        clientSecret = 'LWLNPL4YVE0VYXTBR2ASVENNCUOSYWS4P4OZH3XP35IKK0JY',
        latitude = pos.coords.latitude,
        longitude = pos.coords.longitude;
    req.open('GET', 'https://api.foursquare.com/v2/venues/search?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=' + version + '&ll=' + latitude + ',' + longitude + '&query=mc%20donald', true);
    req.onload = function(e) {
        if (req.readyState == 4 && req.status == 200) {
            if (req.status == 200) {
                var response = JSON.parse(req.responseText);
                if (response && response.meta.code == '200' && response.response) {
                    var venue = response.response.venues[0];
                    Pebble.sendAppMessage({
                        location: venue.location.address + ', ' + venue.location.city
                    });
                }
            } else {
                console.log('Error');
            }
        }
    }
    req.send(null);
}

function fetch_location_error(err) {
    console.log(err);
    Pebble.sendAppMessage({
        location: 'Localisation ind�termin�e'
    });
}
Pebble.addEventListener('ready', function(e) {
    locationWatcher = window.navigator.geolocation.watchPosition(fetch_location_data, fetch_location_error, locationOptions);
});