var map = L.map('map').setView([46.7563, 2.4521], 6);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: mapboxAccessToken  // défini dans token.js
}).addTo(map);

$.getJSON("departements.geojson", function(departements) {
    // on mettra dans la variable suivante les circonscriptions
    var circonscriptions;
    // on mettra dans le groupe suivant les circonscriptions du département
    var currentDepartmentLayer = L.layerGroup([]).addTo(map);
    // on affiche les départements
    L.geoJSON(departements, {
        style: function(feature) {
            return {
              color: "#666",
              opacity: 0.25
            };
        },
        onEachFeature: function(department_feature, layer) {
            layer.on('click', function(e) {
                // on centre la carte sur le département
                map.fitBounds(layer.getBounds());
                // on vide le groupe
                currentDepartmentLayer.clearLayers();
                // on affiche les circonscriptions du département
                L.geoJSON(circonscriptions, {
                    filter: function(circonscription_feature) {
                        return (circonscription_feature.properties.name.substring(0, 2) === department_feature.properties.code);
                    },
                    style: function(feature) {
                        return {
                          color: "#f00",
                          opacity: 0.5
                        };
                    },
                    onEachFeature: function(circonscription_feature, layer) {
                        layer.on('click', function(e) {
                            window.alert("Circonscription " + circonscription_feature.properties.name);
                        });
                    }
                }).addTo(currentDepartmentLayer);
            });
        }
    }).addTo(map);
    // on charge les circonscriptions
    $.getJSON("circonscriptions.geojson", function(c) {
        circonscriptions = c;
    });
});
