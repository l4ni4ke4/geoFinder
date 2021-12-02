import { getAllCountries } from "./Polygons";

let enums = []
let enumsCreated = 0;

function createEnums(){
    for (var i = 0; i < getAllCountries().length; i++) {
        var e = {country:getAllCountries()[i].country, value:i};
        enums.push(e);
    }
    enumsCreated = 1;
}

export function getEnums(){
    if(enumsCreated === 0){
        createEnums();
    }
    return enums;
}

/**
 * Translate enums into Country Polygons
 * @param {Object[]} num_arr Array of numbers that includes enums.
 * @returns {Object[]} Merged Polygons
 */
export function translateToPolygons(num_arr){
    var Polygons = [];
    for(var i = 0; i < num_arr.length; i++){
        //var countryName = enums.find(e => e.value === num_arr[i]).country;
        //Polygons.push(getAllCountries().find((c => c.country === countryName)).polygons);
        Polygons.push(getAllCountries()[num_arr[i]].polygons);
    }
    return Polygons;
}