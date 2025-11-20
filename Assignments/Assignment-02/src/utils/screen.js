let screenOrientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";

window.addEventListener('resize', () => {
    screenOrientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
});

export const getScreenOrientation = () => screenOrientation;
export default getScreenOrientation;