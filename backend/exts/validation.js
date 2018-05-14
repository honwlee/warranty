module.exports = {
    validate: function(model, arg, req, res, method = "create") {
        let existed = false,
            result;
        for (let key in arg) {
            let opt = {};
            opt[key] = arg[key];
            if (model.findBy(opt)) {
                existed = true;
                result = { status: false, validate: true, msg: "already exists: " + key, key: key, value: opt[key] };
                break;
            } else {
                continue;
            }
        }
        if (existed) {
            res.json(result);
        } else {
            res.json({
                status: true,
                result: model[method](req.body)
            });
        }
    }
}