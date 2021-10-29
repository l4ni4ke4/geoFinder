
export const calculatePoints = (distance, maxDistance) => {
    let deadzone = 30;
    let maxPoints = 5000;
    let a = maxPoints/Math.pow(maxDistance, 2);

    if(distance < deadzone)
        return maxPoints;
    else if(distance < maxDistance)
        return a*Math.pow(distance, 2) + maxPoints;
    else
        return 0;
}

