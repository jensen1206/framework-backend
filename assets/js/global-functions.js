//Message Handle
import Swal from "sweetalert2";


export const success_message = (msg) => {
    let x = document.getElementById("snackbar-success");
    x.innerHTML = msg;
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

export const swal_timer = (data = '') => {
    let timerInterval
    Swal.fire({
        title: data.title ? data.title : 'Aktualisieren',
        html: data.msg ? data.msg : 'Daten werden aktualisiert...', //'Daten werden aktualisiert...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        customClass: {
            popup: 'swal-info-container'
        },
        hideClass: {
            //popup: 'animate__animated animate__fadeOutUp'
        },
        didOpen: () => {
            Swal.showLoading()
            /*const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
            }, 100)*/
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
    })
}

export const warning_message = (msg) => {
    let x = document.getElementById("snackbar-warning");
    x.innerHTML = msg;
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

export const scrollToWrapper = (target, offset = 50) => {
    setTimeout(function () {
        jQuery('html, body').stop().animate({
            scrollTop: jQuery(target).offset().top - (offset),
        }, 400, "linear", function () {
        });
    }, 350);
}

export const createRandomCode = (length) => {
    let randomCodes = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        randomCodes += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomCodes;
}

export const createRandomInteger = (length) => {
    let randomCodes = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        randomCodes += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomCodes;
}

export const swal_alert = (data) => {
    if (data.status) {
        Swal.fire({
            position: 'top-end',
            title: data.title,
            text: data.msg,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            customClass: {
                popup: 'swal-success-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    } else {
        Swal.fire({
            position: 'top-end',
            title: data.title,
            text: data.msg,
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            customClass: {
                popup: 'swal-error-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }
}

export const swal_message = (title, msg) => {
    Swal.fire({
        position: 'center',
        title: title,
        html: msg,
        //icon: 'success',
        //timer: 1500,
        showConfirmButton: true,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        customClass: {
            popup: 'swal-message-container'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then();
}

export const swall_timer = (data) => {
    let timerInterval
    Swal.fire({
        title: data.title,
        html: data.msg,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        customClass: {
            popup: 'swal-info-container'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        },
        didOpen: () => {
            Swal.showLoading()
            /*const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
            }, 100)*/
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
    })
}

export const buildOsmMap = (pins, zoom = 15, lat = 52.00, lon = 11.5, minZoom = 8) => {
    let mapContainer = jQuery('.leaflet-container');
    if(mapContainer.length){
        mapContainer.html('<div id="MapLocation"></div>')

        let markerData = [];
        if (pins) {
            markerData = pins;
        }
        let mapCenter = [parseFloat(lat), parseFloat(lon)]
        // create map
        let osmMap = L.map('MapLocation', {
            center: mapCenter,
            zoom: zoom,
            scrollWheelZoom: false
        });

        osmMap.on('focus', function() { osmMap.scrollWheelZoom.enable(); });
        osmMap.on('blur', function() { osmMap.scrollWheelZoom.disable(); });

        const attribution = 'Map data &copy; <a target="_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a target="_blank" href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: minZoom,
                attribution: attribution
            }).addTo(osmMap);

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
              //  color: "#aaaaaa",
                weight: 1,
              //  fillColor: "#f77e8a"
            },
            maxClusterRadius: 20
        });

        for (const [key, value] of Object.entries(markerData)) {
            if (value.complete !== false) {
                if ((value.lat !== false) && (value.lon !== false)) {
                   /* let customIcon = L.icon({
                        iconUrl: '/assets/img/marker.png',
                        iconSize: [21, 30],
                        iconAnchor: [22, 31],
                        popupAnchor: [-10, -36]
                    });*/
                    let content = '<strong>' + value.title + '</strong><br />';
                    content = content + value.popup;
                    L.marker([parseFloat(value.lat), parseFloat(value.lon)]).bindPopup(content).addTo(markers);
                }
            }
        }
        markers.addTo(osmMap);
    }
}



