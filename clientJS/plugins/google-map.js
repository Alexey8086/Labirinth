import loadGoogleMapsApi from 'load-google-maps-api'

class Map {

  static loadGoogleMapsApi(api_key) {
    return loadGoogleMapsApi({ key: api_key.key })
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