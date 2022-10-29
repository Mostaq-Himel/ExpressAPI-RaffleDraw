const { readFile, writeFile, writeFileSync } = require('./utils');
const Ticket = require('./Ticket.model');

const tickets = Symbol('tickets');

class TicketCollection {
    constructor() {
        (async function dbArray() {
            this[tickets] = await readFile();
        }.call(this));
    }

    /**
     * Create a new ticket and update the collection
     * @param {string} username
     * @param {number} price
     * @returns {Ticket} ticket
     */
    create(username, price) {
        const ticket = new Ticket(username, price);
        this[tickets].push(ticket);
        writeFile(this[tickets]);
        return ticket;
    }

    /**
     * create multiple tickets for one user
     * @param {string} username name of user
     * @param {number} count number of tickets
     * @returns {Ticket[]} tickets
     */
    createBulk(username, price, count) {
        const result = [];
        for (let i = 0; i < count; i++) {
            const ticket = this.create(username, price);
            result.push(ticket);
        }
        return result;
    }

    /**
     * Get all tickets
     * @returns {tickets[]} all tickets
     */
    find() {
        return this[tickets];
    }

    /**
     * Find ticket using id
     * @param {number} id
     * @returns {ticketFound} matched ticket
     */
    findById(id) {
        const ticketFound = this[tickets].find((ticket) => ticket.id === id);
        return ticketFound;
    }

    /**
     * Find all tickets using username of the owner
     * @param {string} username
     * @returns {tickets[]} filterd tickets
     */
    findByUsername(username) {
        const ticketsFound = this[tickets].filter((ticket) => ticket.username === username);
        return ticketsFound;
    }

    /**
     * Update information of a ticket
     * @param {number} ticketId
     * @param {object} ticketBody Ticket properties to be updated
     * @returns {ticket} updated ticket
     */
    updateById(ticketId, ticketBody) {
        const ticket = this.findById(ticketId);
        if (ticket) {
            ticket.username = ticketBody.username ?? ticket.username;
            ticket.price = ticketBody.price ?? ticket.price;
        }
        writeFile(this[tickets]);

        return ticket;
    }

    /**
     * Update multiple tickets
     * @param {string} username name of the user
     * @param {object} ticketBody ticket properties to be updated
     * @returns {Ticket[]} updated tickets
     */
    updateBulk(username, ticketBody) {
        const ticketsFound = this.findByUsername(username);
        const updatedTickets = ticketsFound.map((ticket) => this.updateById(ticket.id, ticketBody));
        return updatedTickets;

        // // Another implementation
        // const result = [];
        // for (let i = 0; i < ticketsFound.length; i++) {
        //     const ticket = this.updateById(ticketsFound[i].id, ticketBody);
        //     result.push(ticket);
        // }
        // return result;
    }

    /**
     * Delete single ticket by id
     * @param {number} id
     * @returns {boolean} boolean
     */
    deleteById(id) {
        const index = this[tickets].findIndex((ticket) => ticket.id === id);
        if (index >= 0) {
            this[tickets].splice(index, 1);
            writeFileSync(this[tickets]);
            return true;
        }
        return false;
    }

    /**
     * Delete all tickets of one user
     * @param {string} username name of the user
     * @returns {Boolean[]} boolean array
     */
    deleteBulk(username) {
        const ticketsFound = this.findByUsername(username);
        const deletedStatus = ticketsFound.map((ticket) => this.deleteById(ticket.id));
        return deletedStatus;
    }

    /**
     * Draw for winners
     * @param {number} winnerCount number of winners
     * @returns {Ticket[]} winners array
     */
    draw(winnerCount = 1) {
        const winners = [];
        let winnerIndex = 0;
        const indexMap = {};
        while (winnerIndex < winnerCount) {
            const ticketIndex = Math.floor(Math.random() * this[tickets].length);
            if (!indexMap[ticketIndex]) {
                winners[winnerIndex++] = this[tickets][ticketIndex];
            }
        }
        return winners;
    }
}

const ticketCollection = new TicketCollection();
module.exports = ticketCollection;
