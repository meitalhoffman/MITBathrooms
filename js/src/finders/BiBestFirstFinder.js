class BiBestFirstFinder{
    /**
     * Bi-direcitional Best-First-Search path-finder.
     * @constructor
     * @extends BiAStarFinder
     * @param {object} opt
     * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
     * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching block corners.
     * @param {function} opt.heuristic Heuristic function to estimate the distance
     *     (defaults to manhattan).
     */
    constructor(){
        
    }
    BiBestFirstFinder(opt) {
        BiAStarFinder.call(this, opt);

        var orig = this.heuristic;
        this.heuristic = function(dx, dy) {
            return orig(dx, dy) * 1000000;
        };
    }

}
