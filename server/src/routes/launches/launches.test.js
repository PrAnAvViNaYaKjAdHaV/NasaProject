
const request = require('supertest');
const app = require('../../app.js');
const { mongoConnect, mongoDisconnect } = require('../../services.js/mongo.js')


describe('LaunchesAPI', () => {

    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe('Test GET /launches', () => {
        test('It shoul respond with 200 success', async () => {
            await request(app)
                .get('/v1/launches')
                .expect('content-type', /json/)
                .expect(200);
        });
    });

    describe('Test POST /launch', () => {
        const CompleteLaunchData = {
            mission: 'mission',
            rocket: 'Ncc',
            target: 'Kepler-1652 b',
            launchDate: 'January 4, 2028',
        };

        const launchdataWithoutDate = {
            mission: 'mission',
            rocket: 'Ncc',
            target: 'Kepler-1652 b',
        };
        const wrongLaunchDate = {
            mission: 'mission',
            rocket: 'Ncc',
            target: 'Kepler-1652 b',
            launchDate: 'zoo',
        }
        test('It should respond with 201 success', async () => {
            const respone = await request(app)
                .post('/v1/launches')
                .send(CompleteLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);

            const requestDate = new Date(CompleteLaunchData.launchDate).valueOf();
            const responseDate = new Date(respone.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(respone.body).toMatchObject(launchdataWithoutDate);
        });

        test('It should catch missing required properties', async () => {
            const respone = await request(app)
                .post('/v1/launches')
                .send(launchdataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(respone.body).toStrictEqual({
                error: 'Missing required launch property'
            })
        });

        test('It should catch invalid dates', async () => {
            const respone = await request(app)
                .post('/v1/launches')
                .send(wrongLaunchDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(respone.body).toStrictEqual({
                error: 'Invalid launch date'
            })
        });
    });

})

