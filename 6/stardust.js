(() => {

    const cnv = document.querySelector(`canvas`);
    const ctx = cnv.getContext(`2d`);

    const cfg = {
        orbsCount   : 700, //кол-во кружков
        minVelocity : .2, //скорость кружков
        ringsCount  : 10, //кол-во колец

    }
    let mx = 0, my = 0;
    cnv.addEventListener(`mousemove`, e => {
        mx = e.clientX - cnv.getBoundingClientRect().left;
        my = e.clientY - cnv.getBoundingClientRect().top;
    })

    let cw, ch, cx, cy, ph, pw;
    function resize() {
        cw = cnv.width = innerWidth;
        ch = cnv.height = innerHeight;
        cx = cw * .5;
        cy = ch * .5; 
        ph = cy * .4;
        pw = cx * .4;
    }
    resize();
    window.addEventListener(`resize`, resize);

    class Orb {
        constructor() {
            this.size     = Math.random() * 9 + 2;
            this.angle    = Math.random() * 360;
            this.radius   = (Math.random() * cfg.ringsCount | 0) * ph / cfg.ringsCount;
            this.impact   = this.radius / ph;
            this.velocity = cfg.minVelocity + Math.random() * cfg.minVelocity - this.impact; 

        }

        refresh() {
            let radian   = this.angle * Math.PI / 180;

            let cos      = Math.cos(radian);
            let sin      = Math.sin(radian);

            let offsetx  = cos * pw * this.impact;
            let offsety  = sin * pw * this.impact;

            let paralaxX = mx / cw * 2 - 1;
            let paralaxY = my / ch;

            let x        = cx + cos * (ph + this.radius) + offsetx;
            let y        = cy + sin * (ph + this.radius) - offsety * paralaxY - paralaxX * offsetx;

            let distToC  = Math.hypot(x - cx, y - cy);
            let distToM  = Math.hypot(x - mx, y - my);

            let optic    =  sin * this.size * this.impact * .7;
            let mEffect  =distToM <= 50 ? (1 - distToM / 50) * 25 : 0;
            let size     = this.size + optic + mEffect;

            let h        = this.angle;
            let s        = 100;
            let l        = (1 - Math.sin(this.impact * Math.PI)) * 90 + 10;    //яркость
            let color    = `hsl(${h}, ${s}%, ${l}%)`;

            if (distToC > ph - 1 || sin > 0) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, 2 * Math.PI);
                ctx.fill();
            };

            this.angle =  (this.angle + this.velocity) % 360;
        }
    }

    let orbsList = [];
    function createStardust() {
        for (let i = 0 ; i < cfg.orbsCount ; i++) {
            orbsList.push( new Orb() );
        }
    }
    createStardust();

    function loop() {
        requestAnimationFrame(loop);
        ctx.globalCompositeOperation = `normal`;
        ctx.fillStyle = `rgb( 22, 22, 22)`;
        ctx.fillRect(0, 0, cw, ch);

        ctx.globalCompositeOperation = `lighter`;
        orbsList.map(e => e.refresh());
    }
loop();

})();