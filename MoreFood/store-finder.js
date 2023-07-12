mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2bWlsbDQxNSIsImEiOiJjbGp6eG1hb2QwMHczM3JwZmF1b2N1N2hlIn0.sR2oJph6V1i_W6LEsS8fVQ';
    const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-105.0178157, 39.737925],
    zoom: 12
    });
    
    map.on('load', () => {
    const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    zoom: 13,
    placeholder: 'Enter an address or place name',
    bbox: [-105.116, 39.679, -104.898, 39.837]
    });
    
    map.addControl(geocoder, 'top-left');
    
    const marker = new mapboxgl.Marker({
    'color': '#008000'
    });
    
    geocoder.on('result', async (event) => {
    const point = event.result.center;
    const tileset = 'examples.dl46ljcs';
    const radius = 1609;
    const limit = 50;
    marker.setLngLat(point).addTo(map);
    const query = await fetch(
    `https://api.mapbox.com/v4/${tileset}/tilequery/${point[0]},${point[1]}.json?radius=${radius}&limit=${limit}&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
    );
    const json = await query.json();
    map.getSource('tilequery').setData(json);
    });
    
    map.addSource('tilequery', {
    type: 'geojson',
    data: {
    'type': 'FeatureCollection',
    'features': []
    }
    });
    
    map.addLayer({
    id: 'tilequery-points',
    type: 'circle',
    source: 'tilequery',
    paint: {
    'circle-stroke-color': 'white',
    'circle-stroke-width': {
    stops: [
    [0, 0.1],
    [18, 3]
    ],
    base: 5
    },
    'circle-radius': {
    stops: [
    [12, 5],
    [22, 180]
    ],
    base: 5
    },
    'circle-color': [
    'match',
    ['get', 'STORE_TYPE'],
    'Convenience Store',
    '#FF8C00',
    'Convenience Store With Gas',
    '#FF8C00',
    'Pharmacy',
    '#FF8C00',
    'Specialty Food Store',
    '#9ACD32',
    'Small Grocery Store',
    '#008000',
    'Supercenter',
    '#008000',
    'Superette',
    '#008000',
    'Supermarket',
    '#008000',
    'Warehouse Club Store',
    '#008000',
    '#FF0000' // any other store type
    ]
    }
    });
    
    const popup = new mapboxgl.Popup();
    
    map.on('mouseenter', 'tilequery-points', (event) => {
    map.getCanvas().style.cursor = 'pointer';
    const properties = event.features[0].properties;
    const obj = JSON.parse(properties.tilequery);
    const coordinates = new mapboxgl.LngLat(
    properties.longitude,
    properties.latitude
    );
    
    const content = `<h3>${properties.STORE_NAME}</h3><h4>${
    properties.STORE_TYPE
    }</h4><p>${properties.ADDRESS_LINE1}</p><p>${(
    obj.distance / 1609.344
    ).toFixed(2)} mi. from location</p>`;
    
    popup.setLngLat(coordinates).setHTML(content).addTo(map);
    });
    
    map.on('mouseleave', 'tilequery-points', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
    });
    });