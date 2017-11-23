'use strict'

module.exports = {
    rescue: function(callback) {
        return async(...args) => {
            const handler = args.slice(-1).pop()

            try {
                return await callback(...args) // eslint-disable-line
            } catch (err) {
                return handler(err)
            }
        }
    },
    rescueRequest: function(req, res, callback) {
        try {
            return await callback();
        } catch (err) {
            return res.json({ status: false, system: true, msg: "system error: " + err });
        }
    }
}
