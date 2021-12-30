import {translateToPolygonsFromCodes} from '../src/utils/PolygonUtils'
import {generateRandomStreetViewLocations} from '../src/utils/GameUtils'

const polygonTrue = [[42,26], [36,26], [36,36], [37,45], [40,45], [42,42]];

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
    try{
        var randomLocs = generateRandomStreetViewLocations(noRounds, 'TR', true);
    }
    catch{

    }
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
        expect(boolX && boolY).toBeTruthy();
    }
})