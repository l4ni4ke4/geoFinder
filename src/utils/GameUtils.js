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

