import atariButtonMP3 from '../assets/atari-button.mp3';
import atariPaddleHitMP3 from '../assets/atari-paddle-hit.mp3';
import atariWinPointMP3 from '../assets/atari-win-point.mp3';
import atariWinMP3 from '../assets/atari-win.mp3';
import atariLosePointMP3 from '../assets/atari-lose-point.mp3';
import atariLoseMP3 from '../assets/atari-lose.mp3';

const atariAudioButton = new Audio(atariButtonMP3);
const atariAudioPaddleHit = new Audio(atariPaddleHitMP3);
const atariAudioWinPoint = new Audio(atariWinPointMP3);
const atariAudioWin = new Audio(atariWinMP3);
const atariAudioLosePoint = new Audio(atariLosePointMP3);
const atariAudioLose = new Audio(atariLoseMP3);

export default {
    playButtonSound() {
        atariAudioButton.currentTime = 0;
        atariAudioButton.play();
    },

    playPaddleHitSound() {
        atariAudioPaddleHit.currentTime = 0;
        atariAudioPaddleHit.play();
    },

    playWinPointSound() {
        atariAudioWinPoint.currentTime = 0;
        atariAudioWinPoint.play();
    },

    playWinSound() {
        atariAudioWin.currentTime = 0;
        atariAudioWin.play();
    },

    playLosePointSound() {
        atariAudioLosePoint.currentTime = 0;
        atariAudioLosePoint.play();
    },

    playLoseSound() {
        atariAudioLose.currentTime = 0;
        atariAudioLose.play();
    }
};