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

export const poultry={
    "Αυγοπαραγωγών / Περίοδος αυγοπαραγωγής (εβδ)": {
      "Food Intake (g/day)": "85-120",
      "18 ως 40": {
        "MEpoultry": 2749,
        "CrudeProtein": 175,
        "Lysine": 8,
  "CrudeFiber": 70,
  "Calcium": 35,
  "Phosphorus": 3.5,
  "Sodium": 1.8
  },
  "41 ως 60": {
  "MEpoultry": 2749,
  "CrudeProtein": 150,
  "Lysine": 7,
  "CrudeFiber": 70,
  "Calcium": 38,
  "Phosphorus": 3.5,
  "Sodium": 1.8
  },
  "61 ως 80": {
  "MEpoultry": 2749,
  "CrudeProtein": 150,
  "Lysine": 7,
  "CrudeFiber": 70,
  "Calcium": 40,
  "Phosphorus": 3.5,
  "Sodium": 1.8
  }},
  "Ανάπτυξη - πάχυνση ορνιθίων / Ηλικία (εβδ)": {
  "0 ως 2": {
  "MEpoultry": 2988,
  "CrudeProtein": 230,
  "Lysine": 13.5,
  "CrudeFiber": 40,
  "Calcium": 10,
  "Phosphorus": 4.5,
  "Sodium": 1.6,
  "Food Intake (g/day)": "10-60"
  },
  "2 ως 5": {
  "MEpoultry": 3107,
  "CrudeProtein": 210,
  "Lysine": 12,
  "CrudeFiber": 40,
  "Calcium": 10,
  "Phosphorus": 4.5,
  "Sodium": 1.6,
  "Food Intake (g/day)": "10-60"
  },
  ">5":  {
  "MEpoultry": 3107,
  "CrudeProtein": 190,
  "Lysine": 12,
  "CrudeFiber": 40,
  "Calcium": 10,
  "Phosphorus": 6,
  "Sodium": 1.8,
  "Food Intake (g/day)": ">150"
  }}}

export const aigoprov={
    "Συντήρηση (ημερήσιες ανάγκες)": {
      "30": {"ΞΟ % ΣΒ": "2,1-2,6", "MJ KET": 956, "CrudeProtein": 60, "Calcium": 2.4, "Phosphorus": 1.6, "Magnesium": 0.35, "Sodium": 0.51},
      "40": {"ΞΟ % ΣΒ": "2,0-2,5", "MJ KET": 1195, "CrudeProtein": 75, "Calcium": 3.2, "Phosphorus": 2.2, "Magnesium": 0.46, "Sodium": 0.68},
      "50": {"ΞΟ % ΣΒ": "1,9-2,4", "MJ KET": 1362, "CrudeProtein": 90, "Calcium": 4.5, "Phosphorus": 3.1, "Magnesium": 0.58, "Sodium": 0.85},
      "60": {"ΞΟ % ΣΒ": "1,8-2,3", "MJ KET": 1554, "CrudeProtein": 105, "Calcium": 5.3, "Phosphorus": 4.4, "Magnesium": 0.69, "Sodium": 1.02},
      "70": {"ΞΟ % ΣΒ": "1,7-2,2", "MJ KET": 1769, "CrudeProtein": 120, "Calcium": 6.2, "Phosphorus": 5.1, "Magnesium": 0.81, "Sodium": 1.19},
      "80": {"ΞΟ % ΣΒ": "1,6-2,1", "MJ KET": 1984, "CrudeProtein": 135, "Calcium": 7.1, "Phosphorus": 5.8, "Magnesium": 0.92, "Sodium": 1.36}
    },
    "Γαλακτοπαραγωγή (/kg γάλακτος)": {
      "6": {"MJ KET": 1004, "CrudeProtein": 115, "Calcium": 6, "Phosphorus": 2.5, "Magnesium": 1, "Sodium": 0.5},
      "7": {"MJ KET": 1123, "CrudeProtein": 130, "Calcium": 6, "Phosphorus": 2.5, "Magnesium": 1, "Sodium": 0.5},
      "8": {"MJ KET": 1243, "CrudeProtein": 145, "Calcium": 6, "Phosphorus": 2.5, "Magnesium": 1, "Sodium": 0.5}
    },
    "Ανάπτυξη και πάχυνση (ανά kg αύξησης ΣΒ)": {
      "20": {"MJ KET": 3896, "CrudeProtein": 340, "Calcium": 16.2, "Phosphorus": 5.8, "Magnesium": 1.8, "Sodium": 1.4},
      "30": {"MJ KET": 4661, "CrudeProtein": 340, "Calcium": 17.8, "Phosphorus": 6.2, "Magnesium": 1.8, "Sodium": 1.4},
      "40": {"MJ KET": 5760, "CrudeProtein": 340, "Calcium": 17.8, "Phosphorus": 6.2, "Magnesium": 1.8, "Sodium": 1.4},
      "50": {"MJ KET": 6405, "CrudeProtein": 340, "Calcium": 19.8, "Phosphorus": 7.2, "Magnesium": 1.8, "Sodium": 1.4},
      "60": {"MJ KET": 7887, "CrudeProtein": 340, "Calcium": 19.8, "Phosphorus": 8.4, "Magnesium": 1.8, "Sodium": 1.4}
    },
    "Εγκυμοσύνη (τελευταίες βδομάδες)": {
      "ένα έμβρυο": {
        "40": {"MJ KET": 1649, "CrudeProtein": 120, "Calcium": 5.3, "Phosphorus": 3.1, "Magnesium": 0.64},
        "50": {"MJ KET": 1912, "CrudeProtein": 125, "Calcium": 6.6, "Phosphorus": 4, "Magnesium": 0.76},
        "60": {"MJ KET": 2223, "CrudeProtein": 130, "Calcium": 7.7, "Phosphorus": 5.4, "Magnesium": 0.89},
        "70": {"MJ KET": 2462, "CrudeProtein": 135, "Calcium": 9, "Phosphorus": 6.3, "Magnesium": 1.05},
        "80": {"MJ KET": 2749, "CrudeProtein": 145, "Calcium": 10.3, "Phosphorus": 7.2, "Magnesium": 1.19}
      },
      "δύο έμβρυα": {
        "40": {"MJ KET": 2055, "CrudeProtein": 131, "Calcium": 6.3, "Phosphorus": 3.6, "Magnesium": 0.72},
        "50": {"MJ KET": 2055, "CrudeProtein": 139, "Calcium": 7.7, "Phosphorus": 4.6, "Magnesium": 0.84},
        "60": {"MJ KET": 2055, "CrudeProtein": 147, "Calcium": 8.9, "Phosphorus": 6, "Magnesium": 0.98},
        "70": {"MJ KET": 2055, "CrudeProtein": 157, "Calcium": 10.5, "Phosphorus": 7, "Magnesium": 1.16},
        "80": {"MJ KET": 2055, "CrudeProtein": 171, "Calcium": 12, "Phosphorus": 8, "Magnesium": 1.32}
      }
    }
  }
  
export const booeidh={"Συντήρηση (ημερήσιες ανάγκες)": {
    250: {"MJ KET": 4541, "CrudeProtein": 260, "Calcium": 8, "Phosphorus": 7, "Magnesium": 3.8, "Sodium": 4.3},
    300: {"MJ KET": 5067, "CrudeProtein": 300, "Calcium": 10, "Phosphorus": 9, "Magnesium": 4.5, "Sodium": 5.1},
    350: {"MJ KET": 5832, "CrudeProtein": 340, "Calcium": 12, "Phosphorus": 14, "Magnesium": 5.3, "Sodium": 6},
    400: {"MJ KET": 6334, "CrudeProtein": 370, "Calcium": 14, "Phosphorus": 19, "Magnesium": 6, "Sodium": 6.8},
    450: {"MJ KET": 6836, "CrudeProtein": 400, "Calcium": 16, "Phosphorus": 22, "Magnesium": 6.8, "Sodium": 7.7},
    500: {"MJ KET": 7409, "CrudeProtein": 430, "Calcium": 18, "Phosphorus": 26, "Magnesium": 7.5, "Sodium": 8.5},
    550: {"MJ KET": 7983, "CrudeProtein": 460, "Calcium": 20, "Phosphorus": 29, "Magnesium": 8.3, "Sodium": 9.3},
    600: {"MJ KET": 8509, "CrudeProtein": 490, "Calcium": 22, "Phosphorus": 32, "Magnesium": 9.1, "Sodium": 10.1},
    650: {"MJ KET": 9321, "CrudeProtein": 520, "Calcium": 24, "Phosphorus": 35, "Magnesium": 10, "Sodium": 11},
},
"Παραγωγή (συντήρηση και ανάπτυξη 1kg/ημ)": {
    200: {"MJ KET": 5832, "CrudeProtein": 370, "Calcium": 30, "Phosphorus": 15, "Magnesium": 5, "Sodium": 4.8},
    250: {"MJ KET": 6836, "CrudeProtein": 400, "Calcium": 32, "Phosphorus": 18, "Magnesium": 5.8, "Sodium": 5.7},
    300: {"MJ KET": 10636, "CrudeProtein": 470, "Calcium": 33, "Phosphorus": 20, "Magnesium": 6.5, "Sodium": 6.5},
    350: {"MJ KET": 11663, "CrudeProtein": 530, "Calcium": 35, "Phosphorus": 25, "Magnesium": 7.2, "Sodium": 7.4},
    400: {"MJ KET": 12667, "CrudeProtein": 550, "Calcium": 37, "Phosphorus": 29, "Magnesium": 8, "Sodium": 8.2},
    450: {"MJ KET": 13432, "CrudeProtein": 570, "Calcium": 37, "Phosphorus": 29, "Magnesium": 8.7, "Sodium": 9.1},
    500: {"MJ KET": 14699, "CrudeProtein": 600, "Calcium": 37, "Phosphorus": 29, "Magnesium": 8.7, "Sodium": 9.9},
    }
    }

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