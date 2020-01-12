# GitLab

## 一、小白玩Ubuntu

### 1. apt-get切换阿里源

```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
sudo vim /etc/apt/sources.list

deb http://mirrors.aliyun.com/ubuntu/ trusty main restricted universe multiverse 
deb http://mirrors.aliyun.com/ubuntu/ trusty-security main restricted universe multiverse 
deb http://mirrors.aliyun.com/ubuntu/ trusty-updates main restricted universe multiverse 
deb http://mirrors.aliyun.com/ubuntu/ trusty-proposed main restricted universe multiverse 
deb http://mirrors.aliyun.com/ubuntu/ trusty-backports main restricted universe multiverse 
deb-src http://mirrors.aliyun.com/ubuntu/ trusty main restricted universe multiverse 
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-security main restricted universe multiverse 
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-updates main restricted universe multiverse 
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-proposed main restricted universe multiverse 
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-backports main restricted universe multiverse

sudo apt-get update
sudo apt-get upgrade
```

### 2. 防火墙设置

```bash
sudo ufw enable/disable/status
```

### 3. iptables设置

```bash
iptables -P INPUT ACCEPT
iptables -P OUTPUT ACCEPT

# 直接卸载
sudo apt-get remove iptables
```

### 4. 配置固定IP ubuntu 18.04

```bash
sudo vim /etc/netplan/50-cloud-init.yaml
network:
    ethernets:
        ens33:
                dhcp4: no
                dhcp6: no
                addresses: [192.168.4.163/23]
                gateway4: 192.168.5.1
                nameservers:
                    addresses: [202.106.0.20]
    version: 2
# 网络配置直接生效
sudo netplan apply
```

## 二、GitLab

### 1. GitLab介绍

GitLab是一个用于代码仓库管理的开源项目，类似GitHub

* 使用Git作为代码管理工具
* 使用Web界面进行公开或私人项目管理
* http://gitlab.com

### 2. GitLab安装

```bash

sudo apt update
sudo apt install ca-certificates curl openssh-server postfix
# postfix的安装 选择 "Internet站点"

cd /tmp
curl -LO https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh
sudo bash /tmp/script.deb.sh

sudo apt install gitlab-ce
# 最新的gitlab-ce需要邮件验证，比较繁琐
sudo apt-cache policy gitlab-ce
sudo apt-get install gilab-ce=10.7.0-ce.0


sudo vim /etc/gitlab/gitlab.rb
# external_url 'https://example.com'
# letsencrypt['contact_emails'] = ['sammy@example.com']
sudo gitlab-ctl reconfigure
sudo apt-get intall gitlab-ce=10.7.0-ce.0

# 参考文档
https://cloud.tencent.com/developer/article/1349230
```

### 3. GitLab配置与初始化

```bash
sudo vim /etc/gitlab/gitlab.rb

external_url 'http://192.168.224.130'

gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtpdm.aliyun.com"
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "notify@example.com"
gitlab_rails['smtp_password'] = "******"
gitlab_rails['smtp_domain'] = "smtpdm.aliyun.com"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_tls'] = true
gitlab_rails['smtp_openssl_verify_mode'] = 'none'
gitlab_rails['gitlab_email_from'] = "notify@example.com"

gitlab_rails['time_zone'] = 'Asia/Shanghai'

sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart

# 非必须，测试邮件服务是否正常
gitlab-rails console
Notify.test_email("nining1314@gmail.com","title","gitlab").deliver_now
```

* 禁用注册功能
* 添加Groups Users Projects
* 版本发布分支 权限管理

### 4. 常用命令

```bash
sudo gitlab-ctl status
sudo gitlab-ctl start/stop [service_name]

sudo gitlab-ctl reconfigure          # 修改配置文件/etc/gitlab/gitlab.rb 需要重启该命令
sudo gitlab-ctl restart

sudo gitlab-ctl tail [service_name]  # 查看服务日志
```

### 5. 基础组件

GitLab基础组件较多，实际部署时部署在单独服务器即可，源代码是公司核心资产

```text
nginx：静态Web服务器
gitlab-shell：用于处理Git命令和修改authorized keys列表
gitlab-workhorse:轻量级的反向代理服务器
logrotate：日志文件管理工具
postgresql：数据库
redis：缓存数据库
sidekiq：用于在后台执行队列任务（异步执行）
unicorn：GitLab Rails应用是托管在这个服务器上面的
```

![](../../../.gitbook/assets/gitlab.png)

### 6. 常用目录

```bash
# 程序目录
/opt/gitlab
# 配置文件
/etc/gitlab/gitlab.rb
# 数据目录
/var/opt/gitlab
# 日志目录
/var/log/gitlab
```

### 7. 备份恢复

```bash
# 配置文件中 添加备份路径
gitlab_rails['backup_path'] = '/data/backup/gitlab'
gitlab_rails['backup_keep_time'] = 604800

# 手动备份
sudo gitlab-rake gitlab:backup:create
# 自动备份, 可另起脚本监控是否正常备份
0 2 * * * /opt/gitlab/bin/gitlab-rake gitlab:backup:create 

# 恢复
# 首先停止数据库写入
sudo gitlab-ctl stop unicorn
sudo gitlab-ctl stop sidekiq
# 数字部分即可
sudo gitlab-rake gitlab:backup:restore BACKUP=1563350590_2019_07_17_10.7.0
sudo gitlab-ctl restart
```

