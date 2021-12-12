import randomStreetView from 'random-streetview';
import { translateToPolygonsFromCodes } from './PolygonUtils';

/*  *
    * Gets the score for given distance
    * @param {number} distance - Distance(in km) of user's guess from the location.
    * @param {number} maxDistance - Max. distance(in km) to be scored. */
export const getScore = (distance, maxDistance) => {
    let deadzone = 30;
    let maxPoints = 5000;
    let a = maxPoints/Math.pow(maxDistance, 2);

    if(distance < deadzone)
        return maxPoints;
    else if(distance < maxDistance)
        return (-1*a) * Math.pow(distance, 2) + maxPoints;
    else
        return 0;
}

// distance formula for given longtitute and latitude
export function calculateDistance(lat1,
    lat2, lon1, lon2)
{
lon1 =  lon1 * Math.PI / 180;
lon2 = lon2 * Math.PI / 180;
lat1 = lat1 * Math.PI / 180;
lat2 = lat2 * Math.PI / 180;

let dlon = lon2 - lon1;
let dlat = lat2 - lat1;
let a = Math.pow(Math.sin(dlat / 2), 2)
+ Math.cos(lat1) * Math.cos(lat2)
* Math.pow(Math.sin(dlon / 2),2);   
let c = 2 * Math.asin(Math.sqrt(a));
// Radius of earth in kilometers R = 6371. Use 3956
// for miles
let r = 6371;
// calculate the result
return(c * r);
};


export async function generateRandomStreetViewLocations(rounds,countryCodeArray,enablePolygon) {

    if(enablePolygon){
        await randomStreetView.setParameters({
            type: "sv",
            polygon: translateToPolygonsFromCodes(countryCodeArray)
            // google: 
            
          });
    }
    else {
        await randomStreetView.setParameters({
            type: "sv",    
          });
    }


      const value = await randomStreetView.getRandomLocations(rounds);
      const returnedLocations = value.map((location) => {
          return { lat: location[0], lng: location[1] }
        });
      return returnedLocations;
      };
    