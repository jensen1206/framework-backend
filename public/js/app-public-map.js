let gmaps_container = '';
let pins = [];
let api_key = '';
let scheme = [];
let ds = '';
let id = '';
let type = '';
let default_pin = '';
let zoom = 15;
let gmapsIframe = '';
let iframeHeight = '';
let iframeWidth = '';
let osmMap = ''
const windowReady = new Promise(resolve => {
    if (document.readyState === 'complete') {
        resolve('ready');
    } else {
        window.addEventListener('load', resolve);
    }
});
windowReady.then((resolve) => {
    let mapContainer = document.querySelectorAll('.app-map-container');
    if (mapContainer.length !== 0) {
        let mapEvent = Array.prototype.slice.call(mapContainer, 0);
        mapEvent.forEach(function (mapEvent) {
            if (mapEvent.hasAttribute('data-ds')) {
                ds = mapEvent.getAttribute('data-ds');
            }
            if (mapEvent.hasAttribute('data-id')) {
                id = mapEvent.getAttribute('data-id');
            }
            if (mapEvent.hasAttribute('data-type')) {
                type = mapEvent.getAttribute('data-type');
            }
            let iFrame;
            switch (type) {
                case 'gmaps-api':
                    gmaps_container = mapEvent;
                    if (mapEvent.hasAttribute('data-zoom')) {
                        zoom = mapEvent.getAttribute('data-zoom');
                    }
                    if (mapEvent.hasAttribute('data-key')) {
                        api_key = window.atob(mapEvent.getAttribute('data-key'));
                    }
                    if (mapEvent.hasAttribute('data-pins')) {
                        pins = JSON.parse(window.atob(mapEvent.getAttribute('data-pins')));
                    }
                    if (mapEvent.hasAttribute('data-scheme')) {
                        scheme = JSON.parse(window.atob(mapEvent.getAttribute('data-scheme')));
                    }
                    if (ds) {
                        if (sessionStorage.getItem("gmaps") === '1') {
                            injectGoogleMapsApiScript({
                                key: api_key,
                                callback: 'initMap',
                            });
                            return false;
                        }
                    } else {
                        injectGoogleMapsApiScript({
                            key: api_key,
                            callback: 'initMap',
                        });
                    }
                    break;
                case 'gmaps-iframe':
                    if (mapEvent.hasAttribute('data-url')) {
                        gmapsIframe = window.atob(mapEvent.getAttribute('data-url'));
                    }
                    if (mapEvent.hasAttribute('data-height')) {
                        iframeHeight = mapEvent.getAttribute('data-height');
                    }
                    if (mapEvent.hasAttribute('data-width')) {
                        iframeWidth = mapEvent.getAttribute('data-width');
                    }

                    if (ds) {
                        if (sessionStorage.getItem("gmaps") === '1') {
                            iFrame = get_gmaps_iFrame(gmapsIframe, iframeWidth, iframeHeight);
                            mapEvent.innerHTML = iFrame;
                        }
                    }
                    break;
                case 'osm':
                    if (mapEvent.hasAttribute('data-url')) {
                        gmapsIframe = window.atob(mapEvent.getAttribute('data-url'));
                    }
                    if (mapEvent.hasAttribute('data-height')) {
                        iframeHeight = mapEvent.getAttribute('data-height');
                    }
                    if (mapEvent.hasAttribute('data-width')) {
                        iframeWidth = mapEvent.getAttribute('data-width');
                    }
                    if (mapEvent.hasAttribute('data-map')) {
                        osmMap = JSON.parse(window.atob(mapEvent.getAttribute('data-map')));
                    }
                    if (ds) {
                        if (sessionStorage.getItem("gmaps") === '1') {
                            iFrame = get_osm_iFrame(gmapsIframe, iframeWidth, iframeHeight, osmMap);
                            mapEvent.innerHTML = iFrame;
                        }
                    }
                    break;
            }
        })
    }
    let gmDsCheck = document.querySelectorAll('.gmaps-karte-check');
    if (gmDsCheck) {
        let dsEvent = Array.prototype.slice.call(gmDsCheck, 0);
        dsEvent.forEach(function (dsEvent) {
            dsEvent.addEventListener("click", function (e) {
                dsEvent.blur();
                let parentButton = dsEvent.form.querySelector('button');
                if (dsEvent.checked) {
                    parentButton.removeAttribute('disabled');
                } else {
                    parentButton.setAttribute('disabled', 'disabled');
                }
            });
        });
    }

    let clickGoogleMapsDsBtn = document.querySelectorAll(".gmaps-ds-btn");
    if (clickGoogleMapsDsBtn) {
        let btnGmapsNodes = Array.prototype.slice.call(clickGoogleMapsDsBtn, 0);
        btnGmapsNodes.forEach(function (btnGmapsNodes) {
            btnGmapsNodes.addEventListener("click", function (e) {
                let checkBox = btnGmapsNodes.form.querySelector('.gmaps-karte-check');
                if (!checkBox.checked) {
                    return false;
                }
                sessionStorage.setItem('gmaps', '1');
                let parent = btnGmapsNodes.form.previousSibling.parentElement;
                let parentType;
                if (parent) {
                    parentType = parent.getAttribute('data-type');
                    if (parentType === 'gmaps-api') {
                        gmaps_container = parent;
                        gmaps_container.innerHTML = '';
                        injectGoogleMapsApiScript({
                            key: api_key,
                            callback: 'initMap',
                        });

                        return false;
                    }
                    if (parentType === 'gmaps-iframe') {

                        if (parent.hasAttribute('data-url')) {
                            gmapsIframe = window.atob(parent.getAttribute('data-url'));
                        }
                        if (parent.hasAttribute('data-height')) {
                            iframeHeight = parent.getAttribute('data-height');
                        }
                        if (parent.hasAttribute('data-width')) {
                            iframeWidth = parent.getAttribute('data-width');
                        }
                        parent.innerHTML = get_gmaps_iFrame(gmapsIframe, iframeWidth, iframeHeight);
                    }
                    if (parentType === 'osm') {

                        if (parent.hasAttribute('data-url')) {
                            gmapsIframe = window.atob(parent.getAttribute('data-url'));
                        }
                        if (parent.hasAttribute('data-height')) {
                            iframeHeight = parent.getAttribute('data-height');
                        }
                        if (parent.hasAttribute('data-width')) {
                            iframeWidth = parent.getAttribute('data-width');
                        }
                        if (parent.hasAttribute('data-map')) {
                            osmMap = JSON.parse(window.atob(parent.getAttribute('data-map')));
                        }
                        parent.innerHTML = get_gmaps_iFrame(gmapsIframe, iframeWidth, iframeHeight, osmMap);
                    }
                }
            });
        });
    }

    function get_gmaps_iFrame(uri, width, height) {
        return `<iframe src="${uri}" width="${width}"  height="${height}" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    }

    function get_osm_iFrame(uri, width, height, map) {
        let link;
        if (map.active && map.zoom && map.lat && map.lon) {
            link = `<br/><small><a target="_blank" href="https://www.openstreetmap.org/?mlat=${map.lat}&amp;mlon=${map.lon}#map=${map.zoom}/${map.lat}/${map.lon}">Größere Karte anzeigen</a></small>`;
        }


        return `<iframe class="osm-iframe" src="${uri}" width="${width}" height="${height}" style="border:0;" referrerpolicy="no-referrer-when-downgrade"></iframe>${link}`;
    }

  /*  const mapEl = document.querySelector("#MapLocation" + id);
    mapEl.addEventListener("touchstart", onTwoFingerDrag);
    mapEl.addEventListener("touchend", onTwoFingerDrag);

    function onTwoFingerDrag(e) {

        if (e.type === 'touchstart' && e.touches.length === 1) {
            e.currentTarget.classList.add('swiping')
        } else {
            e.currentTarget.classList.remove('swiping')
        }
    }*/

    $(document).on('click', '.osm .app-gmaps .osm-card', function (e) {
        $(this).addClass('active')
    })

    $(document).on('click', function (e) {
        if (!$(e.target).parents().addBack().is('.osm-card')) {
            $(".osm-card").removeClass("active");
        }
    });

     let dateYear = $('.date-year');
     if(dateYear.length) {
         let date = new Date(),
             year = date.getFullYear()

       dateYear.html(year)
     }
})

async function initMap() {
    const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
    const {Map} = await google.maps.importLibrary("maps");
    let infowindow = new google.maps.InfoWindow();
    //let geocoder = new google.maps.Geocoder();
    let output = [];
    let map_type_ids = ['roadmap'];

    let farbshema;
    let custom_style;
    if (scheme) {
        farbshema = scheme;
        custom_style = new google.maps.StyledMapType(farbshema, {name: publicSettings.site_name});
        map_type_ids = ['styled_map'];
    }

    let map;
    let centerLat = Number(pins[0].coordinates.split(',')[0]);
    let centerLng = Number(pins[0].coordinates.split(',')[1]);
    map = new Map(gmaps_container, {
        center: {lat: centerLat, lng: centerLng},
        zoom: parseInt(zoom),
        mapId: id,
        streetViewControl: false,
        mapTypeControlOptions: {
            mapTypeIds: map_type_ids
        }
    });

    if (scheme) {
        map.mapTypes.set('styled_map', custom_style);
        map.setMapTypeId('styled_map');
    }

    for (const [key, value] of Object.entries(pins)) {
        let lat = Number(value.coordinates.split(',')[0]);
        let lng = Number(value.coordinates.split(',')[1]);
        let pinadress = {lat: lat, lng: lng};
        let textbox = value.info_txt;
        let pinicon = '';
        pinicon = {
            url: value.pin,
            scaledSize: new google.maps.Size(value.width, value.height),
        }

        let marker = new google.maps.Marker({
            map: map,
            position: pinadress,
            icon: value.pin,
            loc: textbox,
        });

        output.push(marker);
        if (textbox !== '') {
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.close(); // Close previously opened infowindow
                infowindow.setContent('<div class="infowindow"><p>' + this.loc + '</p></div>');
                infowindow.open({
                    anchor: this,
                    map,
                    shouldFocus: false,
                });
            });
        }
    }
    if (output.length < 1) {
        let bounds = new google.maps.LatLngBounds();
        for (let j = 0; j < output.length; j++) {
            if (output[j].getVisible()) {
                bounds.extend(output[j].getPosition());
            }
        }
        map.fitBounds(bounds);
    } else {
        map.setCenter(output[0].position);
    }

}


let googleMapsScriptIsInjected = false;
const injectGoogleMapsApiScript = (options = {}) => {
    if (googleMapsScriptIsInjected) {
        //throw new Error('Google Maps Api is already loaded.');
        //  console.log('Google Maps Api is already loaded.');
        return false;
    }
    const optionsQuery = Object.keys(options)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(options[k])}`)
        .join('&');

    const url = `https://maps.googleapis.com/maps/api/js?${optionsQuery}`;
    const script = document.createElement('script');
    script.setAttribute('src', url);
    //script.setAttribute('async', '');
    //script.setAttribute('defer', '');
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);


    googleMapsScriptIsInjected = true;
};


