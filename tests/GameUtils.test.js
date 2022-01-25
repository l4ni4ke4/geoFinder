import {getScore, calculateDistance, generateRandomStreetViewLocations} from '../src/utils/GameUtils'
import {translateToPolygonsFromCodes} from '../src/utils/PolygonUtils'

//------------------------------ DISTANCE CALCULATION TESTS ------------------------------\\
test('66N 1E -- 60N 1E ~= 668.77 km', () => {
    //Distance calculated from Google Earth results to be 668.77 km
    //The expected error in the distance is %0.5
    var distance = calculateDistance(66, 60, 1, 1)
    expect(distance).toBeLessThanOrEqual(668.77 * 1.005)                    //672.11 km
    expect(distance).toBeGreaterThanOrEqual(668.77 * 0.995)                 //665.42 km
  });

test('66N 1E -- 66N 11E ~= 453.56 km', () => {
    //Distance calculated from Google Earth results to be 453.56 km
    //The expected error in the distance is %0.5
    var distance = calculateDistance(66, 66, 1, 11)
    expect(distance).toBeLessThanOrEqual(453.56 * 1.005)                    //455.82 km
    expect(distance).toBeGreaterThanOrEqual(453.56 * 0.995)                 //451.29 km
});

test('52N 10W -- 60N 10E ~= 1523.31 km', () => {
    //Distance calculated from Google Earth results to be 1523.31 km
    //The expected error in the distance is %0.5
    var distance = calculateDistance(52, 60, -10, 10)
    expect(distance).toBeLessThanOrEqual(1523.31 * 1.005)                    //1530.92 km
    expect(distance).toBeGreaterThanOrEqual(1523.31 * 0.995)                 //1515.69 km
});
//----------------------------------------------------------------------------------------\\


//-------------------------------- SCORING FUNCTION TESTS --------------------------------\\
test('Distance 3700 - 575 Points', () => {
    //Default maxDistance is 5000
    var score = getScore(3700, 5000)
    expect(score).toBe(575)
});

test('Distance 5001 - 0 Points', () => {
    //Default maxDistance is 5000
    var score = getScore(5001, 5000)
    expect(score).toBe(0)
});

test('Distance 5 - 5000 Points', () => {
    //Default maxDistance is 5000
    var score = getScore(5, 5000)
    expect(score).toBe(5000)
});

test('Distance 523 - 4075 Points', () => {
    //Default maxDistance is 5000
    var score = getScore(523, 5000)
    expect(score).toBe(4075)
});

test('Distance 2075 - 1920 Points', () => {
    //Default maxDistance is 5000
    var score = getScore(2075, 5000)
    expect(score).toBe(1920)
});
//----------------------------------------------------------------------------------------\\


//-------------------------------- RANDOM POLYGON CORRECTNESS TEST --------------------------------\\
const polygonTrue = [[42,26], [36,26], [36,36], [37,45], [40,45], [42,42]];

//Tests if the returned random locations are inside of the choosen polygon.
//Assumes the polygon is convex.
//Tests only 1 polygon, not multiple
test('Are returned locations are inside of the defined polygon ?', () => {
    var polygon = translateToPolygonsFromCodes(['TR']);
    expect(polygon[0]).toEqual(polygonTrue);

    var leftmost = ((polygon[0])[0])[1];;
    for(var i = 0; i < polygon[0].length; i++){
        var temp = ((polygon[0])[i])[1];
        if(leftmost > temp)
            leftmost = temp;
    }

    var rightmost = ((polygon[0])[0])[1];
    for(var i = 0; i < polygon[0].length; i++){
        var temp = ((polygon[0])[i])[1];
        if(rightmost < temp)
            rightmost = temp;
    }

    var top = ((polygon[0])[0])[0];
    for(var i = 0; i < polygon[0].length; i++){
        var temp = ((polygon[0])[i])[0];
        if(top < temp)
            top = temp;
    }

    var bottom = ((polygon[0])[0])[0];
    for(var i = 0; i < polygon[0].length; i++){
        var temp = ((polygon[0])[i])[0];
        if(bottom > temp)
            bottom = temp;
    }
    
    expect(leftmost).toBe(26);
    expect(rightmost).toBe(45);
    expect(top).toBe(42);
    expect(bottom).toBe(36);

    var noRounds = 5;
    var randomLocs = generateRandomStreetViewLocations(noRounds, ['TR'], true);
    var boolX;
    var boolY;
    for(var i = 0; i < randomLocs.length; i++){
        if(randomLocs[i]['lng'] > leftmost){
            if(randomLocs[i]['lng'] < rightmost){
                boolX = true;
            }
            else boolX = false;
        }
        else boolX = false;

        if(randomLocs[i]['lat'] < top){
            if(randomLocs[i]['lat'] > bottom){
                boolY = true;
            }
            else boolY = false;
        }
        else boolY = false;
        expect(boolX && boolY).toBeTruthy();    //Will fail if the point is outside of the polygon
    }
})
//-------------------------------------------------------------------------------------------------\\