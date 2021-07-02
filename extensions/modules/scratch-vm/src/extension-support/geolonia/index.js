const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');

const Message = {
}

const AvailableLocales = ['en', 'ja', 'ja-Hira'];

const style = {
    "version": 8,
    "sources": {
    "japan": {
    "type": "vector",
    "url": "https://cdn.geolonia.com/tiles/japanese-prefectures.json"
    }
    },
    "glyphs": "https://glyphs.geolonia.com/{fontstack}/{range}.pbf",
    "layers": [
        {
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "#222222"
            }
        },
        {
            "id": "prefs",
            "type": "fill",
            "source": "japan",
            "source-layer": "prefectures",
            "paint": {
                "fill-color": "#333333",
                "fill-outline-color": "#444444"
            }
        },
        {
            id: 'point-pref',
            type: 'circle',
            source: "japan",
            "source-layer": "admins",
            paint: {
                'circle-radius': 4,
                'circle-color': 'rgba(255, 255, 255, 0.6)',
            },
        }
    ],
}

class Scratch3GeoloniaBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        this._locale = this.setLocale();

        return {
            id: 'geolonia',
            name: '地図',
            blocks: [
                {
                    opcode: 'displayMap',
                    blockType: BlockType.COMMAND,
                    text: '地図を表示',
                },
                {
                    opcode: 'flyTo',
                    blockType: BlockType.COMMAND,
                    text: "経度 [LNG] 緯度 [LAT] ズーム [ZOOM] に移動",
                    arguments: {
                      LNG: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 139.74
                      },
                      LAT: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 35.65
                      },
                      ZOOM: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 10
                      },
                    }
                },
            ],
            menus: {
            }
        };
    }

    displayMap(args) {
        const mapContainer = document.getElementById('geolonia')

        if (document.getElementById('map')) {
            mapContainer.removeChild(document.getElementById('map'))
        }

        div = document.createElement("div");
        div.id = 'map';
        div.setAttribute("style", "width:100%;height:100%;");
        div.dataset.navigationControl = 'off';
        div.dataset.pitch = 40;

        mapContainer.appendChild(div);

        this.map = {}
        this.map = new geolonia.Map({
            container: '#map',
            style: 'geolonia/gsi',
            center: [0, 0],
            zoom: 0,
        });
    }

    flyTo(args) {
        const promise = new Promise((resolve) => {
            this.map.flyTo({center: [args.LNG, args.LAT], zoom: args.LAT});

            this.map.once('moveend', () => {
                resolve()
            })
        })

        return promise
    }

    setLocale() {
      let locale = formatMessage.setup().locale;
      if (AvailableLocales.includes(locale)) {
        return locale;
      } else {
        return 'en';
      }
    }
}

module.exports = Scratch3GeoloniaBlocks;
