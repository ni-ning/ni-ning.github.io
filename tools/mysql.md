





# 参考链接
- [Ubuntu下 MySql忘记密码解决方案](https://www.cnblogs.com/wuzdandz/p/10790458.html)

```
docker run --name jms_all -d -v /opt/jumpserver:/opt/jumpserver/data/media -p 80:80 -p 2222:2222 -e SECRET_KEY=qQfGDg3UXRq4BTzIsjuUoct0xwqdzzCn9m40iFyvYe07LOR9XV -e BOOTSTRAP_TOKEN=DVTTlk74yMI72pYA -e DB_HOST=127.0.0.1 -e DB_PORT=3306 -e DB_USER=root -e DB_PASSWORD=ni-ning.cn -e DB_NAME=jumpserver -e REDIS_HOST=127.0.0.1 -e REDIS_PORT=6380 -e REDIS_PASSWORD=ni-ning.cn jumpserver/jms_all:latest
 
```


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ni-ning.cn';