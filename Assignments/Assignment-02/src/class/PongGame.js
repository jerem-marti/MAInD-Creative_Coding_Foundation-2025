import Keyboard from './Keyboard.js';
import Touchscreen from './Touchscreen.js';
import MainLoop from '../utils/mainloop.js';
import Rectangle from './Rectangle.js';
import RectangleBouncy from './RectangleBouncy.js';

const PADDLE_POSITION_OFFSET = 50;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_MASS = 5;

const PADDLE_SPEED = 10;
const PADDLE_ACCELERATION = 8;

const BALL_SIZE = 20;
const BALL_SPEED = 10;
const BALL_MASS = 1;


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
            x: PADDLE_POSITION_OFFSET,
            y: ctx.canvas.height / 2,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            mass: PADDLE_MASS,
        });

        const paddle2 = new Rectangle({
            x: PADDLE_POSITION_OFFSET,
            y: ctx.canvas.height / 2,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            mass: PADDLE_MASS,
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
            width: BALL_SIZE,
            height: BALL_SIZE,
            mass: BALL_MASS,
            speed: {
                velocity: BALL_SPEED,
                angle: Math.random() * 2 * Math.PI
            },
            color: 'white'
        });

        MainLoop.setUpdate((dt) => {
            //User input management
            let paddle1Mvt = 0; // Movement for paddle 1 (-1: up, 1: down, 0: no movement)
            let paddle2Mvt = 0; // Movement for paddle 2 (-1: up, 1: down, 0: no movement)
            let paddle1PositionY;
            let paddle2PositionY;

            //Keyboard input for paddle 1 (up/down arrows)
            if (keyboard.isDown('KeyW')) paddle1Mvt = -1;
            else if (keyboard.isDown('KeyS')) paddle1Mvt = 1;
            //Keyboard input for paddle 2 (W/S keys)
            if (keyboard.isDown('ArrowUp')) paddle2Mvt = -1;
            else if (keyboard.isDown('ArrowDown')) paddle2Mvt = 1;
            //Touchscreen input
            if(paddle1Mvt === 0 && paddle2Mvt === 0) {
                for (const touch of touchscreen.touches.values()) {
                    //Left side of the screen controls paddle 1
                    if (touch.x < ctx.canvas.width / 2 && paddle1PositionY === undefined) {
                        paddle1PositionY = touch.y;
                    } 
                    //Right side of the screen controls paddle 2
                    else if (touch.x >= ctx.canvas.width / 2 && paddle2PositionY === undefined) {
                        paddle2PositionY = touch.y;
                    }
                    else {
                        break;
                    }
                }
            }

            // console.log("paddle mvt:", paddle1Mvt, paddle2Mvt);
            // console.log("paddle pos:", paddle1PositionY, paddle2PositionY);

            //Apply movement to paddles
            if (paddle1Mvt !== 0) {
                paddle1.setSpeed(0, paddle1Mvt * PADDLE_SPEED);
                paddle1.applyForce(0, paddle1Mvt * PADDLE_ACCELERATION);
            } else if (paddle1PositionY !== undefined) {
                paddle1.y = paddle1PositionY;
            } else {
                paddle1.stop();
            }
            if (paddle2Mvt !== 0) {
                paddle2.setSpeed(0, paddle2Mvt * PADDLE_SPEED);
                paddle2.applyForce(0, paddle2Mvt * PADDLE_ACCELERATION);
            } else if (paddle2PositionY !== undefined) {
                paddle2.y = paddle2PositionY;
            } else {
                paddle2.stop();
            }

            //Update paddles and ball position
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




