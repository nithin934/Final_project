let map;
let service;
let infowindow;
let markers = [];

function initMap() {
  const center = { lat: 35.4676, lng: -97.5164 }; // Oklahoma City (default)

  map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 13,
  });

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  const input = document.getElementById("searchInput");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;
    map.setCenter(place.geometry.location);
    map.setZoom(14);
    searchPlaces(place.formatted_address || place.name);
  });
}

function searchPlaces(query) {
  const request = {
    query: query,
    fields: ["name", "geometry", "formatted_address", "place_id"],
  };

  service.textSearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearMarkers();
      displayResults(results.slice(0, 5));
    }
  });
}

function displayResults(places) {
  const placesDiv = document.getElementById("places");
  placesDiv.innerHTML = "";

  places.forEach((place, index) => {
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      label: `${index + 1}`,
    });
    markers.push(marker);

    const card = document.createElement("div");
    card.classList.add("place-card");
    card.innerHTML = `
      <h3>${place.name}</h3>
      <p>${place.formatted_address}</p>
    `;
    card.addEventListener("click", () => {
      map.panTo(place.geometry.location);
      map.setZoom(15);
      infowindow.setContent(`<strong>${place.name}</strong><br>${place.formatted_address}`);
      infowindow.open(map, marker);
    });

    placesDiv.appendChild(card);
  });
}

function clearMarkers() {
  markers.forEach((m) => m.setMap(null));
  markers = [];
}
