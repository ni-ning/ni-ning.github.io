# 启动常用镜像

## alpine
```
docker run -it --rm alpine /bin/sh
```

## rabbitmq
```
docker run -d  --rm --name rabbitmq  \
-p 5672:5672 \
-p 5671:5671 \
-p 4369:4369 \
-p  25672:25672 \
rabbitmq
```

## redis
```
docker run -d --rm --name redis -p 6379:6379 redis:alpine
```
