const router = require('express').Router();
const {
    findAll,
    findById,
    findByUsername,
    sellSingleTicket,
    sellBulk,
    updateById,
    updateByUsername,
    deleteById,
    deleteByUsername,
    drawWinners,
} = require('./routes.controllers');

router.route('/').get(findAll).post(sellSingleTicket);

router.route('/t/:id').get(findById).put(updateById).delete(deleteById);

router.route('/u/:username').get(findByUsername).put(updateByUsername).delete(deleteByUsername);

router.post('/bulk', sellBulk);
router.get('/draw', drawWinners);
module.exports = router;
