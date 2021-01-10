const Task = require('../models/task');
const { errorHandler } = require('../helpers/dbErrorHandler');



exports.create = async (req, res) => {
    const task = new Task({...req.body, user: req.profile._id });
    await task.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.status(201).json({ data });
    });
};

exports.taskById = async (req, res, next, id) => {
    await Task.findById({ _id: id })
        .exec((err, task) => {
            if (err || !task) {
                return res.status(400).json({
                    error: 'Task not found'
                });
            }
            req.task = task;
            next();
        });
};

exports.read = (req, res) => {
    return res.json(req.task);
};


exports.list1 = async (req, res) => {

    await Task.find({ user: req.profile._id}).then((data) => {
        return res.send(data)
    }).catch((err) => {
        res.status(500).send(err)
    })
}

exports.remove = async (req, res) => {
    let task = req.task;
    await task.remove((err, deletedTask) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: `Task ${deletedTask} deleted successfully`
        });
    });
};


exports.update = async (req, res) => {
    await Task.findByIdAndUpdate({ _id: req.task, user: req.profile._id}, req.body, { new: true, runValidators: true })
        .exec((err, task) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({
                message: `Task ${task} updated successfully`
            })
    })
};


// GET /tasks?completed=true
// GET /tasks?limit=1
// GET /tasks?sortBy=createdAt:desc

exports.list = async (req, res) => {
    let match = req.query.completed ? req.query.completed : 'false'
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    await Task.find({ owner: req.profile._id})
        .populate('user', { match: match})
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, tasks) => {
            if (err) {
                return res.status(400).json({
                    error: 'Tasks not found'
                });
            }
            res.json(tasks);
        });
};

