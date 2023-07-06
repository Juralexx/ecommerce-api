import supertest from "supertest"
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { promotion } from "./promotion"

const root = process.env.SERVER_URL_TEST

describe('Promotions', () => {
    describe('Get all promotions', () => {
        it('Should return all promotions', async () => {

            const { body, statusCode } = await supertest(root)
                .get('/api/promotions')
                .set('Authorization', process.env.API_KEY)

            expect(statusCode).toBe(200)
            expect(Array.isArray(body)).toBe(true)
        })
    })

    describe('Get promotion', () => {
        describe('Promotion does not exist', () => {
            it('should return : status => 400', async () => {
                const id = '1'

                const { statusCode } = await supertest(root)
                    .get(`/api/promotions/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(400)
            })
        })

        describe('Promotion does exist', () => {
            it('Should return : status => 200', async () => {
                const id = '645065ab5cab25512953d255'

                const { body, statusCode } = await supertest(root)
                    .get(`/api/promotions/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(200)
                expect(body._id).toBe(id)
            })
        })
    })

    describe('Promotion CRUD', () => {
        let PromotionID = new String()

        it('Should create promotion', async () => {
            await supertest(root)
                .post('/api/promotions/create')
                .send({ ...promotion })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body._id).not.toBeNull()
                    expect(body.type).toBe(promotion.type)
                    expect(body.code).toBe(promotion.code)
                    expect(body.value).toBe(promotion.value)
                    expect(body.description).toBe(promotion.description)
                    expect(body.start_date).toBe(promotion.start_date)
                    expect(body.end_date).toBe(promotion.end_date)
                    expect(typeof body.condition === 'object').toBe(true)
                    expect(body.condition.type).toBe(promotion.condition.type)
                    expect(body.condition.products).toHaveLength(3)
                    expect(body.condition.categories).toHaveLength(0)
                    expect(body.is_active).toBe(true)

                    PromotionID = body._id
                })
                .catch(err => console.log(err))
        })

        it('Should update promotion', async () => {
            await supertest(root)
                .put(`/api/promotions/${PromotionID}/update`)
                .send({ description: 'Lorem ipsum' })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body.description).toBe('Lorem ipsum')
                })
                .catch(err => console.log(err))
        })

        it('Should delete promotion', async () => {
            await supertest(root)
                .delete(`/api/promotions/${PromotionID}/delete`)
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body._id).toBe(PromotionID)
                })
                .catch(err => console.log(err))
        })
    })
})