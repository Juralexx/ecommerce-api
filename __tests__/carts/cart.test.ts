import supertest from "supertest"
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { cart } from "./cart"

const root = process.env.SERVER_URL_TEST

describe('Cart', () => {
    describe('Get all carts', () => {
        it('Should return all carts', async () => {
            const { body, statusCode } = await supertest(root)
                .get('/api/carts')
                .set('Authorization', process.env.API_KEY)

            expect(statusCode).toBe(200)
            expect(Array.isArray(body)).toBe(true)
        })
    })

    describe('Get cart', () => {
        describe('Cart does not exist', () => {
            it('should return : status => 400', async () => {
                const id = '1'

                const { statusCode } = await supertest(root)
                    .get(`/api/carts/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(400)
            })
        })

        describe('Cart does exist', () => {
            it('Should return : status => 200', async () => {
                const id = '6464e3dd3648f2419f4899ec'

                const { body, statusCode } = await supertest(root)
                    .get(`/api/carts/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(200)
                expect(body._id).toBe(id)
            })
        })
    })

    describe('Cart CRUD', () => {
        let CartID = new String()

        it('Should create cart', async () => {
            await supertest(root)
                .post(`/api/carts/create`)
                .send({ ...cart })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body._id).not.toBeNull()
                    expect(body.products).toHaveLength(1)

                    CartID = body._id
                })
                .catch(err => console.log(err))
        })

        it('Should update cart', async () => {
            await supertest(root)
                .put(`/api/carts/${CartID}/update`)
                .send({
                    products: [
                        {
                            "product": "6454590001957119fef0b157",
                            "variant": "6454590001957119fef0b157",
                            "quantity": 3,
                            "_id": "6464e3dd3648f2419f4899ef"
                        },
                        {
                            "product": "6454590001957119fef0b157",
                            "variant": "6454590001957119fef0b157",
                            "quantity": 3,
                            "_id": "6464e3dd3648f2419f4899ef"
                        }
                    ]
                })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body.products).toHaveLength(2)
                })
                .catch(err => console.log(err))
        })

        it('Should delete cart', async () => {
            await supertest(root)
                .delete(`/api/carts/${CartID}/delete`)
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body._id).toBe(CartID)
                })
                .catch(err => console.log(err))
        })
    })
})