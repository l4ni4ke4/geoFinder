import { getAllCountries } from "./Polygons";

/**
 * Translate enums into Country Polygons
 * @param {Object[]} num_arr Array of numbers that includes enums.
 * @returns {Object[]} Merged Polygons
 */
export function translateToPolygonsFromEnums(num_arr){
    var Polygons = [];
    for(var i = 0; i < num_arr.length; i++){
        Polygons.push(getAllCountries()[num_arr[i]].polygons);
    }
    return Polygons;
}

/**
 * Translate country codes into Country Polygons
 * @param {Object[]} code_arr - Array of country codes (strings).
 * @returns {Object[]} Merged Polygons
 */
export function translateToPolygonsFromCodes(code_arr){
    var Polygons = [];
    for(var i = 0; i < code_arr.length; i++){
        Polygons.push(getAllCountries().find((c => c.code === code_arr[i])).polygons);
    }
    return Polygons;
}
