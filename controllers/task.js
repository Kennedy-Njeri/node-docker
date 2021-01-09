const Task = require('../models/task');
const { errorHandler } = require('../helpers/dbErrorHandler');



exports.create = async (req, res) => {
    const task = new Task({user: req.profile, ...req.body });
    await task.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
};

exports.taskById = async (req, res, next, id) => {
    await Task.findById({ _id: id, user: req.profile._id })
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

    await Task.find()
        .select('-photo')
        .populate('category')
        .sort([[match, sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Tasks not found'
                });
            }
            res.json(products);
        });
};

