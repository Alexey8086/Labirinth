import loadGoogleMapsApi from 'load-google-maps-api'

// AIzaSyCikIhcNVjCrt36iuKAkAKxpKSqoeJ4mRM
class Map {

  static loadGoogleMapsApi() {
    return loadGoogleMapsApi({ key: "AIzaSyB1q7ebI8Aa184Xcgrxje7ywOa2RzGZ1mA" })
  }

  static createMap(googleMaps, mapElement) {
    return new googleMaps.Map(mapElement, {
      center: { lat: 54.804049, lng: 56.121930 },
      zoom: 14
    })
  }

  static createMarker(googleMaps, map) {
    return new googleMaps.Marker({
      position: { lat: 54.80393501862066, lng: 56.121922915342466 },
      map: map,
    })
  }
}

export { Map }

// const initMap = () => {

//   const LAB = { lat: 54.804049, lng: 56.121930 }

//   const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 4,
//     center: LAB,
//   })

//   const marker = new google.maps.Marker({
//     position: LAB,
//     map: map,
//   })
// }

// export default googleMap