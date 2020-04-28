// Update with your config settings.
module.exports = {
    dev: {
        client: process.env.DB,
        connection: process.env.DB_URI
    },
    prod: {
        client: process.env.DB,
        connection: process.env.DB_URI
    }
}
