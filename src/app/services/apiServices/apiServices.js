class apiServices {
    async saveMovementMode(req) {
        const user_id = req.session.user_id;
        const mode = req.body.mode;
        const user = await userRepository.findOne({ _id: user_id });
        user.settings.movementMode = mode;
        user.markModified('settings');
        const status = await user.save();
        if(!status) {
            return {
                status: 'failed',
                title: 'Lưu thất bại',
                content: 'Đã có lỗi xảy ra'
            }
        }
        return {
            status: 'success',
            title: 'Lưu thành công',
            content: 'Chế độ di chuyển đã được cập nhật'
        }
    }
}

module.exports = new apiServices;