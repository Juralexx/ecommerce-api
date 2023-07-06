import supertest from "supertest"
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { page } from "./page"

const root = process.env.SERVER_URL_TEST

describe('Page', () => {
    describe('Get all pages', () => {
        it('Should return all pages', async () => {
            const { body, statusCode } = await supertest(root)
                .get('/api/pages')
                .set('Authorization', process.env.API_KEY)

            expect(statusCode).toBe(200)
            expect(Array.isArray(body)).toBe(true)
        })
    })

    describe('Get page', () => {
        describe('Page does not exist', () => {
            it('should return : status => 400', async () => {
                const id = '1'

                const { statusCode } = await supertest(root)
                    .get(`/api/pages/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(400)
            })
        })

        describe('Page does exist', () => {
            it('Should return : status => 200', async () => {
                const id = '64480190eb92450ca3250c38'

                const { body, statusCode } = await supertest(root)
                    .get(`/api/pages/${id}`)
                    .set('Authorization', process.env.API_KEY)

                expect(statusCode).toBe(200)
                expect(body._id).toBe(id)
            })
        })
    })

    describe('Page CRUD', () => {
        let PageID = new String()

        it('Should create page', async () => {
            await supertest(root)
                .post(`/api/pages/create`)
                .send({ ...page })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body._id).not.toBeNull()
                    expect(body.published).toBe(false)
                    expect(body.title).toBe(page.title)
                    expect(body.content).toBe(page.content)
                    expect(body.link).toBe(page.link)

                    PageID = body._id
                })
                .catch(err => console.log(err))
        })

        it('Should update page', async () => {
            await supertest(root)
                .put(`/api/pages/${PageID}/update`)
                .send({ title: 'Lorem ipsum' })
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body.title).toBe('Lorem ipsum')
                })
                .catch(err => console.log(err))
        })

        it('Should delete page', async () => {
            await supertest(root)
                .delete(`/api/pages/${PageID}/delete`)
                .set('Authorization', process.env.API_KEY)
                .then(res => {
                    const { body, statusCode } = res

                    expect(statusCode).toBe(200)
                    expect(body._id).toBe(PageID)
                })
                .catch(err => console.log(err))
        })
    })
})