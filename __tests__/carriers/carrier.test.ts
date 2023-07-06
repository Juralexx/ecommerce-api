import supertest from "supertest"
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { carrier } from "./carrier"

const root = process.env.SERVER_URL_TEST

describe('Carrier', () => {
    describe('Get all carriers', () => {
        it('Should return all carriers', async () => {
            const { body, statusCode } = await supertest(root)
                .get('/api/carriers')
                .set('Authorization', process.env.API_KEY)

            expect(statusCode).toBe(200)
            expect(Array.isArray(body)).toBe(true)
        })
    })

    describe('Get carrier', () => {
        describe('Carrier does not exist', () => {
            it('should return : status => 400', async () => {
                const id = '1'

                const { statusCode } = await supertest(root)
                    .get(`/api/carriers/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(400)
            })
        })

        describe('Carrier does exist', () => {
            it('Should return : status => 200', async () => {
                const id = '64480190eb92450ca3250c38'

                const { body, statusCode } = await supertest(root)
                    .get(`/api/carriers/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(200)
                expect(body._id).toBe(id)
            })
        })
    })

    describe('Carrier CRUD', () => {
        let CarrierID = new String()

        it('Should create carrier', async () => {
            await supertest(root)
                .post(`/api/carriers/create`)
                .send({ ...carrier })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body._id).not.toBeNull()
                    expect(body.published).toBe(false)
                    expect(body.name).toBe(carrier.name)
                    expect(body.description).toBe(carrier.description)
                    expect(body.price).toBe(carrier.price)

                    CarrierID = body._id
                })
                .catch(err => console.log(err))
        })

        it('Should update carrier', async () => {
            await supertest(root)
                .put(`/api/carriers/${CarrierID}/update`)
                .send({ name: 'Lorem ipsum' })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body.name).toBe('Lorem ipsum')
                })
                .catch(err => console.log(err))
        })

        it('Should delete carrier', async () => {
            await supertest(root)
                .delete(`/api/carriers/${CarrierID}/delete`)
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body._id).toBe(CarrierID)
                })
                .catch(err => console.log(err))
        })
    })
})