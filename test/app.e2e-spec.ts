import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appService = app.get<AppService>(AppService);
    await app.init();
  });

  describe(`/ (GET)`, () => {
    it(`should return a random emoji`, () => {
      const emojis = appService.getEmojis();
      return request(app.getHttpServer())
        .get('/')
        .set(`x-api-key`, `SECRET`)
        .set(`user-agent`, `Chrome`)
        .expect(200)
        .expect(({ body }) => {
          const response = body.data;
          expect(response).toBeDefined();
          expect(response.browser).toBe(`Chrome`);
          expect(emojis).toContain(response.emoji);
        });
    });
    it(`should return an Unknown browser when no user-agent is used`, () => {
      const emojis = appService.getEmojis();
      return request(app.getHttpServer())
        .get('/')
        .set(`x-api-key`, `SECRET`)
        .expect(200)
        .expect(({ body }) => {
          const response = body.data;
          expect(response).toBeDefined();
          expect(response.browser).toBe(`Unknown`);
          expect(emojis).toContain(response.emoji);
        });
    });
    it(`should return 403 Forbidden when an invalid x-api-key is passed in`, () => {
      return request(app.getHttpServer()).get('/').expect(403);
    });
  });
  describe(`/?index=X (GET)`, () => {
    it(`should return the indexed emoji`, () => {
      const index = 1;
      const emojis = appService.getEmojis();
      const emoji = emojis[index];
      return request(app.getHttpServer())
        .get(`/?index=${index}`)
        .set(`x-api-key`, `SECRET`)
        .expect(200)
        .expect(({ body }) => {
          const response = body.data;
          expect(response.emoji).toBe(emoji);
        });
    });
    it(`should return a 400 if an non-number index is passed in`, () => {
      return request(app.getHttpServer())
        .get(`/?index=not-a-number`)
        .set(`x-api-key`, `SECRET`)
        .expect(400);
    });
    it(`should return a 400 if an negative index is passed in`, () => {
      return request(app.getHttpServer())
        .get(`/?index=-1`)
        .set(`x-api-key`, `SECRET`)
        .expect(400);
    });
    it(`should return a 400 if an index greater than 14 is passed in`, () => {
      return request(app.getHttpServer())
        .get(`/?index=15`)
        .set(`x-api-key`, `SECRET`)
        .expect(400);
    });
  });
});
