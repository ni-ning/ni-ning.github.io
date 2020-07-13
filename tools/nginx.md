
description: 测试环境  docker ubuntu:20.04

# Web服务-Nginx

## 一、Nginx介绍

* Web服务器  反向代理服务器  邮件代理服务器
* 轻量级的Web服务器  删减优化
* 延伸版本 Tengine\(淘宝\), OpenResty\(章亦春\)
* [http://nginx.org](http://nginx.org)
* [http://www.nginx.cn](http://www.nginx.cn/doc/index.html)

## 二、Nginx 安装

```
apt-get update
apt-get install nginx
vim /etc/nginx/nginx.conf

service nginx start

lsof -i :80
netstat -plnt
elinks http://127.0.0.1 --dump
```


## 三、Nginx 配置文件

配置文件 `/etc/nginx/nginx.conf` 相当于变量文件，甚至可以认为是脚本文件，nginx程序就是解释器

```text
# user nobody;         --> 启动子进程默认用户, 主进程一般是root，可添加只用于启动程序的系统账户 useradd -s /sbin/nologin -r www
worker_processes 2;    --> ps aux | grep nginx 可以看出有2个工作进程
pid /run/nginx.pid;    --> 主进程 pid文件
include /etc/nginx/modules-enabled/*.conf;   --> 支持导入语法

events {               --> 网络配置连接相关
    worker_connections  1024; 
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # include /etc/nginx/conf.d/*.conf;   --> 支持导入 server段 可配置多个虚拟主机
    server {
        listen 80;
        server example.com;               --> 需域名服务商申请和配置解析
        location / {
            root /code/dist/deep-ocean;
            index index.html index.htm;
        }
    }
}
```
- nginx配置分区域块：全局块、events块、http块，其中http->sever块，server->location块
- 每个指令必须有分号结束
- $开头表示变量，nginx提供很多内置变量

## 四、默认网站

nginx配置文件中只有一个server的时候, 该server被nginx认为是默认网站, 所有发给服务器80端口的数据都会默认给该server

```text
server {
    listen 80;
    server_name localhost;
    location / {
        root html;
        index index.html index.htm;
    }
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root html;
    }
}
```

**1. 目录访问控制**

```text
cd html
# 访问控制: 允许个别, 拒绝所有
location /a {
    allow 127.0.0.1;
    deny all;

    return 404;
    return 502;
    return http://www.jd.com;
}

# 任何人都可以访问, 当需要用户名密码
location /c {
    auth_basic "登录验证";
    auth_basic_user_file /etc/nginx/htpasswd;
}

htpasswd生成包含用户名和密码的文本文件 "用户名:密码" 浏览网页基本认证
sudo apt search htpasswd
sudo apt install apache2-utils
which htpasswd
sudo htpasswd -m /etc/nginx/htpasswd linda
```

**2. 日志管理**

```text
nginx访问日志主要有两个参数控制

log_format # 用来定义记录日志的格式(可以定义多种日志格式, 取不同名字即可)  
log_format test '[$time_local] $remote_addr $request $status';

access_log # 用来指定访问日志文件的路径及格式  
access_log logs/access.log main;

tail -f /usr/local/nginx/logs/access.log
```

自定义json格式 为以后分析做铺垫

```text
log_format main_json '{"timestamp": "$time_local",'
'"client_ip": "$remote_addr",'
'"request": "$request",'
'"referer": "$http_referer",'
'"status": "$status"'
'}';
```

**3. 防盗链**

```text
location /images/ {
    valid_referers none;
    if($invalid_referer){
        rewrite ^/ http://xxxxx.png;
    }
}
```

## 五、虚拟主机

把一台物理服务器划分为多个"虚拟"的服务器, 每一个虚拟主机都可以有独立的域名和独立的目录

同时发布两个网站:  
DocumentRoot /usr/local/nginx/html/web01  
DocumentRoot /usr/local/nginx/html/web02

**1. 基于IP的虚拟主机**

实现条件: 两个IP, 两个DocumentRoot并有相应索引页index.html

缺点: 需要多个IP 如果是公网IP 需要收费

```text
server {
    listen 192.168.10.20:80;
    location / {
        root html/web01;
        index index.html index.htm index.php;
    }
}
server {
    listen 192.168.10.21:80;
    location / {
        root html/web02;
        index index.html index.htm index.php;
    }
}
```

**2. 基于端口的虚拟主机**

实现条件: 只需一个IP, 多个端口

缺点: 端口是无法告诉公网用户, 无法适用于公网客户, 适合内部用户

```text
server {
    listen 80;
    location / {
        root html/web01;
        index index.html index.htm index.php;
    }
}
server {
    listen 8080;
    location / {
        root html/web02;
        index index.html index.htm index.php;
    }
}
```

**3. 基于域名**

一个网站必然有一个域名, 推荐使用

```text
sudo sed -i '/#/d' nginx.conf
sudo sed -i '/^$/d' nginx.conf

server {
    listen 80;
    server_name wwww.nining.website nining.website;
    location / {
        root html/web02;
        index index.html index.htm index.php;
    }
}

server {
    listen 80;
    server_name www.nining1314.com nining1314.com;
    location / {
        root html/web01;
        index index.html index.htm index.php;
    }
}
```

## 六、反向代理

正向代理: 小区宽带 局域网 代用户上网  
反向代理: 代理服务器

代理中间多了一层

**堡垒机场景**

网络安全复杂

安全配置只接受来自堡垒机的链接访问, 其他都拒绝

```text
graph LR
网络用户客户端 --> 反向代理服务器-公网 
反向代理服务器-公网  --> 业务服务器-私网
```

业务服务器的安全配置只接受来自堡垒机的链接访问, 其他都拒绝

**发布内网服务器**

```text
graph LR
网络用户客户端 --> 反向代理服务器-公网 
反向代理服务器-公网  --> 业务服务器-私网PHP
反向代理服务器-公网  --> 业务服务器-私网Java
反向代理服务器-公网  --> 业务服务器-私网Python
```

适合于公网IP地址不足的场景

**缓存场景**

```text
graph LR
网络用户客户端 --> 缓存服务器 
缓存服务器  --> 业务服务器
```

静态资源 缓存服务器 比例8  
动态数据 业务服务器 比例2

**反向代理实现**

```text
server {
    listen 80;
    server_name localhost;
    location / {
        proxy_pass http://118.190.209.153:4000;

        # 设置header
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # 各类优化，根据实际配置
        client_max_body_size 10m;
        client_body_buffer_size 128k;
        proxy_connect_timeout 90;
        proxy_send_timeout 90;
        proxy_read_timeout 90;
        proxy_buffer_size 4k;
        proxy_buffers 4 32k;
        proxy_busy_buffers_size 64k;
        proxy_temp_file_write_size 64k;
    }
}
```

## 七、限速

防止用户海量请求, 如DDOS防御  
保护磁盘IO, 如下载场景

**限速原理**

水\(请求\)从上方倒入水桶, 从水桶下方流出\(被处理\);  
来不及流出的水存在水桶中\(缓冲\), 以固定速率流出;  
水桶满后水溢出\(丢弃\)

这个算法的核心: 缓存请求, 匀速处理, 多余的请求直接丢弃

**实现方式**

nginx官方版本限制IP的连接和并发分别有两个模块:

limit\_req\_zone 用来限制单位时间内的请求数, 即速率限制  
limit\_conn\_zone 用来限制同一时间连接数, 即并发限制

```text
http {
    limit_req_zone $binary_remote_addr zone=reqlimit:10m rate=1r/s;
    limit_conn_zone $binary_remote_addr zone=connlimit:10m;
    location /abc {
        limit_req zone=reqlimit burst=5 nodelay;
        limit_conn connlimit 1;
        limit_rate 100k;
    }
}
```

## 八、URL重写

rewrite几乎是所有web产品必备技能  
nginx服务器rewrite功能实现依赖pcre\(Perl Compatible Regular Expression\)

* 域名变更\(京东\)
* 用户跳转\(从某个连接跳转到另个连接\)
* 伪静态场景\(便于CDN缓存动态页面数据\)

原理: Client -&gt; Nginx -&gt; Client -&gt;业务服务

```text
# 模糊匹配 ~
# 模糊不匹配 !~
# 不区分大小写匹配 ~*

set $name aaaa;
rewrite ^(.*)$ http://ni-ning.cn/$name;

if ($http_user_agent ~* 'chrome') {
    return 403;
}
```

**url rewrite语法**

```text
rewrite <regex> <replacement> [flag]  
关键字  正则    替代内容      标记

redirect   # 返回302临时重定向, 搜索引擎以旧网址排名
permanent  # 返回301永久重定向, 搜索引擎以新网址排名

rewrite ^/$ http://ni-ning.cn permanent;
```

## 九、优化

软件安装的时候，以硬件最小化进行安装，需要优化;  
提高用户体验

#### **1. 工作进程**

* nginx是主进程+工作进程模型
* worker\_processes 1;  工作进程数 按CPU的总核心数
* worker\_cpu\_affinity 0001 0010 0100 1000; CPU的亲和力
* worker\_connections 1024; 一个工作进程的并发数

cat /proc/cpuinfo \| grep "flags" \| wc -l  
top

#### **2. 长连接**

http协议底层协议为tcp  
优化目标: 减少三次握手和四次断开的次数

* keepalive\_timeout 5; 长连接时间
* keepalive\_requests 8192; 每个长连接接受最大请求数

#### **3. 数据压缩**

减少带宽成本

```text
gzip on;
gzip_proxied any;
gzip_min_length 1k;
gzip_buffers 4 8k;
gzip_comp_level 6;
gzip_types text/plain text/css application/x-javascript application/javascript application/xml;
```

**4. 客户端缓存**

```text
location ~* \.(png|gif)$ {
    expires 1h;
}
```


# Web集群
## 基本模型

完成一次请求的步骤
- 用户发起请求
- 服务器接受请求
- 服务器处理请求(压力最大)
- 服务器响应请求

如何解决单点故障，单台服务器性能瓶颈呢？当然是多台了

![iamge](https://raw.githubusercontent.com/ni-ning/ni-ning.github.io/master/images/web.jpg)


组成要素
- VIP：一个虚IP地址
- 分发器：nginx
- 数据服务器：Web服务器器

## Nignx集群

在该集群中，nginx扮演分发器角色，接受请求、分发请求、响应请求

功能模块
- ngx_http_upstream_module 基于应用层分发模块(常用)
- ngx_stream_core_module 基于传输层分发模块

集群原理：虚拟主机+反向代理+upstream分发模块组成
- 虚拟主机：接受和响应请求
- 反向代理：带用户去数据服务器拿数据
- upstream：告诉nginx去哪个数据服务器拿数据

基本配置

web01服务器
```
server {
        listen 80;
        server 192.168.0.11;
        location / {
            root /code/dist/web01;
            index index.html index.htm;
        }
```

web02服务器
```
server {
        listen 80;
        server 192.168.0.12;
        location / {
            root /code/dist/web02;
            index index.html index.htm;
        }
```

分发器配置

```
upstream web {
    server 192.168.0.11;
    server 192.168.0.12;
}

server {
        listen 80;
        server 192.168.0.10;
        location / {
            proxy_pass http://web;
        }
```

- 测试 elinks http://192.168.0.10 --dump


## 分发算法

顺序轮询
```
upstream web {
    server 192.168.0.11;
    server 192.168.0.12;
}
```

权重轮询
```
upstream web {
    server 192.168.0.11 1;
    server 192.168.0.12 2;
}
```

Hash轮询
```
upstream web {
    ip_hash;
    server 192.168.0.11;
    server 192.168.0.12;
}
```

其他自定义条件轮询


## 高可用Nginx集群

业务服务器出现宕机时，分发器可以自动识别，从分发列表中剔除即可。如何保证分发器高可用呢，还是同样的逻辑，多台服务

- keepalived



## 参考链接
- [一文理清 nginx 中的 location 配置 (系列一)](https://segmentfault.com/a/1190000022315733)
- [一文理清 nginx 中的 rewrite 配置 (系列二)](https://segmentfault.com/a/1190000022407797)

