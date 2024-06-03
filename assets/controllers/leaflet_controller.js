import {Controller} from '@hotwired/stimulus';

let builder = '';
let row = '';
let grid = '';
let form = '';
let ds = '';
let id = '';
export default class extends Controller {
    connect() {
        //  this.element.textContent = 'Hello Stimulus! Edit me in assets/controllers/hello_controller.js';
        if (this.element.hasAttribute('data-builder')) {
            builder = this.element.getAttribute('data-builder');
        }
        if (this.element.hasAttribute('data-row')) {
            row = this.element.getAttribute('data-row');
        }
        if (this.element.hasAttribute('data-grid')) {
            grid = this.element.getAttribute('data-grid');
        }
        if (this.element.hasAttribute('data-form')) {
            form = this.element.getAttribute('data-form');
        }
        if (this.element.hasAttribute('data-ds')) {
            ds = this.element.getAttribute('data-ds');
        }
        if (this.element.hasAttribute('data-id')) {
            id = this.element.getAttribute('data-id');
        }

        function xhr_ajax_handle(data, is_formular = true, callback) {
            let xhr = new XMLHttpRequest();
            let formData = new FormData();
            xhr.open('POST', publicSettings.ajax_url, true);
            if (is_formular) {
                let input = new FormData(data);
                for (let [name, value] of input) {
                    formData.append(name, value);
                }
            } else {
                for (let [name, value] of Object.entries(data)) {
                    formData.append(name, value);
                }
            }
            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    if (typeof callback === 'function') {
                        xhr.addEventListener("load", callback);
                        return false;
                    }
                }
            }
            formData.append('_handle', publicSettings.handle);
            formData.append('token', publicSettings.token);
            xhr.send(formData);
        }

        if (ds) {
            if (sessionStorage.getItem("gmaps") === '1') {
                load_openstreetmap(builder, row, grid, form, id)
            }
        } else {
            load_openstreetmap(builder, row, grid, form, id)
        }


        function load_openstreetmap(builder, row, grid, form, id) {
            makeLeafLetDataScript().then(r => {
                let formData = {
                    'method': 'get_leaflet_map',
                    'builder': builder,
                    'row': row,
                    'grid': grid,
                    'form': form,
                    'id': id
                }
                xhr_ajax_handle(formData, false, set_leaflet_data)
            })
        }


        let leafletDsCheck = document.querySelectorAll('.leaflet-karte-check');
        if (leafletDsCheck) {
            let dsEvent = Array.prototype.slice.call(leafletDsCheck, 0);
            dsEvent.forEach(function (dsEvent) {
                dsEvent.addEventListener("click", function (e) {
                    let parentButton = dsEvent.form.querySelector('button');
                    if (dsEvent.checked) {
                        parentButton.removeAttribute('disabled');
                    } else {
                        parentButton.setAttribute('disabled', 'disabled');
                    }
                });
            });
        }

        let clickLeafletDsBtn = document.querySelectorAll(".leaflet-ds-btn");
        if (clickLeafletDsBtn) {
            let btnLeafletNodes = Array.prototype.slice.call(clickLeafletDsBtn, 0);
            btnLeafletNodes.forEach(function (btnLeafletNodes) {
                btnLeafletNodes.addEventListener("click", function (e) {
                    let checkBox = btnLeafletNodes.form.querySelector('.leaflet-karte-check');
                    if (!checkBox.checked) {
                        return false;
                    }
                    sessionStorage.setItem('gmaps', '1');
                    let parent = btnLeafletNodes.form.previousSibling.parentElement;
                    if (parent.hasAttribute('data-builder')) {
                        builder = parent.getAttribute('data-builder');
                    }
                    if (parent.hasAttribute('data-row')) {
                        row = parent.getAttribute('data-row');
                    }
                    if (parent.hasAttribute('data-grid')) {
                        grid = parent.getAttribute('data-grid');
                    }
                    if (parent.hasAttribute('data-form')) {
                        form = parent.getAttribute('data-form');
                    }
                    if (parent.hasAttribute('data-ds')) {
                        ds = parent.getAttribute('data-ds');
                    }
                    if (parent.hasAttribute('data-id')) {
                        id = parent.getAttribute('data-id');
                    }
                    load_openstreetmap(builder, row, grid, form, id)
                });
            });
        }

        function set_leaflet_data() {
            let data = JSON.parse(this.responseText);
            if (data.status) {
                let container = `#map-wrapper${data.id}`;
                buildOsmMap(data.osm, container, data.id)
            }
        }

        async function makeLeafLetDataScript() {
            let leafletScript = $('#leaflet-script');
            let leafLetCluster = $('#leaflet-marker-cluster-script');
            let leafLetFullScreen = $('#leaflet-marker-fullscreen-script');
            let leafLetMiniMap = $('#leaflet-mini-map-script');
            if (!leafletScript.length) {
                await loadLeafLetScript('/js/leaflet/leaflet.js', 'leaflet-script');
            }
            if (!leafLetCluster.length) {
                await loadLeafLetScript('/js/leaflet/leaflet.markercluster.js', 'leaflet-marker-cluster-script');
            }
            if (!leafLetFullScreen.length) {
                await loadLeafLetScript('/js/leaflet/Control.FullScreen.js', 'leaflet-marker-fullscreen-script');
            }
            if (!leafLetMiniMap.length) {
                await loadLeafLetScript('/js/leaflet/Control.MiniMap.min.js', 'leaflet-mini-map-script');
            }
        }

        function loadLeafLetScript(src, id) {
            return new Promise(function (resolve, reject) {
                let script = document.createElement('script');
                script.src = src;
                script.id = id;
                script.type = 'text/javascript';
                script.onload = () => resolve('Script geladen');
                document.head.append(script);
            });
        }


        function buildOsmMap(osm, container, id, lat = 52.00, lon = 11.5) {
            let mapContainer = jQuery(container);
            if (mapContainer.length) {
                mapContainer.html(`<div id="MapLocation${id}"></div>`)

                let pc = true;
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    pc = false;
                }

                let pins = osm.pins
                let markerData = [];
                if (pins) {
                    markerData = pins;
                }
                if (pins[0]) {
                    lat = pins[0].lat;
                    lon = pins[0].lon;
                }
                let mapCenter = [parseFloat(lat), parseFloat(lon)]
                // create map

                let osmMap = L.map(`MapLocation${id}`, {
                    center: mapCenter,
                    zoom: osm.min_zoom,
                    dragging: pc,
                    tap: pc,
                    scrollWheelZoom: false,
                    fullscreenControl: true,
                    fullscreenControlOptions: {
                        position: 'topright',
                        forceSeparateButton: true,
                        titleCancel: osm.exit_full_screen,
                        title: osm.show_full_screen
                    }
                });


                const attribution = 'Map data &copy; <a target="_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a target="_blank" href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
                let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                L.tileLayer(
                    osmUrl, {
                        maxZoom: osm.max_zoom,
                        minZoom: osm.min_zoom,
                        attribution: attribution
                    }).addTo(osmMap);

                osmMap.setZoom(osm.zoom)
                // attach geojson data
                const geoStyle = {
                    "color": "#444444",
                    "weight": 2,
                    "opacity": 1.0,
                    "fillOpacity": 0.0
                };
                //Karte SA
                /* L.geoJSON(geojson, {
                     style: geoStyle
                 }).addTo(osmMap);*/

                // attach pins to map
                let markers = L.markerClusterGroup({
                    polygonOptions: {
                        color: osm.color,
                        //  fillColor: "rgba(207,255,1)",
                    },
                    maxClusterRadius: osm.maxClusterRadius,
                });

                if (osm.mini_map_active) {
                    let osm2 = new L.TileLayer(osmUrl, {
                        minZoom: osm.mini_map_min_zoom,
                        maxZoom: osm.mini_map_max_zoom,
                        attribution: attribution,
                    });

                    let miniMap = new L.Control.MiniMap(osm2, {
                        toggleDisplay: true,
                        minimized: false,
                        position: 'bottomright',
                        width: osm.mini_map_width,
                        height: osm.mini_map_height,
                        strings: {
                            hideText: osm.msg_min_hide,
                            showText: osm.msg_min_show,
                        }

                    }).addTo(osmMap);
                }


                for (const [key, value] of Object.entries(markerData)) {

                    if ((value.lat !== false) && (value.lon !== false && value.show_pin)) {
                        let customIcon = ''
                        if (osm.pin) {
                            customIcon = L.icon({
                                iconUrl: osm.pin,
                                iconSize: [21, 30],
                                iconAnchor: [22, 31],
                                popupAnchor: [-10, -36]
                            });
                        }


                        let content;
                        content = value.popup;
                        if (content) {
                            L.marker([parseFloat(value.lat), parseFloat(value.lon)], {icon: customIcon}).bindPopup(content).addTo(markers);
                        } else {
                            L.marker([parseFloat(value.lat), parseFloat(value.lon)], {icon: customIcon}).addTo(markers);
                        }
                    }
                }
                markers.addTo(osmMap);

                let t = [];
                pins.map((p, index) => {
                    if (p.polygone_show) {
                        let geo = p.geo_json.coordinates;
                        let type;
                        if (p.geo_json.type === 'Point') {
                            type = 'Polygon'
                        } else {
                            type = p.geo_json.type
                        }
                        let item = {
                            "type": "Feature",
                            "properties": {
                                "app": "pin",
                                color: p.polygone_border,
                                fillColor: p.polygone_fill,
                                weight: p.polygone_border_width,
                            },
                            "geometry": {
                                "type": type,
                                "coordinates": geo,

                            }
                        }
                        t.push(item)
                    }
                })

                L.geoJSON(t, {
                    style: function (feature) {
                        switch (feature.properties.app) {
                            case 'pin':
                                return {
                                    color: feature.properties.color,
                                    fillColor: feature.properties.fillColor,
                                    fillOpacity: 1.0,
                                    weight: feature.properties.weight,
                                };
                            case 'Democrat':
                                return {color: "#0000ff"};
                        }
                    }
                }).addTo(osmMap);

                if (pc) {
                    osmMap.on('focus', function () {
                        osmMap.scrollWheelZoom.enable();
                    });
                    osmMap.on('blur', function () {
                        osmMap.scrollWheelZoom.disable();
                    });
                }

                const mapEl = document.querySelector("#MapLocation" + id);
                mapEl.addEventListener("touchstart", onTwoFingerDrag);
                mapEl.addEventListener("touchend", onTwoFingerDrag);

                function onTwoFingerDrag(e) {

                    if (e.type === 'touchstart' && e.touches.length === 1) {
                        e.currentTarget.classList.add('swiping')
                    } else {
                        e.currentTarget.classList.remove('swiping')
                    }
                }
            }
        }
    }
}
