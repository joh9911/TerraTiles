export enum Tiles_string {
    DESERT = "DESERT_TUMBLE",
    GRASS = "GRASS_FLOWER",
    FIRE = "FIRE_WAVE",
    ROCK = "ROCK",
    SPACE = "SPACE",
    COMET = "SPACE_COMET",
    W_UP = "WATER_UP",
    W_DOWN = "WATER_DOWN",
    W_LEFT = "WATER_LEFT",
    W_RIGHT = "WATER_RIGHT",

    DIRT = "DIRT_SPROUT",
    HOUSE = "GRASS_HOUSE",
    MUD = "MUD_WAVE",
    DISEASE = "DISEASE",
}

export const Tiles_index = {
    [Tiles_string.DESERT]: 0,
    [Tiles_string.GRASS]: 1,
    [Tiles_string.FIRE]: 2,
    [Tiles_string.ROCK]: 3,
    [Tiles_string.SPACE]: 4,
    [Tiles_string.COMET]: 5,
    [Tiles_string.W_UP]: 6,
    [Tiles_string.W_DOWN]: 7,
    [Tiles_string.W_LEFT]: 8,
    [Tiles_string.W_RIGHT]: 9,

    [Tiles_string.DIRT]: 10,
    [Tiles_string.HOUSE]: 11,
    [Tiles_string.MUD]: 12,
    [Tiles_string.DISEASE]: 13,
};

export const Tile_manage = {
    [Tiles_string.DESERT]: 0,
    [Tiles_string.DIRT]: 1,
    [Tiles_string.FIRE]: 2,
    [Tiles_string.W_UP]: 3,
    [Tiles_string.ROCK]: 4,
};

// [Tiles_string.DESERT]: 0,
// [Tiles_string.GRASS]: 0,
// [Tiles_string.FIRE]: 0,
// [Tiles_string.ROCK]: 0,
// [Tiles_string.SPACE]: 0,
// [Tiles_string.COMET]: 0,
// [Tiles_string.W_UP]: 0,
// [Tiles_string.W_DOWN]: 0,
// [Tiles_string.W_LEFT]: 0,
// [Tiles_string.W_RIGHT]: 0,

export const TileMatrix = { // 1 indicates we can put the tile on it, 0 indicates we can't
    [Tiles_string.DESERT]: {
        [Tiles_string.DESERT]: 0,
        [Tiles_string.GRASS]: 0,
        [Tiles_string.FIRE]: 0,
        [Tiles_string.ROCK]: 0,
        [Tiles_string.SPACE]: 1,
        [Tiles_string.COMET]: 1,
        [Tiles_string.W_UP]: 0,
        [Tiles_string.W_DOWN]: 0,
        [Tiles_string.W_LEFT]: 0,
        [Tiles_string.W_RIGHT]: 0,
        [Tiles_string.DIRT]: 0,
        [Tiles_string.HOUSE]: 0,
        [Tiles_string.MUD]: 0,
        [Tiles_string.DISEASE]: 0,
    },
    [Tiles_string.DIRT]: {
        [Tiles_string.DESERT]: 1,
        [Tiles_string.GRASS]: 0,
        [Tiles_string.FIRE]: 0,
        [Tiles_string.ROCK]: 0,
        [Tiles_string.SPACE]: 0,
        [Tiles_string.COMET]: 0,
        [Tiles_string.W_UP]: 0,
        [Tiles_string.W_DOWN]: 0,
        [Tiles_string.W_LEFT]: 0,
        [Tiles_string.W_RIGHT]: 0,
        [Tiles_string.DIRT]: 0,
        [Tiles_string.HOUSE]: 0,
        [Tiles_string.MUD]: 0,
        [Tiles_string.DISEASE]: 0,
    },
    [Tiles_string.W_UP]: {
        [Tiles_string.DESERT]: 1,
        [Tiles_string.GRASS]: 1,
        [Tiles_string.FIRE]: 1,
        [Tiles_string.ROCK]: 0,
        [Tiles_string.SPACE]: 0,
        [Tiles_string.COMET]: 0,
        [Tiles_string.W_UP]: 0,
        [Tiles_string.W_DOWN]: 0,
        [Tiles_string.W_LEFT]: 0,
        [Tiles_string.W_RIGHT]: 0,
        [Tiles_string.DIRT]: 1,
        [Tiles_string.HOUSE]: 1,
        [Tiles_string.MUD]: 0,
        [Tiles_string.DISEASE]: 0,

    },
    [Tiles_string.W_DOWN]: {
        [Tiles_string.DESERT]: 1,
        [Tiles_string.GRASS]: 1,
        [Tiles_string.FIRE]: 1,
        [Tiles_string.ROCK]: 0,
        [Tiles_string.SPACE]: 0,
        [Tiles_string.COMET]: 0,
        [Tiles_string.W_UP]: 0,
        [Tiles_string.W_DOWN]: 0,
        [Tiles_string.W_LEFT]: 0,
        [Tiles_string.W_RIGHT]: 0,
        [Tiles_string.DIRT]: 1,
        [Tiles_string.HOUSE]: 1,
        [Tiles_string.MUD]: 0,
        [Tiles_string.DISEASE]: 0,

    },
    [Tiles_string.W_LEFT]: {
        [Tiles_string.DESERT]: 1,
        [Tiles_string.GRASS]: 1,
        [Tiles_string.FIRE]: 1,
        [Tiles_string.ROCK]: 0,
        [Tiles_string.SPACE]: 0,
        [Tiles_string.COMET]: 0,
        [Tiles_string.W_UP]: 0,
        [Tiles_string.W_DOWN]: 0,
        [Tiles_string.W_LEFT]: 0,
        [Tiles_string.W_RIGHT]: 0,
        [Tiles_string.DIRT]: 1,
        [Tiles_string.HOUSE]: 1,
        [Tiles_string.MUD]: 0,
        [Tiles_string.DISEASE]: 0,

    },
    [Tiles_string.W_RIGHT]: {
        [Tiles_string.DESERT]: 1,
        [Tiles_string.GRASS]: 1,
        [Tiles_string.FIRE]: 1,
        [Tiles_string.ROCK]: 0,
        [Tiles_string.SPACE]: 0,
        [Tiles_string.COMET]: 0,
        [Tiles_string.W_UP]: 0,
        [Tiles_string.W_DOWN]: 0,
        [Tiles_string.W_LEFT]: 0,
        [Tiles_string.W_RIGHT]: 0,
        [Tiles_string.DIRT]: 1,
        [Tiles_string.HOUSE]: 1,
        [Tiles_string.MUD]: 0,
        [Tiles_string.DISEASE]: 0,

    },
    [Tiles_string.FIRE]: {
        [Tiles_string.DESERT]: 0,
        [Tiles_string.GRASS]: 1,
        [Tiles_string.FIRE]: 0,
        [Tiles_string.ROCK]: 0,
        [Tiles_string.SPACE]: 0,
        [Tiles_string.COMET]: 0,
        [Tiles_string.W_UP]: 0,
        [Tiles_string.W_DOWN]: 0,
        [Tiles_string.W_LEFT]: 0,
        [Tiles_string.W_RIGHT]: 0,
        [Tiles_string.DIRT]: 0,
        [Tiles_string.HOUSE]: 1,
        [Tiles_string.MUD]: 1,
        [Tiles_string.DISEASE]: 1,        
    },
    [Tiles_string.ROCK]: {
        [Tiles_string.DESERT]: 1,
        [Tiles_string.GRASS]: 1,
        [Tiles_string.FIRE]: 1,
        [Tiles_string.ROCK]: 0,
        [Tiles_string.SPACE]: 0,
        [Tiles_string.COMET]: 0,
        [Tiles_string.W_UP]: 1,
        [Tiles_string.W_DOWN]: 1,
        [Tiles_string.W_LEFT]: 1,
        [Tiles_string.W_RIGHT]: 1,
        [Tiles_string.DIRT]: 1,
        [Tiles_string.HOUSE]: 0,
        [Tiles_string.MUD]: 1,
        [Tiles_string.DISEASE]: 1,
    },
    [Tiles_string.DISEASE]: {
        [Tiles_string.DESERT]: 1,
        [Tiles_string.GRASS]: 1,
        [Tiles_string.FIRE]: 0,
        [Tiles_string.ROCK]: 0,
        [Tiles_string.SPACE]: 0,
        [Tiles_string.COMET]: 0,
        [Tiles_string.W_UP]: 0,
        [Tiles_string.W_DOWN]: 0,
        [Tiles_string.W_LEFT]: 0,
        [Tiles_string.W_RIGHT]: 0,
        [Tiles_string.DIRT]: 1,
        [Tiles_string.HOUSE]: 1,
        [Tiles_string.MUD]: 1,
        [Tiles_string.DISEASE]: 0,
    }
    
};