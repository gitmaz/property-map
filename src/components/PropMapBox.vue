<template>
    <div id="map">
        <MglMap :accessToken="accessToken" :mapStyle="mapStyle">
            <MglGeojsonLayer
                    :sourceId="geoJsonSource.data.id"
                    :source="geoJsonSource"
                    layerId="somethingSomething"
                    :layer="geoJsonLayer"
            />
        </MglMap>
    </div>
</template>
<style>
    #map {
        margin-top: 56px;
        width: 100%;
        height: 500px;
    }
</style>
<script>
    import Mapbox from "mapbox-gl";
    import { MglMap, MglMarker, MglGeojsonLayer } from "vue-mapbox";

    export default {
        components: {
            MglMap,
            MglMarker,
            MglGeojsonLayer
        },
        data() {
            return {
                accessToken:'pk.eyJ1IjoibWFuYXZhIiwiYSI6ImNrYmQ3cXA0ZzA5Mmgycm9qcjVmYXVtYTEifQ.V6wLbwnmOWz2JyuhCWlTlQ',
                mapStyle: 'mapbox://styles/manava/ckbe6dzq91mi41inrsayqmg3h',
                    //"pk.eyJ1IjoibWlrZWhhbWlsdG9uMDAiLCJhIjoiNDVjS2puUSJ9.aLvWM5BnllUGJ0e6nwMSEg", // your access token. Needed if you using Mapbox maps
                //mapStyle: "mapbox://styles/mapbox/streets-v11", // your map style
                geoJsonSource: {
                    type: 'geojson',
                    /*data: {
                        id: "thisIsMySource",
                        type: "FeatureCollection",
                        features: [
                            {
                                type: "Feature",
                                geometry: {
                                    type: "Point",
                                    coordinates: [102.0, 0.5]
                                },
                                properties: {
                                    id: "value0"
                                }
                            }
                        ]
                    },*/

                    'data': {
                        id: "thisIsMySource",
                        'type': 'FeatureCollection',
                        'features': [
                            {
// feature for Mapbox DC
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [
                                        -77.03238901390978,
                                        38.913188059745586
                                    ]
                                },
                                'properties': {
                                    'title': 'Mapbox DC',
                                    'icon': 'monument'
                                }
                            },
                            {
// feature for Mapbox SF
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-122.414, 37.776]
                                },
                                'properties': {
                                    'title': 'Mapbox SF',
                                    'icon': 'harbor'
                                }
                            }
                        ]
                    }
                },
                geoJsonLayer: {
                    type: "circle",
                    paint: {
                        "circle-color": "red"
                    }
                }
            };
        },
        created() {
            // We need to set mapbox-gl library here in order to use it in template
            this.mapbox = Mapbox;
        }
    };
</script>
