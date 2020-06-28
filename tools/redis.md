

# 基本知识

## 相关概念

Redis是一种基于键值对的NoSQL数据库

> Redis is an open source(BSD licensed), in-memory data structure store, used as a database, cache and message broker.

> [Redis](https://redis.io/)是一个开源的、基于内存的数据结构存储器，可以用作数据库、缓存和消息中间件


关系型数据库：重要的关系复杂的数据  -> 互联网高速发展 -> 超大规模、超大流量、高并发的数据 -> NoSQL数据库


Redis的特点

- 高性能：Redis将所有数据都存储在内存中，所以它的读写性能非常高，官方的数据 10万/s
- 支持多种数据类型：字符串(strings)、哈希值(hashes)、列表(lists)、集合(sets)、有序集合(sorted sets)
- 支持持久化操作：利用rdb和aof方式持久化到磁盘，可及时恢复
- 支持数据复制：通过master-slave机制，可以实时进行数据的同步复制
- 单线程请求，所有命令串行执行，并发情况下不需要考虑数据一致性问题
- 支持pub/sub消息订阅机制，可以用来进行消息订阅与通知
- 支持简单的事务需求，但业界使用场景很少，并不成熟


redis vs memcached

- redis的数据类型更丰富
- redis支持持久化

## 应用场景

缓存
- 解决了什么问题？减少了跟数据库的交互
- 什么样的数据适合缓存？变化频率不高的数据 + 访问频率高的数据
- 一般需要精确设定过期时间

计数器的应用
- 浏览数、点赞数、播放数等，redis内部实现自增操作

排行榜应用
- 取 top n 操作

保存用户凭证
- 实现多系统之间的单点登录凭证

消息队列功能
- redis提供了发布订阅和阻塞队列的功能

## 安装配置
C/S 架构
- 客户端：Redis命令行，或编程语言的Redis API 如redis-py，或RedisDesktopManager
- 服务端：Redis的Server是单线程服务器，默认端口 6379 ([MERZ](http://oldblog.antirez.com/post/redis-as-LRU-cache.html))

### 安装启动
ubuntu 环境

```
# 安装
sudo apt-get update
sudo apt-get install redis-server
# 启动
redis-server [/path/to/redis.conf]
# 查看
redis-cli [-p 6379]
127.0.0.1:6397> ping
PONG
# 配置
sudo vim /etc/redis/redis.conf
# 查看版本
redis-cli -v
redis-server -v

# 关闭 - 启动用户为redis
redis-cli shutdown
redis-cli -h 127.0.0.1 -p 6379 shutdown
kill -9 <pid>
sudo /etc/init.d/redis-server stop

# 快速入门
127.0.0.1:6379> set k1 v1
127.0.0.1:6379> get k1
127.0.0.1:6379> del k1
```

### 配置说明

/etc/redis/redis.conf

```
###### NETWORK ######
bind 127.0.0.1 ::1
port 6379

requirepass  password
databases 16

###### GENERAL ######
daemonize yes
pidfile /path/to/redis.pid  # daemon形式运行时，redis会生成一个pid文件
loglevel notice             # debug verbose notice warning
logfile /tmp/redis/redis-server.log

###### SNAPSHOTTING ######
save <seconds> <changes>    # 保存策略
dbfilename dump.rdb         # RDB文件名
dir /tmp/redis/snap         # 持久化文件目录

###### APPEND ONLY MODE ######
appendonly no
appendfilename "appendonly.aof"
```


## 数据类型

练习网站：http://try.redis.io/

### 字符串 strings

- key 统一都是字符串，可变化的数据类型指的是 value
- 字符串的值可以是普通的字符串，复杂的字符串(json,xml)，数字，甚至是二进制，需小于512MB


```
# 基本命令
set str1 value
get str1
del str1

# 批量操作
mset k1 v1 k2 v2
mget k1 k2
mdel k1 k2

# 自增减命令 
set book:python:zan 0
incr book:python:zan
incr book:python:zan

incrby book:python:zan 100

decr / decrby
```

- 包含了对数据的操作，可做自增自减
- 能批量操作尽量批量操作，减少网络带宽消耗

实际开发当中的应用场景
```
1. 验证码
set register:code:18899880088 666666
2. session共享问题
3. 缓存优化系统性能，如首页
4. 访问数，播放数，收藏数等

key的命名规范很重要
```

### 哈希 hashes

value 本身是一个 key-value，用于存储复杂的信息，如存储一本书信息

```
# 基本命令
hset book:1 name python 
hset book:1 author alex
hset book:1 price 99.99

hget book:1 name
hdel book:1 price

# 批量操作
hmset book:2 name linux author linda price 89.00
hmget book:2 name author price
hgetall book:2

# 计算个数
hlen book:2
# 判断key值是否存储
hexists book:2 name
```

- 查找速度快，时间复杂度O(1)
- 如果我们要保存对象，且对这个对象有存取操作，可用hashes结构，如微博，热帖


### 列表 lists

底层实现并不是数据，而是链表
- 对于一个具有上百万个元素的lists来说，在头部和尾部插入一个新元素，时间复杂度是常数级别
- 同样链表型lists定位元素会比较慢，而数组型lists的元素定位就会快得多

```
lpush l1 1001
rpush l1 1002
lpush l1 1000

lrange l1 0 -1
```
需求场景：
- 实现消息队列，可以确保先后顺序
- lrange 方便实现分页功能

### 集合 sets

- 无序
- 元素不重复

```
sadd sa1 "one"
sadd sa1 "two"

smembers sa1
sismember sa1 "one"


sadd sa2 "tow"
sunion sa1 sa2
```
需求场景：好友标签

### 有序集合 sorted sets

有序集合中的每个元素都关联一个序号(score)，排序依据

```
zadd z1 1 baidu.com
zadd z1 3 google.com
zadd z1 2 ni-ning.cn

zrange z1 0 -1
zrange z1 0 -1 withscores
```


## 常用命令

### key-value命令

```
# 返回满足给定pattern的所有key
keys key*

# key是否存在
exists name

# 设置一个key过期时间
expire key1 10

# 查看一个key过期时间
ttl key1

# 选择数据库
select 0

# 移动key到其他数据库
move key2 1

# 取消过期时间，即该key一直存在
persist key1

# 随机返回一个key空间的一个key
randomkey

# 重命名
rename key2 key_new

# 返回value类型
type key1
```

### 服务器命令
```
# 测试连接是否存活
ping

# 打印内容
echo hello

# 选择数据库
select 1

# 退出连接
quit

# 当前数据库key数
dbsize

# 数据库相关信息
info

# 获取配置信息
config get dir
config get *

# 删除当前数据库所有key
flushdb

# 删除所有数据库所使用key
flushall
```



# 高级功能
- Redis高可用架构-哨兵机制
- Redis高性能架构-RedisCluster
- Redis缓存更新策略
- 热点key的重建策略
- 应对缓存穿透攻击
- 应对雪崩的问题
- Redis的分布式锁


##  事务处理

事务是指 "一系列动作，要么全部执行，要么什么也不做"

- multi 组装一个事务
- exec 执行一个事务
- discard 取消一个事务
- watch 用来监视一些key，一旦这些key在事务执行之前被改变，则取消事务的执行

```
multi
incr user_id
incr user_id
ping
exec

get user_id
```



## 两种持久化

RDB(Redis DataBase)

Redis存储的数据生成快照存储到磁盘

- 单独fork 一个子进程来持久化，主进程不会进行任何IO操作，保证高性能
- 如果需要大规模恢复数据，且对于数据恢复的完整性不是非常敏感，RDB较好

AOF(Append Only File)

Redis执行的命令记录下来，重复执行恢复数据，只允许追加不允许修改
- 默认每秒钟fsync 一次
- 重写机制rewrite 压缩指令
- 适用于数据敏感场景，同样数据规模的情况下，AOF文件要比RDB文件的体积大，且AOF方式的恢复速度慢于RDB方式


## 发布订阅

## 主从复制

```
# 从服务器配置
slaveof <master-ip> <master-port>
masterauth <master-password>

# 查看 master slave 信息
info
```


## 其他数据库
- memcache：分布式高速缓存系统，数据类型没redis丰富
- mongodb：基于分布式文件存储、面向文档的NoSQL数据库。可以说介于关系型和非关系型之间，用一种类似json的bson格式存储
- mysql 数据库 引擎和索引


### 演示实例 就用 JumpServer Redis
### 演示实例 爬虫 分布式爬虫 Redis
### 演示实例 排行...
### 演示实例 10 0000/s


## 链接地址

- 官方网站 https://redis.io/
- 测试模拟 http://try.redis.io/
- 简明教程 https://zhuanlan.zhihu.com/p/37055648
- 超强、朝详细Redis入门教程 https://blog.csdn.net/liqingtx/article/details/60330555
- Redis是什么？看这一篇就够了 https://www.cnblogs.com/powertoolsteam/p/redis.html
- Python redis 使用介绍 https://www.runoob.com/w3cnote/python-redis-intro.html
- Real Python https://realpython.com/python-redis/#further-reading


# redis-py源码分析

## 基本使用

## 结构图

## 网络连接











