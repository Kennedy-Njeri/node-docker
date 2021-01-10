const request = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { userOne, userOneId, userTwoId, setupDatabase} = require('./fixtures/db')


beforeEach(setupDatabase)




test('Should sign up user', async () => {
    const response = await request(app).post('/api/signup').send({
        name: 'Vincent',
        email: 'vincent@gmail.com',
        password: 'MyPass2020!'
    }).expect(201)

    //grab the user saved in the database // confirm user is saved in the db
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()


    // assert the data response
    expect(response.body).toMatchObject({
        user: {
            name: 'Vincent',
            email: 'vincent@gmail.com'
        }
    })
    expect(user.password).not.toBe('MyPass2020!')
})


test('Should login existing user', async () => {
    const response = await request(app).post('/api/signin').send({
        email: userOne.user.email,
        password: userOne.user.password
    }).expect(200)
    const  user = await User.findById(userOneId)
    expect(response.body.user.token).toBe(user.token)
})


test('Should not login nonexistent user', async () => {
    await request(app).post('/api/signin').send({
        email: userOne.email,
        password: 'theisnotmypass'
    }).expect(400)
})



test('should get profile for user', async () => {
    await request(app)
        .get(`/api/user/${userOneId}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send()
        .expect(200)
})


test('Should update valid user fields', async () => {
    await request(app)
        .put(`/api/user/${userOneId}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            name: 'Kevin durant'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Kevin durant')
})


test('Should not invalid user fields', async () => {
    await request(app)
        .put(`/api/user/${userOneId}`)
        .set('Authorization', `Bearer ${userOne.token}`)
        .send({
            location: "Nairobi",

        })
        .expect(200)

})