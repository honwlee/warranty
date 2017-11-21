module.exports = {
    validate: function(model, arg, req, res) {
        let existed = false,
            result;
        for (let key in arg) {
            let opt = {};
            opt[key] = arg[key];
            if (model.findBy(opt)) {
                existed = true;
                return result = { status: false, msg: "already exists: " + key, key: key, value: opt[key] };
            } else {
                continue;
            }
        }
        if (existed) {
            res.json(result);
        } else {
            res.json({
                status: true,
                result: model.create(req.body)
            });
        }
    }
}
