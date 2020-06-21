<template>
    <div id="map">
        <MglMap ref="mglMap" :accessToken="accessToken" :mapStyle="mapStyle" @load="onMapLoaded"
                :center="[133.7751,-25.2744]">
            <MglGeojsonLayer ref="mglGeojsonLayer"
                             :sourceId="geoJsonSource.data.id"
                             :source="geoJsonSource"
                             layerId="mylayer1"
                             :layer="geoJsonLayer"

            />
        </MglMap>
    </div>
</template>
<style>
    #map {
        width: 100%;
        height: 800px;
    }
</style>
<script>
    import Mapbox from "mapbox-gl"
    import {MglMap, MglMarker, MglGeojsonLayer} from "vue-mapbox"
    //center for sydney all suburbs(for future use): [150.9085, -33.8646] (use zoom 10.5)
    export default {
        components: {
            MglMap,
            MglMarker,
            MglGeojsonLayer
        },
        data() {
            return {
                map: {},
                accessToken: 'pk.eyJ1IjoibWFuYXZhIiwiYSI6ImNrYmQ3cXA0ZzA5Mmgycm9qcjVmYXVtYTEifQ.V6wLbwnmOWz2JyuhCWlTlQ',
                mapStyle: 'mapbox://styles/manava/ckbe6dzq91mi41inrsayqmg3h',
                //"pk.eyJ1IjoibWlrZWhhbWlsdG9uMDAiLCJhIjoiNDVjS2puUSJ9.aLvWM5BnllUGJ0e6nwMSEg", // your access token. Needed if you using Mapbox maps
                //mapStyle: "mapbox://styles/mapbox/streets-v11", // your map style
                geoJsonSource: {
                    type: 'geojson',
                    'data': {
                        id: "mysource1",
                        'type': 'FeatureCollection',
                        'features': [
                            {
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
            }
        },
        methods: {
            async onMapLoaded(event) {

                const asyncActions = event.component.actions

                await asyncActions.flyTo({
                    center: [151.2073, -33.8708],// [150.9085, -33.8646],//
                    zoom: 13.7,//9,//
                    speed: 1
                })

                this.$emit("map-is-ready")

            }
        },
        created() {
            // We need to set mapbox-gl library here in order to use it in template
            this.mapbox = Mapbox
            this.map = null
        }
    }
</script>
