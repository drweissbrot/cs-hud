/*
 * this data is from the <CSGO>/csgo/resource/overviews directory, and the .txt files that are within it
 *
 * everything I know about what all of this means:
 * pos_x is the x coordinate of the top left corner of the map
 * pos_y is the y coordinate of the top left corner of the map
 * going to the right on the map means x positive
 * going down on the minimap means y negative
 * => bottom right corner of the minimap: x > pos_x; y < pos_y
 *
 * scale is how many units are represented by 1 pixel when the map is displayed on 1024x1024
 * zoom, rotate, and all four inset_* appear to be irrelevant for this use case
 */
export default {
	ar_baggage: {
		pos_x: -2150,
		pos_y: 2280,
		scale: 4,
		rotate: 1,
		zoom: 1.3,
	},

	ar_dizzy: {
		pos_x: -2512,
		pos_y: 1536,
		scale: 3,
		zoom: 1,
	},

	ar_lunacy: {
		pos_x: -1536,
		pos_y: 1536,
		scale: 3,
		zoom: 1,
	},

	ar_monastery: {
		pos_x: -1687,
		pos_y: 1640,
		scale: 3,
		zoom: 1,
	},

	ar_shoots: {
		pos_x: -2150,
		pos_y: 2582,
		scale: 4,
	},

	coop_autumn: {
		pos_x: -5160,
		pos_y: 5859,
		scale: 12,
	},

	coop_cementplant: {
		pos_x: -5160,
		pos_y: 5859,
		scale: 12,
	},

	coop_kasbah: {
		pos_x: -5160,
		pos_y: 5859,
		scale: 12,
	},

	cs_agency: {
		pos_x: -2947,
		pos_y: 2492,
		scale: 5,
	},

	cs_apollo: {
		pos_x: -1998,
		pos_y: -1604,
		scale: 5.03,
	},

	cs_assault: {
		pos_x: 4041,
		pos_y: 7838,
		scale: 4.6,
	},

	cs_backalley: {
		pos_x: -2485,
		pos_y: 3200,
		scale: 3.5,
	},

	cs_cruise: {
		pos_x: -3507,
		pos_y: 2498,
		scale: 5,
		rotate: 0,
		zoom: 0,
	},

	cs_insertion: {
		pos_x: -4888,
		pos_y: 4884,
		scale: 10,
	},

	cs_italy: {
		pos_x: -2647,
		pos_y: 2592,
		scale: 4.6,
		rotate: 1,
		zoom: 1.5,
	},

	cs_militia: {
		pos_x: -1474,
		pos_y: 2296,
		scale: 4.5,

		sections: {
			default: { max: 20000, min: -25 },
			lower: { max: -25, min: -10000 },
		},
	},

	cs_office: {
		pos_x: -1838,
		pos_y: 1858,
		scale: 4.1,
	},

	cs_rush: {
		pos_x: -2950,
		pos_y: 3350,
		scale: 5.2,
	},

	cs_siege: {
		pos_x: -1193,
		pos_y: 3515,
		scale: 6.5,
		rotate: 1,
		zoom: 2.5,
	},

	cs_workout: {
		pos_x: -2176,
		pos_y: 3165,
		scale: 6.06,
	},

	de_abbey: {
		pos_x: -6204,
		pos_y: 5111,
		scale: 6.5,
		rotate: 0,
		zoom: 0,
	},

	de_ali: {
		pos_x: -2064,
		pos_y: 2920,
		scale: 5,
		zoom: 1.3,
	},

	de_ancient: {
		pos_x: -2953,
		pos_y: 2164,
		scale: 5,
		rotate: 0,
		zoom: 0,
	},

	de_anubis: {
		pos_x: -2796,
		pos_y: 3328,
		scale: 5.22,
	},

	de_austria: {
		transparent: true,

		pos_x: -2877,
		pos_y: 2930,
		scale: 5.8,
		zoom: 1,
	},

	de_aztec: {
		pos_x: -3200,
		pos_y: 2841,
		scale: 6,
		rotate: 0,
		zoom: 0,
	},

	de_bank: {
		pos_x: -2000,
		pos_y: 1493,
		scale: 4,
		rotate: 0,
		zoom: 0,
	},

	de_bazaar: {
		pos_x: -2434,
		pos_y: 2179,
		scale: 5,
		rotate: 1,
		zoom: 2.5,
	},

	de_biome: {
		pos_x: -2129,
		pos_y: 2368,
		scale: 5,
		rotate: 0,
		zoom: 0,
	},

	de_blackgold: {
		pos_x: -1100,
		pos_y: 1425,
		scale: 5.3,
	},

	de_breach: {
		pos_x: -2950,
		pos_y: 2886,
		scale: 5.5,
	},

	de_cache: {
		simpleradar: true,
		transparent: true,

		pos_x: -2000,
		pos_y: 3250,
		scale: 5.5,

		inset_left: 0.16,
		inset_top: 0.04,
		inset_right: 0.2,
		inset_bottom: 0.04,
	},

	de_canals: {
		pos_x: -2496,
		pos_y: 1792,
		scale: 4,
	},

	de_castle: {
		pos_x: -3378,
		pos_y: 2756,
		scale: 5.5,
		zoom: 1.8,
	},

	de_cbble: {
		transparent: true,

		pos_x: -3840,
		pos_y: 3072,
		scale: 6,

		inset_left: 0.15,
		inset_top: 0.01,
		inset_right: 0.3,
		inset_bottom: 0.15,
	},

	de_chinatown: {
		pos_x: -1735,
		pos_y: 3232,
		scale: 4,
		rotate: 0,
		zoom: 0,
	},

	de_chlorine: {
		pos_x: 2076,
		pos_y: 1272,
		scale: 5.25,
	},

	de_coast: {
		pos_x: -3028,
		pos_y: 4122,
		scale: 5.5,
	},

	de_dust: {
		pos_x: -2850,
		pos_y: 4073,
		scale: 6,
		rotate: 1,
		zoom: 1.3
	},

	de_dust2: {
		simpleradar: true,
		transparent: true,

		pos_x: -2476,
		pos_y: 3239,
		scale: 4.4,
		rotate: 1,
		zoom: 1.1,
		inset_left: 0,
		inset_top: 0,
		inset_right: 0,
		inset_bottom: 0,
	},

	de_elysion: {
		pos_x: -1192,
		pos_y: 1096,
		scale: 2.59,
	},

	de_empire: {
		pos_x: -2165,
		pos_y: 2000,
		scale: 4.5,
		rotate: 0,
		zoom: 1.6,
	},

	de_engage: {
		pos_x: -3530,
		pos_y: 2976,
		scale: 5.77,
	},

	de_facade: {
		pos_x: -90,
		pos_y: 5659,
		scale: 6,
	},

	de_guard: {
		pos_x: -1768,
		pos_y: 1648,
		scale: 4.02,
	},

	de_gwalior: {
		pos_x: -1145,
		pos_y: 2688,
		scale: 5,
	},

	de_inferno: {
		simpleradar: true,
		transparent: true,

		pos_x: -2087,
		pos_y: 3870,
		scale: 4.9,
	},

	de_lake: {
		pos_x: 1200,
		pos_y: -700,
		scale: 5.2,
		rotate: 0,
		zoom: 0,
	},

	de_lite: {
		pos_x: -2012,
		pos_y: 2928,
		scale: 5,
	},

	de_log: {
		pos_x: -411,
		pos_y: 759,
		scale: 6.5,
	},

	de_marquis: {
		pos_x: -1877,
		pos_y: 3199,
		scale: 5,
		rotate: 0,
		zoom: 1,
	},

	de_mikla: {
		pos_x: 711,
		pos_y: 2383,
		scale: 4.1,
		zoom: 1.3,
	},

	de_mirage: {
		simpleradar: true,
		transparent: true,

		pos_x: -3230,
		pos_y: 1713,
		scale: 5,
		rotate: 0,
		zoom: 0,

		inset_left: 0.135,
		inset_top: 0.08,
		inset_right: 0.105,
		inset_bottom: 0.08,
	},

	de_mist: {
		pos_x: -5150,
		pos_y: 2080,
		scale: 4.8,
	},

	de_mutiny: {
		pos_x: -8299,
		pos_y: -1312,
		scale: 4.93,
	},

	de_nuke: {
		simpleradar: true,
		transparent: true,

		pos_x: -3453,
		pos_y: 2887,
		scale: 7,

		sections: {
			default: { max: 10000, min: -495 },
			lower: { max: -495, min: -10000 },
		},

		inset_left: 0.33,
		inset_top: 0.2,
		inset_right: 0.2,
		inset_bottom: 0.2,
	},

	de_overgrown: {
		pos_x: -3376,
		pos_y: 5563,
		scale: 7,
	},

	de_overpass: {
		simpleradar: true,
		transparent: true,

		pos_x: -4831,
		pos_y: 1781,
		scale: 5.2,
		rotate: 0,
		zoom: 0,
	},

	de_rails: {
		pos_x: -2199,
		pos_y: 2874,
		scale: 4.5,
	},

	de_resort: {
		pos_x: -506,
		pos_y: 2713,
		scale: 5.5,
	},

	de_royal: {
		pos_x: -2343,
		pos_y: 2644,
		scale: 4,
		rotate: 0,
		zoom: 1.3,
	},

	de_ruby: {
		pos_x: -1079,
		pos_y: 3093,
		scale: 4.5,
	},

	de_ruins: {
		pos_x: -2443,
		pos_y: 2485,
		scale: 6.25,
		rotate: 1,
		zoom: 2.5,
	},

	de_safehouse: {
		pos_x: -240,
		pos_y: 2650,
		scale: 4.52,
	},

	de_santorini: {
		transparent: true,

		pos_x: -2135,
		pos_y: 1400,
		scale: 4,
	},

	de_seaside: {
		pos_x: -4161,
		pos_y: 3680,
		scale: 7,
		rotate: 0,
		zoom: 1.5,
	},

	de_season: {
		pos_x: -1003,
		pos_y: 2521,
		scale: 5,
		zoom: 1,
	},

	de_shipped: {
		pos_x: -2432,
		pos_y: 2663,
		scale: 5.8,
		rotate: 0,
	},

	de_shortdust: {
		pos_x: -2318,
		pos_y: 2337,
		scale: 3.6,
	},

	de_shortnuke: {
		pos_x: -3453,
		pos_y: 2887,
		scale: 7,

		inset_left: 0.4,
		inset_top: 0.24,
		inset_right: 0.2,
		inset_bottom: 0.25,
	},

	de_shorttrain: {
		pos_x: -2477,
		pos_y: 2392,
		scale: 4.7,
	},

	de_stmarc: {
		pos_x: -9383,
		pos_y: 9099,
		scale: 4,
	},

	de_studio: {
		pos_x: -3248,
		pos_y: 2968,
		scale: 6.17,
	},

	de_subzero: {
		pos_x: -2438,
		pos_y: 3690,
		scale: 5,
		zoom: 1.3,
	},

	de_sugarcane: {
		pos_x: -4015,
		pos_y: 2000,
		scale: 4.25,
	},

	de_swamp: {
		pos_x: -2600,
		pos_y: 3906,
		scale: 6,
	},

	de_thrill: {
		pos_x: -3276,
		pos_y: 2973,
		scale: 5.5,
	},

	de_train: {
		simpleradar: true,
		transparent: true,

		pos_x: -2477,
		pos_y: 2392,
		scale: 4.7,
	},

	de_tulip: {
		pos_x: 3402,
		pos_y: 5583,
		scale: 5.5,
	},

	de_vertigo: {
		simpleradar: true,
		transparent: true,

		pos_x: -3168,
		pos_y: 1762,
		scale: 4,

		sections: {
			default: { max: 20000, min: 11700 },
			lower: { max: 11700, min: -10000 },
		},

		inset_left: 0.1,
		inset_top: 0.1,
		inset_right: 0.2,
		inset_bottom: 0.15,
	},

	de_zoo: {
		pos_x: -2435,
		pos_y: 6116,
		scale: 7,
	},

	dz_blacksite: {
		pos_x: -8604,
		pos_y: 8804,
		scale: 17,
	},

	dz_frostbite: {
		pos_x: -8574,
		pos_y: 8787,
		scale: 17,
	},

	dz_junglety: {
		pos_x: -8504,
		pos_y: 8741,
		scale: 17,
	},

	dz_sirocco: {
		pos_x: -8604,
		pos_y: 8804,
		scale: 17,
	},

	gd_bank: {
		pos_x: -2000,
		pos_y: 1493,
		scale: 4,
		rotate: 0,
		zoom: 0,
	},

	gd_cbble: {
		transparent: true,

		pos_x: -3840,
		pos_y: 3072,
		scale: 6,
	},

	gd_crashsite: {
		pos_x: -2212,
		pos_y: 1437,
		scale: 3.5,
		rotate: 0,
		zoom: 0,
	},

	gd_lake: {
		pos_x: 1200,
		pos_y: -700,
		scale: 5.2,
		rotate: 0,
		zoom: 0,
	},

	gd_lunacy: {
		pos_x: -1536,
		pos_y: 1536,
		scale: 3,
		zoom: 1,
	},

	gd_rialto: {
		pos_x: -1260,
		pos_y: 1836,
		scale: 3,
	},

	training1: {
		pos_x: -2510,
		pos_y: 2000,
		scale: 5,
	},
}
