import paper from "../../../vendor/paper-full.min.js"
export default class UserPlayController {
    constructor($timeout) {
        this.$timeout = $timeout;
    }

    init(firstFrame, lastFrame) {
        this._frameDuration = 25;
        this._direction = 1;
        this._frame = 0;
        this._firstFrame = firstFrame;
        this._lastFrame = lastFrame;
        this._loop = true;
        this._timeoutHandler();
    }

    _render() {
        //this._frameRenderer.renderFrame(this._frame);
    }

    _timeoutHandler() {
        //console.debug("timeout handler frame #" + this.frame);
        this._render();
        if (this.playing) {
            this._timeout = null;
            var nextFrame = null;
            var frame = this.frame;
            if (this.direction == 1) {
                if (frame < this.lastFrame) nextFrame = frame + 1;
                else if (this.loop) nextFrame = this.firstFrame;
            }
            else {
                if (frame > this.firstFrame) nextFrame = frame - 1;
                else if (this.loop) nextFrame = this.lastFrame;
            }
            if (nextFrame != null) {

                this._timeout = this.$timeout(()=> {
                    this._frame = nextFrame;
                    this._timeoutHandler();
                }, this._frameDuration);
            }
        }
    }

    start() {
        if (!this.playing) {
            if (this.direction == 1 && this._frame == this.lastFrame) {
                this._frame = this.firstFrame;
            }
            else if (this.direction == -1 && this._frame == this.firstFrame) {
                this._frame = this.lastFrame;
            }
            this._timeout = true;
            this._timeoutHandler();
        }
    }

    stop() {
        this.$timeout.cancel(this._timeout);
        this._timeout = null;
    }

    togglePlay() {
        if (this.playing) {
            this.stop();
        }
        else {
            this.start()
        }
    }

    get playing() {
        return this._timeout != null;
    }

    nextFrame() {
        this.stop();
        var nextFrame;
        if (this.frame < this.lastFrame) {
            nextFrame = this.frame + 1;
        }
        else if (this.loop) {
            nextFrame = this.firstFrame;
        }
        if (nextFrame != null) {
            this.gotoFrame(nextFrame);
        }
    }

    prevFrame() {
        this.stop();
        var nextFrame;
        if (this.frame > this.firstFrame) {
            nextFrame = this.frame - 1;
        }
        else if (this.loop) {
            nextFrame = this.lastFrame;
        }
        if (nextFrame != null) {
            this.gotoFrame(nextFrame);
        }
    }

    gotoFrame(val) {
        this._frame = val;
        if (this.playing) {
            this.stop();
            this.start();
        }
        else {
            this._render();
        }

    }

    gotoFirstFrame() {
        this.gotoFrame(this.firstFrame);
    }

    gotoLastFrame() {
        this.gotoFrame(this.lastFrame);
    }

    get frame() {
        return this._frame;
    }

    set frame(val) {
        this.stop();
        this.gotoFrame(val);
    }

    set frameDuration(val) {
        this._frameDuration = val;
        if (this.playing) {
            this.stop();
            this.start();
        }
    }

    get frameDuration() {
        return this._frameDuration;
    }

    set direction(val) {
        this._direction = val;
        if (this.playing) {
            this.stop();
            this.start();
        }
    }

    toggleDirection() {
        if (this.direction == 1) {
            this.direction = -1;
        }
        else {
            this.direction = 1;
        }
    }

    get direction() {
        return this._direction;
    }

    set loop(val) {
        this._loop = val;
    }

    get loop() {
        return this._loop;
    }

    toggleLoop() {
        this.loop = !this.loop;
    }

    get firstFrame() {
        return this._firstFrame;
    }

    get lastFrame() {
        return this._lastFrame;
    }
}