import Keyboard from './Keyboard.js';
import Touchscreen from './Touchscreen.js';
import MainLoop from '../utils/mainloop.js';
import Rectangle from './Rectangle.js';
import RectangleBouncy from './RectangleBouncy.js';

export default class PongGame {
    constructor() {
        //Create a canvas and set its size to the size of the window
        const ctx = document.querySelector('canvas').getContext('2d');
        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;

        //Create a keyboard object to manage user input
        const keyboard = new Keyboard();

        //Create a touchscreen object to manage user input
        const touchscreen = new Touchscreen();

        const paddle1 = new Rectangle({
            x: 50,
            y: 100,
            width: 20,
            height: 100,
        });

        const paddle2 = new Rectangle({
            x: 50,
            y: 600,
            width: 20,
            height: 100,
            position: {
                relativeTo: 'top-right',
                canvasSize: {
                    width: ctx.canvas.width,
                    height: ctx.canvas.height
                }
            }
        });

        const ball = new RectangleBouncy({
            x: ctx.canvas.width / 2,
            y: ctx.canvas.height / 2,
            width: 20,
            height: 20,
            speed: {
                velocity: 1,
                angle: Math.random() * 2 * Math.PI
            },
            color: 'white'
        });

        MainLoop.setUpdate((dt) => {
            paddle1.move(dt);
            paddle1.canvasCollision(ctx.canvas.width, ctx.canvas.height);
            paddle2.move(dt);
            paddle2.canvasCollision(ctx.canvas.width, ctx.canvas.height);
            ball.move(dt);
            ball.canvasCollision(ctx.canvas.width, ctx.canvas.height);
            ball.rectangleCollision(paddle1);
            ball.rectangleCollision(paddle2);
        });

        MainLoop.setDraw(() => {
            //Update element relative to canvas size if needed
            const dx = ctx.canvas.clientWidth - ctx.canvas.width;
            const dy = ctx.canvas.clientHeight - ctx.canvas.height;
            paddle1.updatePositionRelativeToCanvas(dx, dy);
            paddle2.updatePositionRelativeToCanvas(dx, dy);
            ball.updatePositionRelativeToCanvas(dx, dy);

            //clear the canvas
            ctx.canvas.width = ctx.canvas.clientWidth;
            ctx.canvas.height = ctx.canvas.clientHeight;

            //draw paddles and ball
            paddle1.draw(ctx);
            paddle2.draw(ctx);
            ball.draw(ctx);
        });

        MainLoop.setEnd((fps, panic) => {
            if (panic) {
                MainLoop.resetFrameDelta();
            }
        });
    }

    start() {
        MainLoop.start();
    }

    stop() {
        MainLoop.stop();
    }

    reset() {
        //reset game state here
    }
}




