# Source code for Montetalks

Minimal setup for Bullmq with Bull arena and Bull-board.

## Requirements to run

Node.js v14+

```
npm install
```

Docker

```
docker-compose up
```

## How to run

```
npm run server
npm run workers
```

## Dashboards

With default config:

Bull arena is available at: http://localhost:3000/arena

Bull-board is available at: http://localhost:3000/bull-board

## Triggering events

```
POST http://localhost:3010/hello-world
POST http://localhost:3010/heavy-computing?number=2
POST http://localhost:3010/retryable
```

Recommended `REST Client` for VSC so you can use `.http` files.

---

## ratelimiter
https://www.npmjs.com/package/ratelimiter
```

```
## bottleneck
https://www.npmjs.com/package/bottleneck#submit

정확한 컨셉이해 부족, 동작방식 테스트 더 필요

- bottleneck이 없는 경우 잡이 모두 통과하게 된다.
- bottleneck이 있는 경우, minTime 만큼 기다리고 큐에 들어간다.?
- bottleneck이 있는 경우, maxConcurrent 만큼만 처리한다. 

```js
import Bottleneck from "bottleneck";

const bottleneckLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
  id: "my-super-app",
  datastore: "ioredis",
  clearDatastore: false,
  clientOptions: {
    host: "localhost",
    port: 5059,
  },
});


const LimitedWork = async () =>
  bottleneckLimiter.schedule(async () => {
    await sleep(3000);
    return getRandomInt(1, 100);
  });

  app.get("/bottle-neck", async (req, res) => {
    const result: number[] = await Promise.all(
      new Array(10).fill(1).map(async (_, i) => {
        const nums = await LimitedWork();
        console.log("[info] bottle : ", i);
        return nums;
      })
    );
    res.json({ result });
  });

```