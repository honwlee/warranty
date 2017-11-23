module.exports = {
    validate: function(model, arg, req, res) {
        let existed = false,
            result;
        console.log(111111);
        for (let key in arg) {
            let opt = {};
            opt[key] = arg[key];
            if (model.findBy(opt)) {
                existed = true;
                console.log(2222222);
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
                result: model.create(req.body)
            });
        }
    }
}
