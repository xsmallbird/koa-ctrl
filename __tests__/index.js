const request = require('supertest')
const Koa = require('koa')
const Controller = require('..')

describe('parma error', () => {
  it('missing controller name', async () => {
    const controller = new Controller()

    let error
    try {
      controller.action()
    } catch (err) {
      error = err
    }

    expect(error.message).toBe('missing controller name')
  })

  it('missing executable options', async () => {
    const controller = new Controller()

    let error
    try {
      controller.action('doHello')
    } catch (err) {
      error = err
    }

    expect(error.message).toBe('missing executable action')
  })
})

describe('action is function', () => {
  let app, server

  beforeAll(done => {
    app = new Koa()
    server = app.listen(done)
  })

  afterAll(done => {
    server.close(done)
  })

  it('success', async () => {
    const controller = new Controller()

    controller.action('doHello', async (ctx, next) => {
      ctx.body = 'hello'
      await next()
    })

    app.use(controller.doHello)

    await request(server)
      .get('/')
      .expect(200, 'hello')
  })
})

describe('action is object', () => {
  let app, server

  beforeAll(done => {
    app = new Koa()
    server = app.listen(done)
  })

  afterAll(done => {
    server.close(done)
  })

  it('success', async () => {
    const controller = new Controller()

    controller.action('doHello', {
      before: async (ctx, next) => {
        ctx.body = 'before'
        await next()
      },
      action: async (ctx, next) => {
        ctx.body += '->action'
        await next()
      },
      after: async (ctx, next) => {
        ctx.body += '->after'
        await next()
      }
    })

    app.use(controller.doHello)

    await request(server)
      .get('/')
      .expect(200, 'before->action->after')
  })
})
