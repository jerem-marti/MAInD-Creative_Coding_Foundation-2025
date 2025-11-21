/**
 * @fileoverview Audio utility module for managing game sound effects.
 * This module provides a centralized audio management system for playing various
 * Atari-style game sounds including button clicks, paddle hits, scoring, and win/lose events.
 * All sounds are played from the beginning each time and support optional callbacks.
 */

import atariButtonMP3 from '../assets/atari-button.mp3';
import atariPaddleHitMP3 from '../assets/atari-paddle-hit.mp3';
import atariWinPointMP3 from '../assets/atari-win-point.mp3';
import atariWinMP3 from '../assets/atari-win.mp3';
import atariLosePointMP3 from '../assets/atari-lose-point.mp3';
import atariLoseMP3 from '../assets/atari-lose.mp3';

/**
 * Audio instance for button click sound effect.
 * @type {HTMLAudioElement}
 */
const atariAudioButton = new Audio(atariButtonMP3);

/**
 * Audio instance for paddle hit sound effect.
 * @type {HTMLAudioElement}
 */
const atariAudioPaddleHit = new Audio(atariPaddleHitMP3);

/**
 * Audio instance for winning a point sound effect.
 * @type {HTMLAudioElement}
 */
const atariAudioWinPoint = new Audio(atariWinPointMP3);

/**
 * Audio instance for winning the game sound effect.
 * @type {HTMLAudioElement}
 */
const atariAudioWin = new Audio(atariWinMP3);

/**
 * Audio instance for losing a point sound effect.
 * @type {HTMLAudioElement}
 */
const atariAudioLosePoint = new Audio(atariLosePointMP3);

/**
 * Audio instance for losing the game sound effect.
 * @type {HTMLAudioElement}
 */
const atariAudioLose = new Audio(atariLoseMP3);

/**
 * Plays an audio clip from the beginning.
 * Resets the audio to time 0 and plays it. Optionally executes a callback when playback ends.
 * 
 * @function playOnce
 * @param {HTMLAudioElement} audio - The audio element to play
 * @param {Function} [callback] - Optional callback function to execute when audio playback ends
 */
const playOnce = (audio, callback) => {
    audio.currentTime = 0;
    audio.play();
    if (callback) {
        audio.onended = callback;
    }
};

/**
 * Audio manager object providing methods to play game sound effects.
 * All methods accept an optional callback that executes when the sound finishes playing.
 * 
 * @exports audio
 */
export default {
    /**
     * Plays the button click sound effect.
     * 
     * @method playButtonSound
     * @param {Function} [callback=null] - Optional callback function to execute when playback ends
     */
    playButtonSound(callback = null) {
        playOnce(atariAudioButton, callback);
    },

    /**
     * Plays the paddle hit sound effect.
     * 
     * @method playPaddleHitSound
     * @param {Function} [callback=null] - Optional callback function to execute when playback ends
     */
    playPaddleHitSound(callback = null) {
        playOnce(atariAudioPaddleHit, callback);
    },

    /**
     * Plays the win point sound effect.
     * 
     * @method playWinPointSound
     * @param {Function} [callback=null] - Optional callback function to execute when playback ends
     */
    playWinPointSound(callback = null) {
        playOnce(atariAudioWinPoint, callback);
    },

    /**
     * Plays the win game sound effect.
     * 
     * @method playWinSound
     * @param {Function} [callback=null] - Optional callback function to execute when playback ends
     */
    playWinSound(callback = null) {
        playOnce(atariAudioWin, callback);
    },

    /**
     * Plays the lose point sound effect.
     * 
     * @method playLosePointSound
     * @param {Function} [callback=null] - Optional callback function to execute when playback ends
     */
    playLosePointSound(callback = null) {
        playOnce(atariAudioLosePoint, callback);
    },

    /**
     * Plays the lose game sound effect.
     * 
     * @method playLoseSound
     * @param {Function} [callback=null] - Optional callback function to execute when playback ends
     */
    playLoseSound(callback = null) {
        playOnce(atariAudioLose, callback);
    }
};