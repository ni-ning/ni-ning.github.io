# Docker

### 基本概念

**NameSpace 资源隔离**
- PID 进程编号
- NET 网络设备、网络协议栈、端口等
- IPC 信号量、消息队列、共享内存
- MOUNT 文件系统、挂载点
- UTS 主机名和主机域
- USER 操作进程的用户和用户组

```
Build Once, Run Anywhere
               -- Solomon Hykes
```

**What is Docker 是什么**
- Docker基于容器技术的轻量级虚拟化解决方案
- Docker是容器引擎，把Linux的cgroup、namespace等容器底层技术进行封装抽象为用户提供了创建和管理容器的便捷界面(包括命令行和API)
- Docker 开源项目，基于Google公司推出的Go语言实现
- Docker引入了一整套容器管理的生态，包括分层的镜像模型、容器注册库、友好的Rest API


### 安装与基本命令

- 安装 [Ubuntu for Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

```bash
# 建立 docker 组，并将当前用户加入 docker 组，退出当前终端并重新登录
sudo groupadd docker
sudo useradd -aG docker $USER

# 添加 docker 配置(可选)
vim /etc/docker/daemon.json
{
    "graph": "/data/docker",
    "storage-driver": "overlay2",
    "insequre-registries": [],
    "registry-mirrors": [],
    "bip": "172.7.5.1/24",
    "exec-opts": ["native.cgroupdriver=systemd"],
    "live-restore": true
}

# 开机启动 docker 服务
systemctl enable docker
systemctl start docker

# docker 基于 C/S 架构，自己分析流程细节
docker info
docker run hello-world

# 访问 docker.io
docker login
docker logout
cat /home/ubuntu/.docker/config.json

# 镜像的拉取与推送
docker search alpine
docker pull alpine:latest
docker images | grep alpine
# docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
docker tag apline:latest nining1314/apline:v1.0
docker push nining1314/alpine:v1.0

# 镜像与 tar 包
docker save <image_name|image_id> > specify_name.tar
docker load -i specify_name.tar
```

容器、镜像与仓库
![registry](https://raw.githubusercontent.com/ni-ning/LearnDocker/master/images/structure.png)

### 镜像

Docker 镜像特性
![image](https://raw.githubusercontent.com/ni-ning/LearnDocker/master/images/bootfs.png)

`docker image rm redis`
```
容器是以镜像为基础，再加一层存储层，组成这样的多层存储结构去运行 -> 检查镜像的容器(即使容器没有运行)，存在时则不可删除镜像

镜像的唯一标识是其 ID 和摘要，而一个镜像可以有多个标签 ->  先将满足条件镜像标签都取消 Untagged；删除了所指定的标签后，执行 Deleted

镜像是多层存储结构 -> 从上层向基础层方向依次进行判断删除
```

### 容器

当利用 docker run 来创建容器时，Docker 在后台运行的标准操作包括：

- 检查本地是否存在指定的镜像，不存在就从公有仓库下载
- 利用镜像创建并启动一个容器
- 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层
- 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去
- 从地址池配置一个 ip 地址给容器
- 执行用户指定的应用程序
- 执行完毕后容器被终止

**关键点**

- 容器的核心为所执行的应用程序，所需的资源都是应用程序所必须的
- 容器是否会长久运行，是和 docker run 指定的命令有关，和 -d 参数无关
- 当 Docker 容器中指定的应用终结时，容器也自动终止

**容器基本操作**

```
# 查询启动的容器
docker ps -a
或者
docker container ls

# docker run 日常最频繁的使用命令之一, 启动容器
# docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
docker run -it --rm --name my-alpine alpine /bin/sh
docker run -d my-alpine alpine /bin/sleep 1000

# 进入容器
docker attach <container_id>
docker exec -it <container_id> /bin/bash

# 启动/停止(不是暂停)/重启容器
docker start/stop/restart <container_id>

# 启动的容器更新之后，固化为镜像
docker commit -p <CONTAINER> [REPOSITORY[:TAG]]

# 删除容器
docker container rm [-f] <container_id>

# 查看日志
docker logs [-f] <container_id>
```

docker attach CONTAINER
- Attach local standard input, output, and error streams to a running container
- 从这个 stdin 中 exit，会导致容器的停止

docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
- Run a command in a running container
- 从这个 stdin 中 exit，不会导致容器的停止

**容器高级操作**

映射端口
- docker run -p 容器外端口:容器内端口
```
# 启动 nginx
docker run --rm -d -p 81:80 nginx
```
挂载数据卷
- docker run -v 容器外目录:容器内目录
```
wget www.baidu.com -O index.html
docker run --rm -d -p 82:80  -v /home/ubuntu/code/website:/usr/share/nginx/html nginx
```
传递环境变量
- docker run -e 环境变量key=环境变量value
```
docker run --rm -d --name my-nginx -p 83:80 -e E_VAL=123 nginx
docker exec -it my-nginx /bin/bash

>>> root@d50cfa7d8bfc:/# printenv
E_VAL=123
HOSTNAME=d50cfa7d8bfc
PWD=/
```
容器内安装软件(工具)
- yum/apt-get/apk 等

### Dockfile
**镜像制作的途径**
- docker commit
- Dockerfile
![dockerfile](https://raw.githubusercontent.com/ni-ning/LearnDocker/master/images/dockerfile.png)

**Dockerfile的规则**
- '# 为注释
- 指令(大写) 内容(小写)，尽管大小写不敏感，规范
- Docker是按顺序执行Dockerfile里的指令集合的(从上到下依次执行)
- 每一个Dockerfile的第一个非注释指令，必须是 FROM 指令，用于为镜像文件构建过程中，指定基准镜像，后续得指令运行于此基准镜像所提供的运行环境中

常用指令 USER/WORKDIR
```
# Dockfile 文件
FROM nining1314/nginx:v1.12.2
USER nginx
WORKDIR /usr/share/nginx/html

docker build . -t nining1314/nginx:v1.12.2_USER_WORKDIR
```

常用指令 ADD/EXPORSE
```
# Dockfile 文件
FROM nining1314/nginx:v1.12.2
ADD index.html /usr/share/nginx/html/index.html
# 容器内部预计开启的端口
EXPOSE 80

docker build . -t nining1314/nginx:v1.12.2_ADD_EXPOSE
```

常用指令 ENV/RUN
```
# Dockfile 文件
FROM centos:7
ENV VERSION 7.58.0
# 在打包制作竟像时执行的命令
RUN yum install curl-$VERSION

docker build . -t nining1314/centos:7_ENV_RUN
```

常用指令 CMD/ENTRYPOINT
```
# Dockfile 文件
FROM centos:7
# 在打包制作竟像时执行的命令
RUN yum install httpd -y
# 启动镜像时执行的命令
CMD ["httpd", "-D", "FOREGROUND"]

docker build . -t nining1314/centos:7_CMD


# Dockfile 文件
FROM centos:7
ADD entrypoint.sh /entrypoint.sh
RUN yum install nginx -y
# 启动镜像时执行的脚本
ENTRYPOINT /entrypoint.sh

docker build . -t nining1314/centos:7_ENTRYPOINT
```

### Docker的网络模型
- NAT(默认)
```
docker run -it --rm alpine /bin/sh
/ # ip addr -> 容器内部地址
/ # exit

ip addr -> docker0 宿主机地址
```

- None
```
# 如只需计算任务，无需网络
docker run -it --rm --net=none alpine
```

- Host
```
docker run -it --rm --net=host alpine
```

- 联合网络 **
```
docker run -d nining1314/nginx:v1.12.2
docker ps -a
# 两个容器共享一个IP，很神奇
docker run -it --rm --net=container:<container_id> nining1314/nginx:v.1.12.2
```

# Docker Compose

待续

# Kubernetes

待续

# 启动常用镜像

### alpine
```
docker run -it --rm alpine /bin/sh
```

### rabbitmq
```
docker run -d  --rm --name rabbitmq  \
-p 5672:5672 \
-p 5671:5671 \
-p 4369:4369 \
-p  25672:25672 \
rabbitmq
```

### redis
```
docker run -d --rm --name redis -p 6379:6379 redis:alpine
```


# 扩展阅读

- [Docker - 从入门到实践](https://yeasy.gitbooks.io/docker_practice/)
