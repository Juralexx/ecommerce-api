import supertest from "supertest"
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { category } from "./category"

const root = process.env.SERVER_URL_TEST

describe('Category', () => {
    describe('Get all categories', () => {
        it('Should return all categories', async () => {
            const { body, statusCode } = await supertest(root)
                .get('/api/categories')
                .set('Authorization', process.env.API_KEY)

            expect(statusCode).toBe(200)
            expect(Array.isArray(body)).toBe(true)
        })
    })

    describe('Get category', () => {
        describe('Category does not exist', () => {
            it('should return : status => 400', async () => {
                const id = '1'

                const { statusCode } = await supertest(root)
                    .get(`/api/categories/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(400)
            })
        })

        describe('Category does exist', () => {
            it('Should return : status => 200', async () => {
                const id = '645a8749d78955e48f08e2d1'

                const { body, statusCode } = await supertest(root)
                    .get(`/api/categories/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(200)
                expect(body._id).toBe(id)
            })
        })
    })

    describe('Category CRUD', () => {
        let CategoryID = new String()

        it('Should create category', async () => {
            await supertest(root)
                .post(`/api/categories/create`)
                .send({ ...category })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body._id).not.toBeNull()
                    expect(body.name).toBe(category.name)
                    expect(body.content).toBe(category.content)
                    expect(body.parent).toBe(category.parent)
                    expect(body.link).toBe(category.link)
                    expect(body.image).toBe(category.image._id)

                    CategoryID = body._id
                })
                .catch(err => console.log(err))
        })

        it('Should update category', async () => {
            await supertest(root)
                .put(`/api/categories/${CategoryID}/update`)
                .send({ name: 'Lorem ipsum' })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body.name).toBe('Lorem ipsum')
                })
                .catch(err => console.log(err))
        })

        it('Should delete category', async () => {
            await supertest(root)
                .delete(`/api/categories/${CategoryID}/delete`)
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body._id).toBe(CategoryID)
                })
                .catch(err => console.log(err))
        })
    })
})