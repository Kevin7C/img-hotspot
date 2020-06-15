import uuid from "uuid";
// import "./index.css"
class ImgHotSpot {

    constructor(options) {

        if (typeof options.element === "string") {
            options.elementDom = document.getElementById(options.element);
        }
        this.elementDom = options.elementDom;

        ['width', 'height'].forEach(attr => {
            this[attr] = options[attr];
        }, this)
        this._init();
    }

    /**
     * Private API
     */

    _init() {
        console.log('init', this)
        this._sketching = false;
        /**
         * * id: 唯一标识
         * type:"rect" 矩形
         * des:{x,y,width,height,color}
         */
        this._areaList = [];
        this._currentArea = null;

        this.width = this.width || 750;
        this.height = this.height || 1334;
        this.elementDom.style.width = `${this.width}px`;
        this.elementDom.style.height = `${this.height}px`;
        this.elementDom.style.position = "relative";

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.position = "absolute";
        this.canvas.style.top = 0;
        this.canvas.style.bottom = 0;
        this.canvas.style.left = 0;
        this.canvas.style.right = 0;

        this.img = document.createElement("img");
        this.img.width = this.width;
        this.img.height = this.height;

        this.elementDom.appendChild(this.img);
        this.elementDom.appendChild(this.canvas);

        this.context = this.canvas.getContext('2d');

        this.events = {};
        this.events['mousemove'] = [];
        this.internalEvents = ['MouseDown', 'MouseUp', 'MouseOut','MouseMove'];
        this.internalEvents.forEach((name) => {
            let lower = name.toLowerCase();
            this.events[lower] = [];
            this[`on${name}`] = this[`on${name}`].bind(this);
            // this['on' + name] = this['on' + name].bind(this);
            this.canvas.addEventListener(lower, this[`on${name}`])

        }, this)
        // this.onMouseDown.bind(this)
        // this.canvas.addEventListener("mousedown",(e)=>{console.log("3",this)})
    }

    _draw() {

        this.context.save();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.setLineDash([5, 5]);
        this.context.beginPath();
        for (let area of this._areaList) {
            const { x, y, width, height, color } = area.des;
            this.context.strokeRect(x, y, width, height);
        }
        this.context.closePath();
        this.context.stroke();
        this.context.restore();
    }

    /**
     * Event/CallBack
     */
    onMouseDown(e) {
        console.log("e", e);
        console.log("this", this);
        const { offsetX: x, offsetY: y } = e;
        if (e.buttons === 1) {
            const areaObj = {
                id: uuid(),
                type: "rect",
                des: {
                    x, y, width: 0, height: 0,
                }
            };
            this._sketching = true;
            this._currentArea = areaObj;
            this._areaList.push(areaObj);
            this.canvas.addEventListener('mousemove', this.onMouseMove);
        }

    }

    onMouseUp(e) {
        // this.onMouseUp(event);
        if (!this._sketching) {
            return
        }
        const { offsetX: x, offsetY: y } = e;
        const { x: x1, y: y1 } = this._currentArea.des
        this._currentArea.des.width = x - x1;
        this._currentArea.des.height = y - y1;
        this._draw();
        this._currentArea = null;
        this._sketching=false;
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
    }
    onMouseMove(e) {

        if (!this._sketching) {
            return;
        }
        const { offsetX: x, offsetY: y } = e;
        const { x: x1, y: y1 } = this._currentArea.des;
        this._currentArea.des.width = x - x1;
        this._currentArea.des.height = y - y1;
        
        this._draw();
        console.log("move", e)
    }
    onMouseOut(e) {
        // this.onMouseUp(event);
        if (!this._sketching) {
            return
        }
        const { offsetX: x, offsetY: y } = e;
        const { x: x1, y: y1 } = this._currentArea.des
        this._currentArea.des.width = x>=this.canvas.width?this.canvas.width- x1:x<=0?-x1:x-x1;
        this._currentArea.des.height = y>=this.canvas.height?this.canvas.height- y1:y<=0?-y1:y-y1;
        console.log(this._currentArea.des)
        this._draw();
        this._sketching=false;
        this._currentArea = null;
    }


    /**
     * Public API
     */

    toHtml() {

    }

    setImg(img) {
        this.img.src = img;
    }

    setLine() {

    }
}

window.ImgHotSpot = ImgHotSpot;
export default ImgHotSpot;
