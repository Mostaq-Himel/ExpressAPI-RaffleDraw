const ticketCollection = require('./tickets');

const controllers = {
    // selling tickets controllers
    sellSingleTicket(req, res) {
        const { username, price } = req.body;
        const ticket = ticketCollection.create(username, price);
        return res.status(200).json({
            message: 'Ticket created successfully',
            ticket,
        });
    },
    sellBulk(req, res) {
        const { username, price, count } = req.body;
        const tickets = ticketCollection.createBulk(username, price, count);
        return res.status(200).json({
            message: 'Tickets created successfully',
            tickets,
        });
    },

    // find tickets controllers
    findAll(_req, res) {
        const tickets = ticketCollection.find();
        return res.status(200).json({ items: tickets, total: tickets.length });
    },

    findById(req, res) {
        const { id } = req.params;
        const ticket = ticketCollection.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'No such ticket found' });
        }
        return res.status(200).json(ticket);
    },
    findByUsername(req, res) {
        const { username } = req.params;
        const tickets = ticketCollection.findByUsername(username);
        return res.status(200).json({ item: tickets, total: tickets.length });
    },

    // Update tickets controllers
    updateById(req, res) {
        const { id } = req.params;
        const ticket = ticketCollection.updateById(id, req.body);
        if (!ticket) {
            return res.status(404).json({ message: 'No such ticket found' });
        }
        return res.status(200).json(ticket);
    },
    updateByUsername(req, res) {
        const { username } = req.params;
        const tickets = ticketCollection.updateBulk(username, req.body);
        return res.status(200).json({ item: tickets, total: tickets.length });
    },

    // Delete tickets controllers
    deleteById(req, res) {
        const { id } = req.params;
        const isDeleted = ticketCollection.deleteById(id);
        if (!isDeleted) {
            return res.status(400).json({ message: 'Deletion failed' });
        }
        return res.status(200).json({ message: 'Ticket deleted' });
    },
    deleteByUsername(req, res) {
        const { username } = req.params;
        ticketCollection.deleteBulk(username);
        return res.status(200).json({ message: 'Success' });
    },

    // Draw controller
    drawWinners(req, res) {
        const wc = req.query.wc ?? 1;
        const winners = ticketCollection.draw(wc);
        return res.status(200).json(winners);
    },
};

module.exports = controllers;
