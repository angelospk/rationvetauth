export const CATTLE_VALUES = {
    beef: {
        "maintenance": {
            "DMI": [2.0, 2.5], "CP%": 8, "ME": 2.3,
            "Calcium%": 0.3, "Phosphorus%": 0.2, "Magnesium%": 0.12, "VitaminA": 1500, "VitaminD": 200, "VitaminE": 50
        },
        "growth_light": {
            "DMI": [2.5, 3.0], "CP%": 11, "ME": 2.6,
            "Calcium%": 0.5, "Phosphorus%": 0.3, "Magnesium%": 0.15, "VitaminA": 1800, "VitaminD": 250, "VitaminE": 70
        },
        "growth_rapid": {
            "DMI": [3.0, 3.5], "CP%": 13, "ME": 2.9,
            "Calcium%": 0.6, "Phosphorus%": 0.35, "Magnesium%": 0.18, "VitaminA": 2000, "VitaminD": 300, "VitaminE": 90
        },
        "finishing": {
            "DMI": [2.5, 3.0], "CP%": 12, "ME": 3.1,
            "Calcium%": 0.6, "Phosphorus%": 0.32, "Magnesium%": 0.17, "VitaminA": 1900, "VitaminD": 275, "VitaminE": 80
        }
    },
    dairy: {
        "dry": {
            "DMI": [2.0, 2.5], "CP%": 13, "ME": 2.5,
            "Calcium%": 0.6, "Phosphorus%": 0.35, "Magnesium%": 0.25, "VitaminA": 2500, "VitaminD": 400, "VitaminE": 200
        },
        "early_lactation": {
            "DMI": [3.5, 4.5], "CP%": 17, "ME": 3.0,
            "Calcium%": 0.8, "Phosphorus%": 0.4, "Magnesium%": 0.28, "VitaminA": 3000, "VitaminD": 500, "VitaminE": 500
        },
        "mid_late_lactation": {
            "DMI": [3.0, 4.0], "CP%": 15, "ME": 2.8,
            "Calcium%": 0.7, "Phosphorus%": 0.38, "Magnesium%": 0.26, "VitaminA": 2700, "VitaminD": 450, "VitaminE": 350
        },
        "peak": {
            "DMI": [4.5, 5.5], "CP%": 18, "ME": 3.3,
            "Calcium%": 0.9, "Phosphorus%": 0.42, "Magnesium%": 0.30, "VitaminA": 3200, "VitaminD": 550, "VitaminE": 600
        }
    }
};

export const GOAT_VALUES = {
    "meat": {
        "kid": {
            "DMI": [2.5, 3.0], "CP": 16, "ME": 2.9,
            "Calcium": 0.9, "Phosphorus": 0.4, "Lysine": 0.8,
            "Methionine": 0.3, "Threonine": 0.5,
            "VitaminA": 2000, "VitaminD": 300, "VitaminE": 50
        },
        "growing": {
            "DMI": [2.8, 3.2], "CP": 14, "ME": 2.7,
            "Calcium": 0.8, "Phosphorus": 0.35, "Lysine": 0.7,
            "Methionine": 0.25, "Threonine": 0.4,
            "VitaminA": 1800, "VitaminD": 250, "VitaminE": 40
        },
        "mature": {
            "DMI": [2.0, 2.5], "CP": 12, "ME": 2.4,
            "Calcium": 0.6, "Phosphorus": 0.3, "Lysine": 0.6,
            "Methionine": 0.2, "Threonine": 0.3,
            "VitaminA": 1500, "VitaminD": 200, "VitaminE": 30
        }
    },
    "dairy": {
        "lactating": {
            "DMI": [3.5, 4.0], "CP": 18, "ME": 3.2,
            "Calcium": 1.0, "Phosphorus": 0.45, "Lysine": 1.0,
            "Methionine": 0.4, "Threonine": 0.7,
            "VitaminA": 2500, "VitaminD": 400, "VitaminE": 80
        },
        "dry": {
            "DMI": [2.5, 3.0], "CP": 14, "ME": 2.6,
            "Calcium": 0.8, "Phosphorus": 0.4, "Lysine": 0.7,
            "Methionine": 0.3, "Threonine": 0.5,
            "VitaminA": 2000, "VitaminD": 300, "VitaminE": 50
        }
    }
};
export const  SHEEP_VALUES = {
    "meat": {
        "lamb": {
            "DMI": [2.8, 3.2], "CP": 16, "ME": 3.0,
            "Calcium": 0.8, "Phosphorus": 0.4, "VitaminA": 1800, "VitaminD": 250, "VitaminE": 40
        },
        "growing": {
            "DMI": [2.5, 3.0], "CP": 14, "ME": 2.8,
            "Calcium": 0.7, "Phosphorus": 0.35, "VitaminA": 1600, "VitaminD": 220, "VitaminE": 35
        },
        "mature": {
            "DMI": [2.0, 2.5], "CP": 12, "ME": 2.5,
            "Calcium": 0.6, "Phosphorus": 0.3, "VitaminA": 1400, "VitaminD": 200, "VitaminE": 30
        }
    },
    "wool": {
        "growing": {
            "DMI": [2.6, 3.1], "CP": 15, "ME": 2.9,
            "Calcium": 0.7, "Phosphorus": 0.36, "VitaminA": 1700, "VitaminD": 230, "VitaminE": 38
        },
        "mature": {
            "DMI": [2.1, 2.6], "CP": 12, "ME": 2.6,
            "Calcium": 0.6, "Phosphorus": 0.32, "VitaminA": 1500, "VitaminD": 210, "VitaminE": 33
        }
    },
    "dairy": {
        "lactating": {
            "DMI": [3.0, 3.5], "CP": 17, "ME": 3.1,
            "Calcium": 0.9, "Phosphorus": 0.42, "VitaminA": 2000, "VitaminD": 300, "VitaminE": 45
        },
        "dry": {
            "DMI": [2.3, 2.8], "CP": 13, "ME": 2.7,
            "Calcium": 0.7, "Phosphorus": 0.38, "VitaminA": 1800, "VitaminD": 260, "VitaminE": 40
        }
    }
};


export function swine_feed_requirements (swine_stage){
    const SWINE_VALUES = {
        "nursery": {
            "DMI": 0.6, "CP%": 24, "ME": 3.4, "Lysine%": 1.4,
            "Calcium%": 0.9, "Phosphorus%": 0.8, "VitaminA": 4500, "VitaminD": 450, "VitaminE": 60
        },
        "grower": {
            "DMI": 2.0, "CP%": 18, "ME": 3.3, "Lysine%": 1.0,
            "Calcium%": 0.8, "Phosphorus%": 0.7, "VitaminA": 4000, "VitaminD": 400, "VitaminE": 50
        },
        "finisher": {
            "DMI": 2.7, "CP%": 15, "ME": 3.25, "Lysine%": 0.8,
            "Calcium%": 0.65, "Phosphorus%": 0.6, "VitaminA": 3500, "VitaminD": 350, "VitaminE": 40
        },
        "gestation": {
            "DMI": 2.3, "CP%": 12.5, "ME": 3.2, "Lysine%": 0.6,
            "Calcium%": 0.75, "Phosphorus%": 0.65, "VitaminA": 3800, "VitaminD": 375, "VitaminE": 45
        },
        "lactation": {
            "DMI": 4.5, "CP%": 16.5, "ME": 3.35, "Lysine%": 1.1,
            "Calcium%": 1.0, "Phosphorus%": 0.8, "VitaminA": 4200, "VitaminD": 420, "VitaminE": 55
        }
    }  
let stage_values = SWINE_VALUES[swine_stage]
 let    dmi = stage_values["DMI"]
 let    cp_percent = stage_values["CP%"]
 let    cp = dmi * cp_percent / 100
 let    me = dmi * stage_values["ME"]
 let    lysine = dmi * stage_values["Lysine%"]
 let    calcium = dmi * stage_values["Calcium%"]
 let    phosphorus = dmi * stage_values["Phosphorus%"]
 let    vitamin_a = stage_values["VitaminA"]
 let    vitamin_d = stage_values["VitaminD"]
 let    vitamin_e = stage_values["VitaminE"]
 return {dmi, cp, me, lysine, calcium, phosphorus, vitamin_a, vitamin_d, vitamin_e}
}



export function poultry_feed_requirements(poultry_type:string, stage:string){
// # Constants for DMI, CP, ME, Minerals, and Vitamins based on stage and poultry type
const POULTRY_VALUES = {
    "broilers": {
        "starter": {
            "DMI": 50, "CP%": 23, "ME": 3.0,
            "Calcium%": 1.0, "Phosphorus%": 0.45, "VitaminA": 1500, "VitaminD": 200, "VitaminE": 30
        },
        "grower": {
            "DMI": 100, "CP%": 21, "ME": 3.15,
            "Calcium%": 0.9, "Phosphorus%": 0.4, "VitaminA": 1300, "VitaminD": 180, "VitaminE": 25
        },
        "finisher": {
            "DMI": 150, "CP%": 20, "ME": 3.2,
            "Calcium%": 0.85, "Phosphorus%": 0.38, "VitaminA": 1200, "VitaminD": 150, "VitaminE": 20
        }
    },
    "layers": {
        "starter": {
            "DMI": 50, "CP%": 18, "ME": 2.9,
            "Calcium%": 1.1, "Phosphorus%": 0.45, "VitaminA": 1600, "VitaminD": 220, "VitaminE": 35
        },
        "grower": {
            "DMI": 100, "CP%": 16, "ME": 2.85,
            "Calcium%": 1.0, "Phosphorus%": 0.4, "VitaminA": 1400, "VitaminD": 200, "VitaminE": 30
        },
        "layer": {
            "DMI": 110, "CP%": 16.5, "ME": 2.8,
            "Calcium%": 3.8, "Phosphorus%": 0.38, "VitaminA": 1250, "VitaminD": 180, "VitaminE": 25
        }
    }
}

let stage_values = POULTRY_VALUES[poultry_type][stage]

// Extract values
let dmi = stage_values["DMI"]
let cp_percent = stage_values["CP%"]
let cp = dmi * cp_percent / 100
let me = dmi * stage_values["ME"]

// Calculate Minerals and Vitamins
let calcium = dmi * stage_values["Calcium%"]
let phosphorus = dmi * stage_values["Phosphorus%"]
let vitamin_a = stage_values["VitaminA"]
let vitamin_d = stage_values["VitaminD"]
let vitamin_e = stage_values["VitaminE"]

return {dmi, cp, me, calcium, phosphorus, vitamin_a, vitamin_d, vitamin_e}


}