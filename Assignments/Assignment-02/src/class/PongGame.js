import Keyboard from './Keyboard.js';
import Touchscreen from './Touchscreen.js';
import MainLoop from '../utils/mainloop.js';
import Rectangle from './Rectangle.js';
import RectangleBouncy from './RectangleBouncy.js';
import getScreenOrientation from '../utils/screen.js';
import audio from '../utils/audio.js';

const PADDLE_POSITION_OFFSET = 50;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_MASS = 5;
const PADDLE_1_RELATIVE_TO = "center-left";
const PADDLE_2_RELATIVE_TO = "center-right";

const PADDLE_SPEED = 15;
const PADDLE_ACCELERATION = 10;

const BALL_SIZE = 20;
const BALL_SPEED = 10;
const BALL_MASS = 1;

const WIN_SCORE = 15;


export default class PongGame {
    constructor() {
        //Create a canvas and set its size to the size of the window
        const ctx = document.querySelector('canvas').getContext('2d');
        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;

        //Create a keyboard object to manage user input
        this.keyboard = new Keyboard();

        //Create a touchscreen object to manage user input
        this.touchscreen = new Touchscreen();

        //Store the orientation of the screen
        this.screenOrientation = getScreenOrientation();

        //Create paddles and ball
        let canvasSize = this.getCanvasSize(ctx);
        this.paddle1 = this.createPaddle(PADDLE_POSITION_OFFSET, 0, { relativeTo: PADDLE_1_RELATIVE_TO, canvasSize: canvasSize });
        this.paddle2 = this.createPaddle(PADDLE_POSITION_OFFSET, 0, { relativeTo: PADDLE_2_RELATIVE_TO, canvasSize: canvasSize });
        this.balls = [this.createBall(canvasSize.width / 2, canvasSize.height / 2)];

        //Game
        this.players = [];
        this.scores = [0, 0];
        this.lastScores = [0, 0];

        //Main loop setup
        MainLoop.setUpdate((dt) => {
            //Check for screen orientation change
            if (this.screenOrientation !== getScreenOrientation()) {
                this.screenOrientation = getScreenOrientation();
                //Reset paddles position relative to canvas
                this.paddle1.setPositionRelativeToCanvas(PADDLE_POSITION_OFFSET, 0, { relativeTo: PADDLE_1_RELATIVE_TO, canvasSize: this.getCanvasSize(ctx)});
                this.paddle2.setPositionRelativeToCanvas(PADDLE_POSITION_OFFSET, 0, {relativeTo: PADDLE_2_RELATIVE_TO, canvasSize: this.getCanvasSize(ctx)});
            }
            //Get logical game dimensions (swap if portrait)
            const gameWidth = this.screenOrientation === "portrait" ? ctx.canvas.height : ctx.canvas.width;
            const gameHeight = this.screenOrientation === "portrait" ? ctx.canvas.width : ctx.canvas.height;

            //Keyboard input
            const paddleKeyboardMvt = this.getPaddleKeyboardMvt();

            //Touchscreen input
            const paddleTouchscreenMvt = this.getPaddleTouchscreenMvt();

            //Apply movement to paddles
            this.applyMvtToPaddle(this.paddle1, { keyboard: paddleKeyboardMvt.paddle1Mvt, touchscreen: paddleTouchscreenMvt.paddle1Position });
            this.applyMvtToPaddle(this.paddle2, { keyboard: paddleKeyboardMvt.paddle2Mvt, touchscreen: paddleTouchscreenMvt.paddle2Position });

            //Update paddles and ball position with logical dimensions
            this.updatePaddlesPosition(dt, gameWidth, gameHeight, this.paddle1, this.paddle2);
            this.updateBallsPosition(dt, gameWidth, gameHeight, this.balls);

            this.updateScores();
        });

        //Draw loop setup
        MainLoop.setDraw(() => {
            //Update element relative to canvas size if needed
            this.updateElementPosRelativeToCanvas(ctx, this.paddle1, this.paddle2, ...this.balls);

            //clear the canvas
            this.clearAndRefreshCanvas(ctx);

            //Rotate canvas if in portrait mode (width < height)
            if (ctx.canvas.width < ctx.canvas.height) {
                ctx.save();
                //Translate to center, rotate 90 degrees, then translate back
                ctx.rotate(Math.PI / 2);
                ctx.translate(0, -ctx.canvas.width);
            }

            //draw paddles and ball
            this.paddle1.draw(ctx);
            this.paddle2.draw(ctx);
            for (let b of this.balls) {
                b.draw(ctx);
            }

            //Restore canvas state if rotated
            if (ctx.canvas.width < ctx.canvas.height) {
                ctx.restore();
            }
        });

        //Manage panic situation when the update loop is taking too long
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

    createPaddle(x, y, posParam) {
        return new Rectangle({
            x: x,
            y: y,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            mass: PADDLE_MASS,
            posParam: posParam,
        });
    }

    createBall(x, y) {
        return new RectangleBouncy({
            x: x,
            y: y,
            width: BALL_SIZE,
            height: BALL_SIZE,
            mass: BALL_MASS,
            speed: {
                velocity: BALL_SPEED,
                angle: Math.random() * 2 * Math.PI
            },
        });
    }

    clearAndRefreshCanvas(ctx) {
        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;
    }

    getCanvasSize(ctx) {
        return {
            width: this.screenOrientation === "portrait" ? ctx.canvas.height : ctx.canvas.width,
            height: this.screenOrientation === "portrait" ? ctx.canvas.width : ctx.canvas.height
        };
    }

    updateElementPosRelativeToCanvas(ctx, ...elements) {
        let dx, dy;
        if(this.screenOrientation === "portrait") {
            dx = (ctx.canvas.clientHeight - ctx.canvas.height);
            dy = (ctx.canvas.clientWidth - ctx.canvas.width);
        } else {
            dx = (ctx.canvas.clientWidth - ctx.canvas.width);
            dy = (ctx.canvas.clientHeight - ctx.canvas.height);
        }
        for (let element of elements) {
            element.updatePositionRelativeToCanvas(dx, dy);
        }
    }

    getPaddleKeyboardMvt() {
        let paddle1Mvt = 0; // Movement for paddle 1 (-1: up, 1: down, 0: no movement)
        let paddle2Mvt = 0; // Movement for paddle 2 (-1: up, 1: down, 0: no movement)
        if(this.screenOrientation === "portrait") {
            //Keyboard input for paddle 1 (A/D keys)
            if (this.keyboard.isDown('KeyD')) paddle1Mvt = -1;
            else if (this.keyboard.isDown('KeyA')) paddle1Mvt = 1;
            //Keyboard input for paddle 2 (left/right arrows)
            if (this.keyboard.isDown('ArrowRight')) paddle2Mvt = -1;
            else if (this.keyboard.isDown('ArrowLeft')) paddle2Mvt = 1;
        } else {
            //Keyboard input for paddle 1 (W/S keys)
            if (this.keyboard.isDown('KeyW')) paddle1Mvt = -1;
            else if (this.keyboard.isDown('KeyS')) paddle1Mvt = 1;
            //Keyboard input for paddle 2 (up/down arrows)
            if (this.keyboard.isDown('ArrowUp')) paddle2Mvt = -1;
            else if (this.keyboard.isDown('ArrowDown')) paddle2Mvt = 1;
        }
        return {paddle1Mvt, paddle2Mvt};
    }

    getPaddleTouchscreenMvt() {
        let paddle1Position;
        let paddle2Position;
        for (const touch of this.touchscreen.touches.values()) {
            if(this.screenOrientation === "portrait") {
                //Top side of the screen controls paddle 1
                if (touch.y < window.innerHeight / 2 && paddle1Position === undefined) {
                    paddle1Position = window.innerWidth - touch.x;
                } 
                //Bottom side of the screen controls paddle 2
                else if (touch.y >= window.innerHeight / 2 && paddle2Position === undefined) {
                    paddle2Position = window.innerWidth - touch.x;
                }
                else {
                    break;
                }
            } else {
                //Left side of the screen controls paddle 1
                if (touch.x < window.innerWidth / 2 && paddle1Position === undefined) {
                    paddle1Position = touch.y;
                } 
                //Right side of the screen controls paddle 2
                else if (touch.x >= window.innerWidth / 2 && paddle2Position === undefined) {
                    paddle2Position = touch.y;
                }
                else {
                    break;
                }
            }
        }
        return {paddle1Position, paddle2Position};
    }

    applyMvtToPaddle(paddle, mvt) {
        if (mvt.keyboard !== 0) {
                paddle.setSpeed(0, mvt.keyboard * PADDLE_SPEED);
                paddle.applyForce(0, mvt.keyboard * PADDLE_ACCELERATION);
            } else if (mvt.touchscreen !== undefined) {
                paddle.y = mvt.touchscreen;
            } else {
                paddle.stop();
            }
    }

    updatePaddlesPosition(dt, gameWidth, gameHeight) {
        for (let paddle of [this.paddle1, this.paddle2]) {
            paddle.move(dt);
            paddle.canvasCollision(gameWidth, gameHeight);
        }
    }

    updateBallsPosition(dt, gameWidth, gameHeight, balls) {
        for (let i = 0; i < balls.length; i++) {
            let ball = balls[i];
            ball.move(dt);
            const collisionSide = ball.canvasCollision(gameWidth, gameHeight);
            if(collisionSide && (collisionSide === 'left' || collisionSide === 'right')) {
                // Remove array element
                balls.splice(i, 1);
                i--; // Adjust index after removal
                if(collisionSide === 'left') this.scores[1]++;
                else this.scores[0]++;
            }
            ball.rectangleCollision(this.paddle1);
            ball.rectangleCollision(this.paddle2);
        }
    }

    updateScores() {
        for (let i = 0; i < this.scores.length; i++) {
            if (this.scores[i] !== this.lastScores[i]) {
                if(this.scores[i] >= WIN_SCORE) {
                    console.log(`Player ${i + 1} wins!`);
                    this.endGame();
                } else {
                    this.lastScores[i] = this.scores[i];
                    setTimeout(() => {
                        // Reset ball to center after a score
                        this.balls.push(this.createBall(
                            (this.paddle1.x + this.paddle2.x) / 2,
                            (this.paddle1.y + this.paddle2.y) / 2
                        ));
                    }, 2000);
                    audio.playWinPointSound();
                }
            }
        }
        console.log(`Scores: Player 1 - ${this.scores[0]}, Player 2 - ${this.scores[1]}`);
    }

    endGame() {
        this.stop();
        audio.playWinSound();
        console.log("Game Over");
    }
}
