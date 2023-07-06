import supertest from "supertest"
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

const root = process.env.SERVER_URL_TEST

describe('Authentication', () => {
    describe('Login', () => {
        it('Should fail login attempt', async () => {
            const user = {
                email: 'email@email.com',
                password: '123456'
            }

            const { statusCode } = await supertest(root)
                .post('/api/users/login')
                .set('Authorization', process.env.API_KEY)
                .send({ ...user })

            expect(statusCode).toBe(400)
        })

        it('Should succeed login attempt', async () => {
            const user = {
                email: 'alexandre.vurbier@gmail.com',
                password: '09081995*'
            }

            await supertest(root)
                .post('/api/users/login')
                .set('Authorization', process.env.API_KEY)
                .send({ ...user })
                .then(res => {
                    const { body, statusCode } = res
                    expect(statusCode).toBe(200)
                    expect(body).toHaveProperty('user')
                })
                .catch(err => console.log(err))
        })
    })

    describe('Register', () => {
        let UserID = new String()

        it('Should fail registration attempt', async () => {
            const user = {
                email: 'email@email.com',
                password: '123456'
            }

            const { statusCode } = await supertest(root)
                .post('/api/users/register')
                .set('Authorization', process.env.API_KEY)
                .send({ ...user })

            expect(statusCode).toBe(400)
        })

        it('Should succeed registration attempt', async () => {
            const user = {
                email: 'john.doe@gmail.com',
                password: 'Password1234*',
                name: 'John',
                lastname: 'Doe',
                role: 'user'
            }

            await supertest(root)
                .post('/api/users/register')
                .set('Authorization', process.env.API_KEY)
                .send({ ...user })
                .then(res => {
                    const { body, statusCode } = res
                    expect(statusCode).toBe(200)
                    expect(body).toHaveProperty('_id')

                    UserID = body._id
                })
                .catch(err => console.log(err))
        })

        it('Should update user', async () => {
            await supertest(root)
                .put(`/api/users/${UserID}/update`)
                .set('Authorization', process.env.API_KEY)
                .send({ role: 'editor' })
                .then(res => {
                    const { body, statusCode } = res
                    expect(statusCode).toBe(200)
                    expect(body.role).toBe('editor')
                })
                .catch(err => console.log(err))
        })

        it('Should delete user', async () => {
            await supertest(root)
                .delete(`/api/users/${UserID}/delete`)
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res
                    expect(statusCode).toBe(200)
                    expect(body._id).toBe(UserID)
                })
                .catch(err => console.log(err))
        })
    })

    describe('Get all users', () => {
        it('Should return all users', async () => {
            const { body, statusCode } = await supertest(root)
                .get('/api/users')
                .set('Authorization', process.env.API_KEY)

            expect(statusCode).toBe(200)
            expect(Array.isArray(body)).toBe(true)
        })
    })

    describe('Get user', () => {
        describe('User does not exist', () => {
            it('Should return error', async () => {
                const id = '1'

                const { statusCode } = await supertest(root)
                    .get(`/api/users/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(400)
            })
        })

        describe('User does exist', () => {
            it('Should return user', async () => {
                const id = '643b2340567ce6fc51da39ec'

                const { body, statusCode } = await supertest(root)
                    .get(`/api/users/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(200)
                expect(body._id).toBe(id)
            })
        })
    })
})