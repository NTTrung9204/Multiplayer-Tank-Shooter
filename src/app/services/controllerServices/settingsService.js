class settingsService {
    async settingMovementModeHandler(user_id) {
        const user = await userRepository.findOne({ _id: user_id });
        const currentMoveMode = user?.settings?.movementMode;
        const isRotateMode = currentMoveMode === "rotateMode" ? true : false;
        const isFreeMode = !isRotateMode;

        return { isRotateMode, isFreeMode };
    }
}

module.exports = new settingsService;
