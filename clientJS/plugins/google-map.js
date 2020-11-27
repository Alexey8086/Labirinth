import loadGoogleMapsApi from 'load-google-maps-api'

const googleMap = () => {
  if (document.querySelector('#map')) {
    class Map {
    
      static loadGoogleMapsApi() {
        return loadGoogleMapsApi({ key: "AIzaSyCikIhcNVjCrt36iuKAkAKxpKSqoeJ4mRM" })
      }
      static createMap(googleMaps, mapElement) {
        return new googleMaps.Map(mapElement, {
          center: { lat: 54.804049, lng: 56.121930 },
          zoom: 14
        })
      }
    }
  
    document.addEventListener("DOMContentLoaded", function() {
      let mapElement = document.getElementById('map');
      
      Map.loadGoogleMapsApi().then(function(googleMaps) {
        Map.createMap(googleMaps, mapElement);
      })
    })
  }
}

export default googleMap