# 로깅에 트랜잭션 ID 추가하기

```ts
const express = require('express');
const rTracer = require('cls-rtracer');

const app = express();

app.use(rTracer.expressMiddleware());

app.get('/getUserData/{id}', async (req, res, next) => {
    try {
        const user = await usersRepo.find(req.params.id);

        // The TransactionId is reachable from inside the logger, there's no need to send it over
        logger.info(`user ${user.id} data was fetched successfully`);

        res.json(user);
    } catch (err) {
        // The error is being passed to the middleware
        next(err);
    }
})

// Error handling middleware calls the logger
app.use(async (err, req, res, next) => {
    await logger.error(err);
});

// The logger can now append the TransactionId to each entry so that entries from the same request will have the same value
class logger {
    error(err) {
        console.error(`${err} ${rTracer.id()}`);
    }
    
    info(message) {
        console.log(`${message} ${rTracer.id()}`);
    }
}
```
