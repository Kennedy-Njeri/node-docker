const request = require('supertest')
const Task = require('../models/task')
const app = require('../app')
const {
    userOne,
    userOneId,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
} = require('./fixtures/db')


beforeEach(setupDatabase)



test('Should create task for user', async () => {
    const response = await request(app)
        .post(`/api/tasks/create/${userOneId}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({ description: 'First take'})
        .expect(201)

    const task = await Task.findById(response.body.data._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})


test('fetch user tasks', async () => {
    const response = await request(app)
        .get(`/api/tasks/${userOneId}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send().expect(200)
    expect(response.body.length).toEqual(2)
})

// template string
test('should not delete other users task', async () => {
    await request(app)
        .delete(`/api/remove/tasks/${taskOne._id}/${userTwoId}`)
        .set('Authorization', `Bearer ${userTwo.token}`)
        .send().expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})
