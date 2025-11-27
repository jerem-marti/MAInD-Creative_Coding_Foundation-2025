/**
 * @fileoverview Avatar utility module for generating avatar images from usernames.
 * This module uses the DiceBear API to fetch pixel-art style avatars and encodes them
 * as data URIs for use in canvas rendering.
 */

/**
 * Base URL for the DiceBear avatar API.
 * @type {string}
 */
const avatarApiBaseUrl = 'https://api.dicebear.com/9.x/pixel-art/svg';

/**
 * Generates a DiceBear avatar URL for a given seed value.
 * 
 * @function getAvatarUrl
 * @param {string} seed - The seed value used to generate the avatar
 * @returns {string} The complete DiceBear API URL for the avatar
 */
const getAvatarUrl = (seed) => {
    return `${avatarApiBaseUrl}?seed=${encodeURIComponent(seed)}`;
}

/**
 * Fetches an avatar SVG from DiceBear API and returns it as a URI-encoded data URI.
 * This async function retrieves the SVG content and encodes it for direct use in image sources.
 * 
 * @async
 * @function getAvatarUrlEncoded
 * @param {string} username - The username to generate an avatar for (used as seed)
 * @returns {Promise<string>} A data URI containing the URI-encoded SVG avatar
 * @throws {Error} If username is not provided or is empty
 */
const getAvatarUrlEncoded = async (username) => {
    if (!username) {
        throw new Error('Username is required to generate avatar URL.');
    }
    const seed = username.trim();
    const url = getAvatarUrl(seed);

    // Fetch the actual SVG content
    const response = await fetch(url);
    const svgText = await response.text();
    
    // Encode the SVG content using URI encoding
    return `data:image/svg+xml,${encodeURIComponent(svgText)}`;
}

/**
 * Exported function to generate URI-encoded avatar data URIs.
 * @exports getAvatarUrlEncoded
 */
export { getAvatarUrlEncoded };