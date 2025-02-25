var map = L.map("map", {
    fullscreenControl: true,
    // OR
    fullscreenControl: {
        pseudoFullscreen: false, // if true, fullscreen to page width and height
    },
}).setView([36.624585, 2.99623], 14);
L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoiaWx5ZXNtaWxhbm8iLCJhIjoiY2xnOTdhYWpzMTRpNDNmcWluYnVycjU2ciJ9.XsrUAdpIcKAxuD5FUKnsQg",
    {
        maxZoom: 18,

        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
    }
).addTo(map);
let markers = [];

function createMarker(coords, id, icon, date) {
    let myIcon = iconName(icon);
    myMarker = L.marker(coords, {
        draggable: false,
        icon: myIcon,
    });
    myMarker.bindPopup(date);
    myMarker._id = id;
    map.addLayer(myMarker);
    markers.push(myMarker);
}

function createPolyLine(coords) {
    console.log("polyPosList => ", coords);
    const latLngs = [];

    for (let point of coords) {
        latLngs.push(new L.latLng(point.lat, point.lon));
    }
    console.log("coords => ", coords);

    var polyline = new L.Polyline(latLngs, {
        color: "red",
        weight: 3,
        opacity: 1,
        smoothFactor: 1,
    });
    polyline.addTo(map);
}

function clearPolyLine() {
    for (i in map._layers) {
        if (map._layers[i]._path != undefined) {
            try {
                map.removeLayer(map._layers[i]);
            } catch (e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
}

function clearMarker() {
    var new_markers = [];
    markers.forEach(function (marker) {
        map.removeLayer(marker);
    });
    markers = new_markers;
}

const iconName = (name) => {
    switch (name) {
        case "point":
            return L.icon({
                iconUrl:
                    "https://img.icons8.com/fluency-systems-filled/10/141727/circled-dot.png",
                iconSize: [10, 10],
                iconAnchor: [5, 5],
                popupAnchor: [0, -10],
            });
            break;
        case "car":
            return L.icon({
                iconUrl: "https://img.icons8.com/color/35/ffffff/car.png",
                iconSize: [25, 25],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12],
            });
        default:
            break;
    }
};
