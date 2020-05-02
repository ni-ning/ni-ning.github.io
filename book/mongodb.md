# 第一章 MongoDB课程概述

## 第一章 MongoDB简介
1. 实验环境

2. 各章概述  

    见后续
3. MongoDB简介
    文档型的NoSQL，文档型-->BSON文档(json的二进制)
    MongoDB是一个基于分布式文件存储的数据库
    支持的查询语言非常强大
    
    (1) 保存数据：key-value  
    (2) 一般不支持事务  
    (3) MongoDB适合保存什么样数据？举例：设计一个数据库，来保存电影信息 
    
    注：NoSQL数据库，如Redis、HBase等


## 第二章 MongoDB的体系结构与安装
1. MongoDB的安装
2. MongoDB的体系结构

## 第三章 使用mongo shell
1. 启动mongo shell
2. 使用启动配置文件
3. mongo shell基本操作
4. mongo shell数据类型
5. 使用MongoDB Web的控制台

## 第四章 CRUD操作
1. 插入文档
2. 查询文档
3. 更新文档
4. 删除文档
5. 批处理

## 第五章 聚合操作：aggregation
1. 使用PipeLine方式进行聚合操作
2. 使用MapReduce方式进行聚合操作

## 第六章 全文检索
1. 全文索引 (Text Index)
2. 执行全文检索($text操作符)
3. 在aggregation PipeLine方式中使用全文检索

## 第七章 地理空间查询
1. GeoJSON格式数据
2. 案例

## 第八章 数据建模
1. 数据建模概述
2. 验证文档
3. 数据模型的设计：嵌入式、引用式

注：坚持阅读官方文档

* [官方手册](https://docs.mongodb.com/manual/)
* [Mongo中文文档](http://www.mongodb.org.cn/)



# 第二章 MongoDB安装与配置

## 1. MongoDB的安装与配置
```
sudo apt-get remove mongo*
cd /root/training
wget mongodb-linux-x86_64-ubuntu1404-3.6.4.tgz
tar -zxvf mongodb-linux-x86_64-ubuntu1404-3.6.4.tgz -C /root/training
export PATH=/root/training/mongodb-linux-x86_64-enterprise-ubuntu1404-3.7.5/bin:$PATH    临时生效
```

```mongod  提示/data/db不存在
mkdir -p /data/db
mongod --dbpath=/data/db
启动成功提示
waiting for connections on port 27017
```

错误信息
mongod: error while loading shared libraries: libnetsnmpmibs.so.30


方法二：[官方ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-on-ubuntu/)

```
/var/lib/mongodb  # 数据库文件
/var/log/mongodb  # 日志文件
/etc/mongod.conf  # mongod配置文件

sudo service mongod start
sudo service mongod stop
```


## 2. MongoDB的体系结构
* 一个MongoDB Server: 实例和多个数据库(1:N)
* 存储结构
    1. 逻辑存储结构：数据库(database)、表(collection)、记录(文档document)
    2. 物理存储结构：
        * --dbpath=/data/db 指定数据库存储的位置
        * MongDB的物理存储的文件
            * 命名空间文件    后缀.ns 大小 16M
            * 数据文件       后缀0,1,2,3  
                            大小  
                            0 --> 16M   
                            1 --> 32M  
                            2 --> 64M  
                            最大 2G
            * 日志文件 存储的位置可能不一样
                * 直接存储在操作系统中
                    * 系统日志文件：记录的是系统的启动信息，告警信息等等
                    * journal日志文件：重做日志，即redo日志，用于恢复
                * 存储在集合(collection)中
                     * oplog：复制操作的日志(只在：主从复制的功能)
                     * 慢查询的日志(需要单独配置)：一般在生成系统中，大于200毫秒的日志                     
    3. 注意：
        * 从3.2版本后，MongoDB的默认的数据引擎，wiredTiger
        * 早期版本 内存映射，可以指定参数 --storageEngine=mmapv1
        * 新版本：数据文件 0 大小从64M开始
    
    4. 创建数据库
        show dbs
        use mydemo
        db.test.insert({"name": "Linda"})   # 自动创建数据库 mydemo
           
                     
                     
                                
    


 
 
 




# 第三章 MongoShell基本操作与数据类型

## 1. 启动 mongo shell
* 启动：mongo
* 参数：  
--username 用户名  
--password 密码  
--host  
--port  
简写的方式： mongo -u *** -p *** -host *** -port ***  
帮助信息： mongo --help  
可以在mongo shell中使用外部的编辑器: vim
    1.  设置环境变量 export EDITOR=vim
    2.  mongo shell中定义 function myFunction(){}
    3.  edit myFunction  进入vim编辑器，编辑，保存，退出
    4.  mongo shell中执行 myFunction()

## 2. mongo shell启动配置文件(shell, not mongod)
    (*) 在当前用户的家目录下： ~/.mongorc.js
    (*) 示例一：显示当前发出命令的数量
        vim ~/.mongorc.js
        cmdCount=1;
        prompt=function(){
            return "mongo " + (cmdCount++) + " >";
        }
    (*) 示例二：显示数据库名称和主机名称
        vim ~/.mongorc.js
        host=db.serverStatus().host;
        cmdCount=1;
        prompt=function(){
            return db + "@" + host + " " +(cmdCount++) + " >";
        }

## 3. mongo shell的基本操作
    show dbs;
    use mydemo1;
    db.test1.insertOne({x:1})
    show tables;
    show collections;

## 4. mongo shell数据类型：字符串、整型、布尔值、浮点数、时间
    (1) 日期类型 Date
        Date(): 表示当前时间，插入一个字符串类型，如 Sat Apr 21 2018 11:34:51 GMT+0800 (CST)
        new Date(): 插入的是ISODate类型，表示的是格林威治标准时间，如ISODate("2018-04-21T03:34:59.361Z")
        ISODate(): 类似 new Date()，如ISODate("2018-04-21T03:34:59.361Z")
    (2) ObjectId: 当插入数据的时候，自动生成一个字段 "_id" --> 相当于主键，ObjectId("5adab023eedb6b279a2ecb29")
        ObjectId 是一个12字节的BSON类型的字符串，易于分布式
    (3) 表示数字的时候，注意问题
        NumberInt：表示32位整数
        NumberDecimal：支持34位小数
        Double：数字默认类型

        建立测试数据
        {"_id":1, "val": NumberDecimal("9.99"), "description": "Decimal"}
        {"_id":2, "val": 9.99, "description": "Double"}
        {"_id":3, "val": 10, "description": "Double"}
        {"_id":4, "val": NumberLong(10), "description": "Long"}
        {"_id":5, "val": NumberDecimal("10.0"), "description": "Decimal"}

        执行一下查询
        (1) 条件：{"val": 9.99}
        { "_id" : 2, "val" : 9.99, "description" : "Double" }
        原因：默认9.99是Double
        
        (2) 条件：{"val": NumberDecimal("9.99")}
        { "_id" : 1, "val" : NumberDecimal("9.99"), "description" : "Decimal" }
        
        (3) 条件：{"val": 10}
        { "_id" : 3, "val" : 10, "description" : "Double" }
        { "_id" : 4, "val" : NumberLong(10), "description" : "Long" }
        { "_id" : 5, "val" : NumberDecimal("10.0"), "description" : "Decimal" }
        原因：对于整数10的匹配，将匹配所有的数据类型是10 ***
        
        (4) 条件：{"val": NumberDecimal("10")}
        { "_id" : 3, "val" : 10, "description" : "Double" }
        { "_id" : 4, "val" : NumberLong(10), "description" : "Long" }
        { "_id" : 5, "val" : NumberDecimal("10.0"), "description" : "Decimal" }
        原因：将匹配所有的数据类型是10
        
        总结：比较涉及 值与类型
        
## 5. 使用MongoDB Web的控制台
需要在启动MongoDB的时候，指定参数 --httpinterface  
实际测试没找到该选项


# 第四章 CRUD操作
## 1. 插入文档

    insert 如果插入数据的时候，collection还不存在时，自动创建集合
    insertOne：插入一条数据
    insertMany：接收数组，插入多条文档
        (*) db.student1.insertOne({"_id":"stu001", "name":"Tom", "age":25, "grade":{"chinese":80, "math":90, "english":88}})
        (*) db.student1.insertMany([
            {"_id":"stu003", "name":"Mary", "age":23, "grade":{"chinese":80, "math":90}},
            {"_id":"stu004", "name":"Mike", "age":25, "grade":{"chinese":80, "math":90, "english":88}},
        ])
        (*) 统一的形式：insert 插入文档，也可以是文档的数组，就是insertOne与insertMany的统一

## 2. 查询文档  
    数据源参考数据脚本
  
    (*) 基本查询
        (1) 查询所有的员工信息
            db.emp.find()
        (2) 查询职位为经理的员工
            db.emp.find({"job": "MANAGER"})
        (3) 操作符 $in和$or
            查询职位是MANAGER或者CLERK的员工信息
            db.emp.find({"job":{"$in":["MANAGER", "CLERK]}})
            db.emp.find({"$or":[{"job":"MANAGER"},{"job":"CLERK"}]})
        (4) 查询10号的部门工资大于2000的员工
            db.emp.find({"sal":{"$gt":2000}, "deptno":10})
    
    (*) 嵌套查询
        (1) 查询语文是81分，英语是88分的文档
            db.student2.find({"grade":{"chinese":81, "english":88}})  --> 只匹配只有语文和英语的文档
        (2) 查询语文是81分，数学90分，英语是88分的文档
            db.student2.find({"grade":{"chinese":81, "math":90, "english":88}}) --> 顺序也要一致
            小结：如果是相等查询，保证匹配所有的field，顺序也要一致
        (3) 查询嵌套文档中的一个列：查询数学成绩是82分的文档
            db.student2.find({"grade.math":82})
        (4) 使用比较运算符：查询英语成绩大于88分文档
            db.student2.find({"grade.english":{"$gt":88}})
        (5) 使用AND运算符：查询英语成绩大于88分文档，语文大于85分文档
            db.student2.find({"grade.english":{"$gt":88}, "grade.chinese":{"$gt":85}})
    
    (*) 查询数组的文档
        (1) 查询所有有Hadoop和Java的文档
            db.studentbook.find({"books":["Hadoop", "Java"]})   --> 没有结果
            正确：
            db.studentbook.find({"books":{"$all":["Hadoop", "Java"]}})
        (2) 跟查询嵌套的文档一样，匹配每个元素，顺序也要一样
            db.studentbook.find({"books":["Hadoop", "Java", "NoSQL"]})
    
    (*) 查询数组中嵌套的文档
        (1) 查询Java有4本的文档
            db.studentbook1.find({"books":{"bookname": "Java", "quantity": 4}})
        
        (2) 指定查询的条件：查询数组中第一个元素大于等于3本的文档
            db.studentbook1.find({"books.0.quantity":{"$gte":3}})
            
            如果不知道field的位置：查询文档中至少有一个quantity的值大于1
            db.studentbook1.find({"books.quantitiy":{"$gt":3}})
        
        (3) 查询Java有4本的文档
            db.studentboo1.find({"books":{"$elemMatch":{"bookname":"Java", "quantity":4}}})
        
    (*) 查询空值null或者缺失值
        (1) 查询值为null的文档
            db.student3.find({"age":null})  --> 返回2条记录
        
        (2) 只返回null的记录：BSON表示null的为{"$type":10}
            db.student3.find({"age":{"$type":10}})
        
        (3) 检查是否缺失某个列：{"$exists": bool}
            db.student3.find({"age":{"$exists": false}})
            db.student3.find({"age":{"$exists": true}})
    
    (*) 使用游标
        db.collection.find()  ---> 返回一个cursor：如果使用cursor，使用迭代器，默认返回20条文档
        (1) 定义游标
        var mycursor = db.emp.find()
        mycursor
        (2) 使用游标访问文档
        var mycursor = db.emp.find()
        while(mycursor.hasNext()){
            printjson(mycursor.next())
        }
        (3) 游标转数组
        var mycursor = db.emp.find()
        var myarray = mycursor.toArray()
        var mydoc = myarray[0]
        (4) 分页查询：skip和limit，每页显示5条
         第一页：var mycursor = db.emp.find().limit(5)
         第二页：var mycursor = db.emp.find().limit(5).skip(5)

## 3. 更新文档：updateOne和updateMany
    (1) 更新 7839的薪水  --> 9000
        db.emp.updateOne({"_id":7839}, {"$set":{"sal":9000}})     --> updateOne({}, {})
    (2) 更新多条数据：更新10部门的员工薪水，加100块钱
        db.emp.updateMany({"deptno":{"$eq":10}}, {"$set":{"sal":"sal"+100}}) --> 错误
        db.emp.updateMany({"deptno":{"$eq":10}}, {"$inc":{"sal":100}})
    (3) 官方文档
        https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#db.collection.updateOne
    
## 4. 删除文档：deleteOne和deleteMany
        db.emp.deleteOne({"_id":7839})

## 5. 批处理：为了提高效率，db.collection.bulkWrite，支持insert，update，remove以及insertMany
        db.mystudents.bulkWrite([
            {"insertOne":{"document":{"_id":100, "name":"Tom", "age":25}}},
            {"insertOne":{"document":{"_id":101, "name":"Mary", "age":26}}},
            {"updateOne":{"filter":{"_id":100}, "update":{"$set":{"name":"Tom123"}}}}
        ])
 
 
 # 第五章 聚合操作
	聚合操作：aggregation
    Pipeline速度快于MapReduce
    MapReduce可在多个Server上并行运行
## 1. 使用Pipeline方式进行聚合
    (*) 核心：db.collection.aggregate()方式
        (1) 限制1：单个聚合操作耗费的内存不能超过20%
        (2) 限制2：返回的结果集，限制在16M
    (*) demo
        (1) $match和$project
            $match：过滤进入Pipeline的数据
            $project：指定提取的列，其中 1表示提取列；0不提取列
            db.emp.aggregate(
                {"$match":{"deptno":{"$eq":10}}},
                {"$project":{"ename":1, "sal":1, "deptno":1, "_id":0}}
            )
        (2) 使用$group: 求每个部门的工资总和
            db.emp.aggregate(
                {"$match":{"deptno":{"$eq":10}}},
                {"$project":{"sal":1, "deptno":1}},
                {"$group":{"_id":"$deptno", "salTotal":{"$sum":"$sal"}}}   
            )
            ---> 输出结果： { "_id" : 10, "salTotal" : 12750 }
            # "_id"表示主键 group by
            # "salTotal":{"$sum":"$sal"}  重新定义字段名与字段来源
            db.emp.aggregate(
                {"$project":{"sal":1, "deptno":1}},
                {"$group":{"_id":"$deptno", "salTotal":{"$sum":"$sal"}}}
            )
            ---> 输出结果：
            { "_id" : 10, "salTotal" : 12750 }
            { "_id" : 30, "salTotal" : 9400 }
            { "_id" : 20, "salTotal" : 10875 }
        
        (3) 按照部门，不同的职位求工资总额
            select deptno, job sun(sal) from emp group by deptno, job
            db.emp.aggregate(
                {"$project":{"deptno":1, "job":1, "sal":1}},
                {"$group":{"_id":{"deptno":"$deptno", "job":"$job"}, "salTotal":{"$sum":"$sal"}}}
            )
            ---> 输出结果：
            { "_id" : { "deptno" : 20, "job" : "ANALYST" }, "salTotal" : 6000 }
            { "_id" : { "deptno" : 30, "job" : "SALESMAN" }, "salTotal" : 5600 }
            { "_id" : { "deptno" : 20, "job" : "CLERK" }, "salTotal" : 1900 }
            { "_id" : { "deptno" : 20, "job" : "MANAGER" }, "salTotal" : 2975 }
            { "_id" : { "deptno" : 10, "job" : "CLERK" }, "salTotal" : 1300 }
            { "_id" : { "deptno" : 30, "job" : "CLERK" }, "salTotal" : 950 }
            { "_id" : { "deptno" : 10, "job" : "PRESIDENT" }, "salTotal" : 9000 }
            { "_id" : { "deptno" : 10, "job" : "MANAGER" }, "salTotal" : 2450 }
            { "_id" : { "deptno" : 30, "job" : "MANAGER" }, "salTotal" : 2850 }

## 2. 使用MapReduce方式进行聚合操作
    特点：实现非常复杂的计算逻辑，多台server并行计算
    (1) MapReduce的原理
        (*) 来源Google的一篇论文：MapReduce ----> 问题：PageRank搜索排名
          
    (2) Demo
        (*) 求员工表中，每种职位的人数
            this表示collection，该函数表示每个职位记一次数
            var map1 = function(){emit(this.job, 1)}
            var reduce1 = function(job, count){return Array.sum(count)}
            db.emp.mapReduce(map1, reduce1, {"out": "mrdemo1"})
            db.mrdemo1.find()
            
        重要：分析如何处理数据
        (*) 求员工表中，每个部门的工资总额
             var map2 = function(){emit(this.deptno, this.sal)}
             var reduce2 = function(deptno, sals){return Array.sum(sals)}
             db.emp.mapReduce(map2, reduce2, {"out":"mrdemo2"})
             db.mrdemo2.find()
    (3) TroubleShooting Map和Reduce
         
    
# 第八章 数据模型

## 数据建模概述
MongoDB支持内嵌对象和数组类型  
MongoDB建模有两种方式，一种是内嵌(embedded)，另一种是连接(references)
* 内嵌(embedded)：嵌入文档通过把数据存储到一个独立文档结构中来获取数据之间的关系
* 连接(references)：类似关系数据库中的外键