import supertest from "supertest"
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

const root = process.env.SERVER_URL_TEST

describe('Authentication', () => {
    describe('Login', () => {
        it('Should fail login attempt', async () => {
            const customer = {
                email: 'email@email.com',
                password: '123456'
            }

            const { statusCode } = await supertest(root)
                .post('/api/customers/login')
                .set('Authorization', process.env.API_KEY)
                .send({ ...customer })

            expect(statusCode).toBe(400)
        })

        it('Should succeed login attempt', async () => {
            const customer = {
                email: 'Dean17@yahoo.com',
                password: '09081995*'
            }

            await supertest(root)
                .post('/api/customers/login')
                .set('Authorization', process.env.API_KEY)
                .send({ ...customer })
                .then(res => {
                    const { body, statusCode } = res
                    expect(statusCode).toBe(200)
                    expect(body).toHaveProperty('user')
                })
                .catch(err => console.log(err))
        })
    })

    describe('Register', () => {
        let CustomerID = new String()

        it('Should fail registration attempt', async () => {
            const customer = {
                email: 'email@email.com',
                password: '123456'
            }

            const { statusCode } = await supertest(root)
                .post('/api/customers/register')
                .set('Authorization', process.env.API_KEY)
                .send({ ...customer })

            expect(statusCode).toBe(400)
        })

        it('Should succeed registration attempt', async () => {
            const customer = {
                email: 'john.doe@gmail.com',
                password: 'Password1234*',
                name: 'John',
                lastname: 'Doe',
                title: 'M'
            }

            await supertest(root)
                .post('/api/customers/register')
                .set('Authorization', process.env.API_KEY)
                .send({ ...customer })
                .then(res => {
                    const { body, statusCode } = res
                    expect(statusCode).toBe(200)
                    expect(body).toHaveProperty('_id')

                    CustomerID = body._id
                })
                .catch(err => console.log(err))
        })

        it('Should update customer', async () => {
            await supertest(root)
                .put(`/api/customers/${CustomerID}/update`)
                .set('Authorization', process.env.API_KEY)
                .send({ name: 'Foo' })
                .then(res => {
                    const { body, statusCode } = res
                    expect(statusCode).toBe(200)
                    expect(body.name).toBe('Foo')
                })
                .catch(err => console.log(err))
        })

        it('Should delete customer', async () => {
            await supertest(root)
                .delete(`/api/customers/${CustomerID}/delete`)
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res
                    expect(statusCode).toBe(200)
                    expect(body._id).toBe(CustomerID)
                })
                .catch(err => console.log(err))
        })
    })

    describe('Get all customers', () => {
        it('Should return all customers', async () => {
            const { body, statusCode } = await supertest(root)
                .get('/api/customers')
                .set('Authorization', process.env.API_KEY)

            expect(statusCode).toBe(200)
            expect(Array.isArray(body.documents)).toBe(true)
        })
    })

    describe('Get customer', () => {
        describe('Customer does not exist', () => {
            it('Should return error', async () => {
                const id = '1'

                const { statusCode } = await supertest(root)
                    .get(`/api/customers/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(400)
            })
        })

        describe('Customer does exist', () => {
            it('Should return customer', async () => {
                const id = '6454592501957119fef0b469'

                const { body, statusCode } = await supertest(root)
                    .get(`/api/customers/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(200)
                expect(body._id).toBe(id)
            })
        })
    })
})