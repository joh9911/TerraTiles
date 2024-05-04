export enum Objective_Event {
    DESERTSIZE = "desert_size",
    GRASSSIZE = "grass_size",
    FIRESIZE = "fire_size",
    ROCKSIZE = "rock_size",
    SPACESIZE = "space_size",
    COMETSIZE = "comet_size",
    WUPSIZE = "w_up_size",
    WDOWNSIZE = "w_down_size",
    WUPLEFT = "w_left_size",
    WRIGHTSIZE = "w_right_size",
    DIRTSIZE = "dirt_size",
    HOUSESIZE = "house_size",
    MUDSIZE = "mud_size",
    LANDMADE = "land_made",
    DISEASESIZE = "disease_size",
    NEXTLEVEL = "next_level"
}

export const Objective_mapping: { [key: number]: Objective_Event } = {
    0: Objective_Event.DESERTSIZE,
    1: Objective_Event.GRASSSIZE,
    2: Objective_Event.FIRESIZE,
    3: Objective_Event.ROCKSIZE,
    4: Objective_Event.SPACESIZE,
    5: Objective_Event.COMETSIZE,
    6: Objective_Event.WUPSIZE,
    7: Objective_Event.WDOWNSIZE,
    8: Objective_Event.WUPLEFT,
    9: Objective_Event.WRIGHTSIZE,
    10: Objective_Event.DIRTSIZE,
    11: Objective_Event.HOUSESIZE,
    12: Objective_Event.MUDSIZE,
    13: Objective_Event.LANDMADE,
    14: Objective_Event.DISEASESIZE,
    15: Objective_Event.NEXTLEVEL
};