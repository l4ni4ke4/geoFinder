import {calculateDistance} from '../src/utils/GameUtils'

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