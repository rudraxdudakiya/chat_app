const keyStokeSound=[
    new Audio('/sounds/keystroke1.mp3'),
    new Audio('/sounds/keystroke2.mp3'),
    new Audio('/sounds/keystroke3.mp3'),
    new Audio('/sounds/keystroke4.mp3')
]

function useKeyboardSound() {
    const playRandomKeyStrokeSound = () => {
        const sound = keyStokeSound[Math.floor(Math.random() * keyStokeSound.length)];
        sound.currentTime = 0;
        sound.play().catch((error) => console.log("Audio play failed:", error));
    };
    return { playRandomKeyStrokeSound };
}
export default useKeyboardSound;