const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const Task = require('../../models/task')



// user one
const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    user : {
        _id: userOneId,
        name: 'Lebron',
        email: 'lebron@gmail.com',
        password: 'Lebron@2020!',
    }
}


// user two
const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    user : {
        _id: userTwoId,
        name: 'Kevin',
        email: 'durant@gmail.com',
        password: 'Durant@2020!',
    }   
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    user: userOneId
}


const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completed: true,
    user: userOneId
}


const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Task',
    completed: true,
    user: userTwoId
}





const setupDatabase = async () => {
    // deletes all users b4 all user test cases are run
    await User.deleteMany()
    await Task.deleteMany()
    // ensure we have data for testing e.g logging in
    await new User(userOne.user).save()
    await new User(userTwo.user).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}


// object shorthand notation
module.exports = {
    userOne, userOneId, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDatabase
}