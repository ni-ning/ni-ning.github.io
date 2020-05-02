## 基础知识

`WSGI` 
Web服务器网关接口(Web Server Gateway Interface), 或者Python Web Server Gateway Interface, 是为Python语言定义的Web服务器和Web应用程序或框架之间的一种简单而通用的接口

- Python的一种标准，其他语言也有类似接口，从而与底层Web服务器通信

`uWSGI` 
可以说是一个Web服务器，因实现了WSGI协议, uwsgi(失败命名), http等协议

- 可以启动uWSGI来运行一个HTTP服务器/路由器，它会传递请求到你的WSGI应用生产中uwsgi --http :8080 --wsgi-file bar.py 但不推荐使用，由专门软件提供 nginx
- 与之类似实现WSGI应用，如wsgiref(Python实现)，另外很多框架都自带WSGI Server，如Flask, Django等，性能都不太好，更多用于测试
- 实际生产环境 nginx(静态请求) + uWSGI(动态数据)

`uwsgi`
- 一种理解 uWSGI应用的包名 安装方式 pip install uwsgi
- 一种理解 uwsgi协议为uWSGI应用私有的一种通信协议，同WSGI。它是一个二进制协议，可以携带任何类型的数据，该协议主要通过TCP工作

## 安装部署

### 各组件示意图
[](../images/uwsgi.jpg)

### 部署操作
```bash
# 安装 nginx
sudo apt-get install nginx
# 配置 nginx - 传递每一个请求给绑定到3031端口并使用uwsgi协议的服务器
location / {
    include uwsgi_params;
    uwsgi_pass 127.0.0.1:3031;
}
# 启动 nginx
sudo service nginx restart

# 进入虚拟环境
source /home/ubuntu/virtualenv/tianfu3k/bin/activate
# 安装 django
pip install django
django-admin.py startproject gezi
cd gezi
# 测试 django自带
python manage.py runserver 0.0.0.0:8000
# 测试 uWSGI方式
uwsgi --http :8000 --wsgi gezi.wsgi

# 一种安装方式 uwsgi
pip install uwsgi
# 生产方式启动 gezi/~
uwsgi wsgi.ini

#PS: 测试wsgi.ini
[uwsgi]
socket = 127.0.0.1:3031
wsgi=gezi.wsgi
```

- 其他高级操作，可参考[官方文档](https://uwsgi-docs-zh.readthedocs.io/zh_CN/latest/index.html)


## 配置wsgi.ini解析
```
[uwsgi]
# python虚拟生产环境，包含所需依赖
virtualenv = /home/ubuntu/virtualenv/tianfu3k

# 与web server通信使用http协议，与http=0.0.0.0:9100本地生成的代理不同
# http协议对人友好，也可以和其他服务继承，但解析很慢
http-socket = 0.0.0.0:9100

# 启动的"worker"(被分配给uWSGI的进程)使用本地uwsgi协议，等同于uwsgi-socket
# 对机器而言，非常容易解析
socket = 0.0.0.0:9101

# 监控json对象输出，也可以 states=0.0.0.0:9191
stats = /tmp/gezi_stats.socket

# 加载WSGI模块, django框架默认提供 
wsgi = gezi.wsgi

# 启动主进程模式, uWSGI内置的预派生+线程 多worker管理模式
# 无需关闭主socket的情况下优雅地重启
master = true

# 启动运用现成
enable-threads = true

# 请求头的最大的大小
buffer-size = 65535

# 进程文件，存放的是当前启动进程的pid，可以向进程发送信号
# kill -HUP `cat /tmp/gezi_wsgi.pid`  优雅重启
# 或 uwsgi --reload /tmp/gezi_wsgi.pid
pidfile = /tmp/gezi_wsgi.pid

# 使用来自X-Forwarded-For头部而不是REMOTE_ADDR头部的ip
log-x-forwarded-for = true

# 不要以root用户运行uWSGI实例，可以作为root启动uWSGI
uid = ubuntu
gid = ubuntu
# 主进程root用户运行
master-as-root = true
# 设置文件描述符的最大数目
max-fd = 50000

# 进程线程数
processes = 5
threads = 6

# 设置最大日志文件大小 设置/附加一个记录器
log-maxsize = 10000000
logger = socket:127.0.0.1:9102

# 守护uWSGI
daemonize = /dev/null

# 超时删除卡住的请求
harakiri = 5
```

选项说明
- uwsgi --help
- [中文文档](https://uwsgi-docs-zh.readthedocs.io/zh_CN/latest/Options.html)