const Tag = require('../models/Tag');

const tagController = {
    getAllTags: async (req, res) => {
        try {
            let tags = await Tag.find();
            res.status(200).send({
                success: true,
                tags
            });
        } catch (error) {
            console.log(error);
            res.status(400).send({
                success: false,
                error
            });
        }
    }
}

module.exports = tagController;