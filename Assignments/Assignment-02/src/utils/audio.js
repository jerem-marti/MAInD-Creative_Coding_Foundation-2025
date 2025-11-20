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

const playOnce = (audio, callback) => {
    audio.currentTime = 0;
    audio.play();
    if (callback) {
        audio.onended = callback;
    }
};

export default {
    playButtonSound(callback = null) {
        playOnce(atariAudioButton, callback);
    },

    playPaddleHitSound(callback = null) {
        playOnce(atariAudioPaddleHit, callback);
    },

    playWinPointSound(callback = null) {
        playOnce(atariAudioWinPoint, callback);
    },

    playWinSound(callback = null) {
        playOnce(atariAudioWin, callback);
    },

    playLosePointSound(callback = null) {
        playOnce(atariAudioLosePoint, callback);
    },

    playLoseSound(callback = null) {
        playOnce(atariAudioLose, callback);
    }
};