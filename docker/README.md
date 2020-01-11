# Docker

## 基本概念
**What is Docker 是什么**
- Docker基于容器技术的轻量级虚拟化解决方案
- Docker是容器引擎，把Linux的cgroup、namespace等容器底层技术进行封装抽象为用户提供了创建和管理容器的便捷界面(包括命令行和API)
- Docker 开源项目，基于Google公司推出的Go语言实现
- Docker引入了一整套容器管理的生态，包括分层的镜像模型、容器注册库、友好的Rest API


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

## 安装与基本命令

安装 [Ubuntu for Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
```
建立 docker 组，并将当前用户加入 docker 组，退出当前终端并重新登录
sudo groupadd docker
sudo useradd -aG docker $USER

添加 docker 配置(可选)
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

开机启动 docker 服务
systemctl enable docker
systemctl start docker

docker 基于 C/S 架构，自己分析流程细节
docker info
docker run hello-world

访问 docker.io
docker login
docker logout
cat /home/ubuntu/.docker/config.json

镜像的拉取与推送
docker search alpine
docker pull alpine:latest
docker images | grep alpine
docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
docker tag apline:latest nining1314/apline:v1.0
docker push nining1314/alpine:v1.0

镜像与 tar 包
docker save <image_name|image_id> > specify_name.tar
docker load -i specify_name.tar
```

容器、镜像与仓库
![registry](https://raw.githubusercontent.com/ni-ning/LearnDocker/master/images/structure.png)

