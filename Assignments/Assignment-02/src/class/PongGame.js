import Keyboard from './Keyboard.js';
import Touchscreen from './Touchscreen.js';
import MainLoop from '../utils/mainloop.js';
import Rectangle from './Rectangle.js';
import RectangleBouncy from './RectangleBouncy.js';
import getScreenOrientation from '../utils/screen.js';
import Audio from '../utils/audio.js';
import LineDotted from './LineDotted.js';
import Scoreboard from './Scoreboard.js';
import Text from './Text.js';
import { addGameResultToHistory } from '../utils/historyManager.js';

const PADDLE_POSITION_OFFSET = 50;
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 80;
const PADDLE_MASS = 5;
const PADDLE_1_RELATIVE_TO = "center-right";
const PADDLE_2_RELATIVE_TO = "center-left";

const PADDLE_SPEED = 15;
const PADDLE_ACCELERATION = 10;

const BALL_SIZE = 16;
const BALL_SPEED = 5;
const BALL_BOUNCINESS = 1.1;
const BALL_MASS = 1;

const LINE_DOTTED_WIDTH = 2;
const LINE_DOTTED_DOT_LENGTH = 10;
const LINE_DOTTED_GAP_LENGTH = 10;

const SCOREBOARD_FONT = '60px Handjet, Arial';
const SCOREBOARD_COLOR = 'grey';
const SCOREBOARD_GAP = 40;

const TEXT_MARGIN = 10;
const PLAYER_NAME_FONT = '20px Handjet, Arial';
const PLAYER_NAME_COLOR = 'grey';
const PLAYER_NAME_1_RELATIVE_TO = "bottom-right";
const PLAYER_NAME_1_ORIENTATION = "up";
const PLAYER_NAME_2_RELATIVE_TO = "top-left";
const PLAYER_NAME_2_ORIENTATION = "down";

const WIN_SCORE = 2;


export default class PongGame {
    constructor(player1 = "Player 1", player2 = "Player 2", mode = "Single Player") {
        //Players
        this.player1 = player1;
        this.player2 = player2;

        //Game mode
        this.mode = mode;

        //Create a canvas and set its size to the size of the window
        this.ctx = document.querySelector('canvas').getContext('2d');
        this.ctx.canvas.width = this.ctx.canvas.clientWidth;
        this.ctx.canvas.height = this.ctx.canvas.clientHeight;

        //Create a keyboard object to manage user input
        this.keyboard = new Keyboard();

        //Create a touchscreen object to manage user input
        this.touchscreen = new Touchscreen();

        //Store the orientation of the screen
        this.screenOrientation = getScreenOrientation();

        //Create paddles and ball
        let canvasSize = this.getCanvasSize();
        this.paddle1 = this.createPaddle(PADDLE_POSITION_OFFSET, 0, { relativeTo: PADDLE_1_RELATIVE_TO, canvasSize: canvasSize });
        this.paddle2 = this.createPaddle(PADDLE_POSITION_OFFSET, 0, { relativeTo: PADDLE_2_RELATIVE_TO, canvasSize: canvasSize });
        this.balls = [this.createBall(canvasSize.width / 2, canvasSize.height / 2)];

        //Create middle line
        this.middleLine = new LineDotted({
            x: 0,
            y: 0,
            posParam: {
                relativeTo: 'top-center',
                canvasSize: canvasSize
            },
            lenght: canvasSize.height,
            angle: Math.PI / 2,
            color: 'grey',
            lineWidth: LINE_DOTTED_WIDTH,
            dotLength: LINE_DOTTED_DOT_LENGTH,
            gapLength: LINE_DOTTED_GAP_LENGTH
        });

        //Create scoreboard
        this.scoreboard = new Scoreboard({
            x: 0,
            y: TEXT_MARGIN,
            posParam: {
                relativeTo: 'top-center',
                canvasSize: canvasSize
            },
            font: SCOREBOARD_FONT,
            color: SCOREBOARD_COLOR,
            gap: SCOREBOARD_GAP,
        });

        //Create players' names
        this.player1NameText = new Text({
            x: TEXT_MARGIN,
            y: TEXT_MARGIN,
            posParam: {
                relativeTo: PLAYER_NAME_1_RELATIVE_TO,
                canvasSize: canvasSize,
                orientation: PLAYER_NAME_1_ORIENTATION
            },
            font: PLAYER_NAME_FONT,
            color: PLAYER_NAME_COLOR,
            text: this.player1.getName()
        });
        this.player2NameText = new Text({
            x: TEXT_MARGIN,
            y: TEXT_MARGIN,
            posParam: {
                relativeTo: PLAYER_NAME_2_RELATIVE_TO,
                canvasSize: canvasSize,
                orientation: PLAYER_NAME_2_ORIENTATION
            },
            font: PLAYER_NAME_FONT,
            color: PLAYER_NAME_COLOR,
            text: this.player2.getName()
        });

        //Fallback store for end of game
        this.onEndedFunction = null;

        //Main loop setup
        MainLoop.setUpdate((dt) => {
            //Check for screen orientation change
            if (this.screenOrientation !== getScreenOrientation()) {
                this.screenOrientation = getScreenOrientation();
                //Reset paddles position relative to canvas
                this.paddle1.setPositionRelativeToCanvas(PADDLE_POSITION_OFFSET, 0, { relativeTo: PADDLE_1_RELATIVE_TO, canvasSize: this.getCanvasSize()});
                this.paddle2.setPositionRelativeToCanvas(PADDLE_POSITION_OFFSET, 0, {relativeTo: PADDLE_2_RELATIVE_TO, canvasSize: this.getCanvasSize()});
                this.middleLine.setPositionRelativeToCanvas(0, 0, { relativeTo: 'top-center', canvasSize: this.getCanvasSize() });
                this.player1NameText.setPositionRelativeToCanvas(TEXT_MARGIN, TEXT_MARGIN, { relativeTo: 'top-left', canvasSize: this.getCanvasSize(), orientation: "down" });
                this.player2NameText.setPositionRelativeToCanvas(TEXT_MARGIN, TEXT_MARGIN, { relativeTo: 'bottom-right', canvasSize: this.getCanvasSize(), orientation: "up" });
                this.scoreboard.setPositionRelativeToCanvas(0, TEXT_MARGIN, { relativeTo: 'top-center', canvasSize: this.getCanvasSize() });
            }
            //Get logical game dimensions (swap if portrait)
            const gameWidth = this.screenOrientation === "portrait" ? this.ctx.canvas.height : this.ctx.canvas.width;
            const gameHeight = this.screenOrientation === "portrait" ? this.ctx.canvas.width : this.ctx.canvas.height;

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

            //Update scoreboard
            this.scoreboard.updateScore(this.player2.getScore(), this.player1.getScore());
        });

        //Draw loop setup
        MainLoop.setDraw(() => {
            //Update element relative to canvas size if needed
            this.updateElementPosRelativeToCanvas(
                this.middleLine, 
                this.scoreboard, 
                this.player1NameText, 
                this.player2NameText, 
                this.paddle1, 
                this.paddle2, 
                ...this.balls
            );

            //Update middle line length
            this.middleLine.lenght = this.ctx.canvas.height;

            //clear the canvas
            this.clearAndRefreshCanvas();

            //Rotate canvas if in portrait mode (width < height)
            if (this.ctx.canvas.width < this.ctx.canvas.height) {
                this.ctx.save();
                //Translate to center, rotate 90 degrees, then translate back
                this.ctx.rotate(Math.PI / 2);
                this.ctx.translate(0, -this.ctx.canvas.width);
            }

            //draw middle line
            this.middleLine.draw(this.ctx);

            //draw scoreboard
            this.scoreboard.draw(this.ctx);

            //draw players' names
            this.player1NameText.draw(this.ctx);
            this.player2NameText.draw(this.ctx);

            //draw paddles and ball
            this.paddle1.draw(this.ctx);
            this.paddle2.draw(this.ctx);
            for (let b of this.balls) {
                b.draw(this.ctx);
            }

            //Restore canvas state if rotated
            if (this.ctx.canvas.width < this.ctx.canvas.height) {
                this.ctx.restore();
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

    onEnded(callback) {
        this.onEndedFunction = callback;
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
                angle: parseInt(Math.random() * 2) * Math.PI + (Math.random()-0.5) * (Math.PI / 4), //Random angle towards left or right
            },
        });
    }

    clearAndRefreshCanvas() {
        this.ctx.canvas.width = this.ctx.canvas.clientWidth;
        this.ctx.canvas.height = this.ctx.canvas.clientHeight;
    }

    getCanvasSize() {
        return {
            width: this.screenOrientation === "portrait" ? this.ctx.canvas.height : this.ctx.canvas.width,
            height: this.screenOrientation === "portrait" ? this.ctx.canvas.width : this.ctx.canvas.height
        };
    }

    updateElementPosRelativeToCanvas(...elements) {
        let dx, dy;
        if(this.screenOrientation === "portrait") {
            dx = (this.ctx.canvas.clientHeight - this.ctx.canvas.height);
            dy = (this.ctx.canvas.clientWidth - this.ctx.canvas.width);
        } else {
            dx = (this.ctx.canvas.clientWidth - this.ctx.canvas.width);
            dy = (this.ctx.canvas.clientHeight - this.ctx.canvas.height);
        }
        for (let element of elements) {
            element.updatePositionRelativeToCanvas(dx, dy);
        }
    }

    getPaddleKeyboardMvt() {
        let paddle1Mvt = 0; // Movement for paddle 1 (-1: up, 1: down, 0: no movement)
        let paddle2Mvt = 0; // Movement for paddle 2 (-1: up, 1: down, 0: no movement)
        if(this.screenOrientation === "portrait") {
            //Keyboard input for paddle 2 (A/D keys)
            if (this.keyboard.isDown('KeyD')) paddle2Mvt = -1;
            else if (this.keyboard.isDown('KeyA')) paddle2Mvt = 1;
            //Keyboard input for paddle 1 (left/right arrows)
            if (this.keyboard.isDown('ArrowRight')) paddle1Mvt = -1;
            else if (this.keyboard.isDown('ArrowLeft')) paddle1Mvt = 1;
        } else {
            //Keyboard input for paddle 2 (W/S keys)
            if (this.keyboard.isDown('KeyW')) paddle2Mvt = -1;
            else if (this.keyboard.isDown('KeyS')) paddle2Mvt = 1;
            //Keyboard input for paddle 1 (up/down arrows)
            if (this.keyboard.isDown('ArrowUp')) paddle1Mvt = -1;
            else if (this.keyboard.isDown('ArrowDown')) paddle1Mvt = 1;
        }
        return {paddle1Mvt, paddle2Mvt};
    }

    getPaddleTouchscreenMvt() {
        let paddle1Position;
        let paddle2Position;
        for (const touch of this.touchscreen.touches.values()) {
            if(this.screenOrientation === "portrait") {
                //Top side of the screen controls paddle 2
                if (touch.y < window.innerHeight / 2 && paddle2Position === undefined) {
                    paddle2Position = window.innerWidth - touch.x;
                } 
                //Bottom side of the screen controls paddle 1
                else if (touch.y >= window.innerHeight / 2 && paddle1Position === undefined) {
                    paddle1Position = window.innerWidth - touch.x;
                }
                else {
                    break;
                }
            } else {
                //Left side of the screen controls paddle 2
                if (touch.x < window.innerWidth / 2 && paddle2Position === undefined) {
                    paddle2Position = touch.y;
                } 
                //Right side of the screen controls paddle 1
                else if (touch.x >= window.innerWidth / 2 && paddle1Position === undefined) {
                    paddle1Position = touch.y;
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
                if(collisionSide === 'left') this.incrementPlayerScore(this.player1);
                else this.incrementPlayerScore(this.player2);
            }
            ball.rectangleCollision(this.paddle1, BALL_BOUNCINESS);
            ball.rectangleCollision(this.paddle2, BALL_BOUNCINESS);
        }
    }

    incrementPlayerScore(player) {
        console.log("Point for " + player.getName());
        player.incrementScore();
        console.log("New score: " + player.getScore());
        if (player.getScore() >= WIN_SCORE) {
            this.endGame(player);
        } else {
            setTimeout(() => {
                // Reset ball to center after a score
                this.balls.push(this.createBall(
                    (this.paddle1.x + this.paddle2.x) / 2,
                    (this.paddle1.y + this.paddle2.y) / 2
                ));
            }, 2000);
            Audio.playWinPointSound();  
        }
    }

    endGame() {
        this.stop();
        addGameResultToHistory(this.player1.getName(), this.player1.getScore(), this.player2.getName(), this.player2.getScore(), this.mode);
        Audio.playWinSound(this.onEndedFunction());
    }
}
