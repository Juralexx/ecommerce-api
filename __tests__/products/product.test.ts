import supertest from "supertest"
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { product } from "./product"

const root = process.env.SERVER_URL_TEST

describe('Product', () => {
    describe('Get all products', () => {
        it('Should return all products', async () => {
            const { body, statusCode } = await supertest(root)
                .get('/api/products')
                .set('Authorization', process.env.API_KEY)

            expect(statusCode).toBe(200)
            expect(Array.isArray(body.documents)).toBe(true)
        })
    })

    describe('Get product', () => {
        describe('Product does not exist', () => {
            it('should return : status => 400', async () => {
                const id = '1'

                const { statusCode } = await supertest(root)
                    .get(`/api/products/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(400)
            })
        })

        describe('Product does exist', () => {
            it('Should return : status => 200', async () => {
                const id = '645458f901957119fef0b04c'

                const { body, statusCode } = await supertest(root)
                    .get(`/api/products/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(200)
                expect(body._id).toBe(id)
            })
        })
    })

    describe('Product CRUD', () => {
        let ProductID = new String()

        it('Should create product', async () => {
            await supertest(root)
                .post(`/api/products/create`)
                .send({ ...product })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res;

                    expect(statusCode).toBe(200)
                    expect(body._id).not.toBeNull()
                    expect(body.name).toBe(product.name)
                    expect(body.category).toBe(product.category._id)
                    expect(body.variants).toHaveLength(2)
                    expect(body.promotions).toHaveLength(0)
                    expect(body.images).toHaveLength(2)
                    expect(body.description).toBe(product.description)
                    expect(body.content).toBe(product.content)
                    expect(body.details).toHaveLength(6)

                    ProductID = body._id
                })
                .catch(err => console.log(err))
        })

        it('Should update product', async () => {
            await supertest(root)
                .put(`/api/products/${ProductID}/update`)
                .send({ name: 'Lorem ipsum' })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body.name).toBe('Lorem ipsum')
                })
                .catch(err => console.log(err))
        })

        it('Should delete product', async () => {
            await supertest(root)
                .delete(`/api/products/${ProductID}/delete`)
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body._id).toBe(ProductID)
                })
                .catch(err => console.log(err))
        })
    })
})