
function CalculatePoints(distance, maxDistance, maxPoints){
    deadzone = 30;
    maxPoints = 5000;
    a = maxPoints/Math.pow(maxDistance, 2);

    if(distance < deadzone)
        return maxPoints;
    else if(distance < maxDistance)
        return a*Math.pow(distance, 2) + maxPoints;
    else
        return 0;
}

