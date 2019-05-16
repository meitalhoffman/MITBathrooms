/**
 * Utility class to convert between geo-locations and Cartesian screen coordinates.
 * Can be used with a bounding box defining the map section.
 *
 * (c) 2011 Till Nagel, tillnagel.com
 * Modified by Nina Lutz 
 * Modified for JavaScript by Meital Hoffman
 */
class MercatorMap {

    /*
     * Creates a new MercatorMap with dimensions and bounding box to convert between geo-locations and screen coordinates.
     * @param mapScreenWidth Horizontal dimension of this map, in pixels.
     * @param mapScreenHeight Vertical dimension of this map, in pixels.
     * @param topLatitude Northern border of this map, in degrees.
     * @param bottomLatitude Southern border of this map, in degrees.
     * @param leftLongitude Western border of this map, in degrees.
     * @param rightLongitude Eastern border of this map, in degrees.
     */
    constructor(mapScreenWidth, mapScreenHeight, topLatitude, bottomLatitude, leftLongitude, rightLongitude, rotation) {
        this.mapScreenWidth = mapScreenWidth;
        this.mapScreenHeight = mapScreenHeight;
        this.topLatitude = topLatitude;
        this.bottomLatitude = bottomLatitude;
        this.leftLongitude = leftLongitude;
        this.rightLongitude = rightLongitude;

        this.topLatitudeRelative = getScreenYRelative(topLatitude);
        this.bottomLatitudeRelative = getScreenYRelative(bottomLatitude);
        this.leftLongitudeRadians = radians(leftLongitude);
        this.rightLongitudeRadians = radians(rightLongitude);

        this.rotation = rotation;

        this.lg_width = mapScreenHeight * sin(abs(radians(rotation))) + mapScreenWidth * cos(abs(radians(rotation)));
        this.lg_height = mapScreenWidth * sin(abs(radians(rotation))) + mapScreenHeight * cos(abs(radians(rotation)));
    }
    getScreenY(latitudeInDegrees) {
        return this.lg_height * (getScreenYRelative(latitudeInDegrees) - this.topLatitudeRelative) / (this.bottomLatitudeRelative - this.topLatitudeRelative);
    }

    getScreenX(longitudeInDegrees) {
        let longitudeInRadians = radians(longitudeInDegrees);
        return this.lg_width * (longitudeInRadians - this.leftLongitudeRadians) / (this.rightLongitudeRadians - this.leftLongitudeRadians);
    }

    //   /*
    //    * Projects the geo location to Cartesian coordinates, using the Mercator projection.
    //    *
    //    * @param geoLocation Geo location with (latitude, longitude) in degrees.
    //    * @returns The screen coordinates with (x, y).
    //    */
    getScreenLocation(geoLocation) {
        let latitudeInDegrees = geoLocation.x;
        let longitudeInDegrees = geoLocation.y;

        let loc = createVector(this.getScreenX(longitudeInDegrees), this.getScreenY(latitudeInDegrees));
        loc.x -= this.lg_width / 2;
        loc.y -= this.lg_height / 2;
        loc.rotate(radians(this.rotation));
        loc.x += this.mapScreenWidth / 2;
        loc.y += this.mapScreenHeight / 2;

        return loc;
    }

     getRadians(deg) {
        return deg * PI / 180;
    }

     getDegrees(rad) {
        return rad * 180 / PI;
    }


     getGeo(loc) {
        var screen = createVector(loc.x, loc.y);
        screen.x -= this.mapScreenWidth / 2;
        screen.y -= this.mapScreenHeight / 2;
        screen.rotate(-radians(this.rotation));
        screen.x += this.lg_width / 2;
        screen.y += this.lg_height / 2;
        return createVector(getLatitude(screen.y), getLongitude(screen.x));


    }

     getLatitude(screenY) {
        //return topLatitude + (360f / PI) * (atan(exp(getLatitudeRelative(screenY))) - PI / 4);
        return this.topLatitude + (bottomLatitude - this.topLatitude) * screenY / lg_height;
    }

     getLongitude(screenX) {
        return leftLongitude + (rightLongitude - leftLongitude) * screenX / this.lg_width;
    }

    //additional utilities by Anisha Nakagawa, modified by Nina Lutz
     Haversine(p1, p2) {
        let R = 6371000; // meters
        let phi1 = radians(p1.x); // convert to radians
        let phi2 = radians(p2.x); // convert to radians
        let deltaPhi = radians(p2.x - p1.x);
        let deltaLambda = radians(p2.y - p1.y);

        let a = sin(deltaPhi / 2) * sin(deltaPhi / 2) + cos(phi1) * cos(phi2) * sin(deltaLambda / 2) * sin(deltaLambda / 2);
        let c = 2 * atan2(sqrt(a), sqrt(1 - a));

        let d = R * c;
        return d;
    }

    // Find an intermediate point at a given fraction between two points
    // Smaller fractions are closer to p1
     intermediate(p1, p2, fraction) {
        let R = 6371000; // meters

        let angularDist = Haversine(p1, p2) / R;
        let phi1 = radians(p1.x); // convert to radians
        let phi2 = radians(p2.x); // convert to radians
        let lambda1 = radians(p1.y); // convert to radians
        let lambda2 = radians(p2.y); // convert to radians

        let a = sin((1 - fraction) * angularDist) / sin(angularDist);
        let b = sin(fraction * angularDist) / sin(angularDist);
        let x = (a * cos(phi1) * cos(lambda1)) + (b * cos(phi2) * cos(lambda2));
        let y = (a * cos(phi1) * sin(lambda1)) + (b * cos(phi2) * sin(lambda2));
        let z = (a * sin(phi1)) + (b * sin(phi2));

        let phiNew = atan2(z, sqrt(x * x + y * y));
        let lambdaNew = atan2(y, x);

        let xNew = degrees(phiNew);
        let yNew = degrees(lambdaNew);

        return createVector(xNew, yNew);

    }

    // Find a point a distance (in meters away) in the direction given by the bearing
    // from the point p1
     endpoint(p1, distance, bearing) {
        let R = 6371000; // meters

        let angularDist = distance / R;
        let phi1 = radians(p1.x); // convert to radians
        let lambda1 = radians(p1.y); // convert to radians

        bearing = radians(bearing);

        let phi2 = asin(sin(phi1) * cos(angularDist) + cos(phi1) * sin(angularDist) * cos(bearing));
        let lambda2 = lambda1 + atan2(sin(bearing) * sin(angularDist) * cos(phi1), cos(angularDist) - sin(phi1) * sin(phi2));


        let xNew = degrees(phi2);
        let yNew = degrees(lambda2);

        return createVector(xNew, yNew);
    }

}