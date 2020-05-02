# 网站发布

### 版本介绍

ubuntu + nginx + python + django + uwsgi + mysql

### 安装nginx

```bash
sudo wget http://nginx.org/download/nginx-1.17.1.tar.gz -P /usr/src
cd /usr/src
sudo tar zxvf nginx-1.17.1.tar.gz
cd nginx-1.17.1

sudo apt install gcc
sudo apt-get install libpcre3 libpcre3-dev
sudo apt-get install zlib1g-dev
sudo apt-get install openssl
sudo ./configure --prefix=/usr/local/nginx
sudo apt-get install make
sudo make -j4
sudo make install

sudo /usr/local/nginx/sbin/nginx
sudo apt-get install lsof elinks
sudo lsof -i :80
sudo elinks http://127.0.0.1 --dump
```

### 安装mysql

* 中小型关系型数据库，社区版免费
* mysql 5.7.27

{% hint style="info" %}
cmake来配置安装环境\(类似configure\) 决定代码的组织方式及其编译方式，也是程序设计的一部分 

cmake是makefile的上层工具，自动化产生可移植的makefile
{% endhint %}

```bash
# 安装编译依赖
sudo apt-get install make cmake gcc g++ bison libncurses5-dev build-essential

# 下载mysql5.7并解压
sudo tar zxvf mysql-5.7.27.tar.gz
cd mysql-5.7.27

wget https://sourceforge.net/projects/boost/files/boost/1.59.0/boost_1_59_0.tar.gz -P /usr/src
sudo tar boost_1_59_0.tar.gz boost_1_59_0
sudo mv boost_1_59_0 /usr/local/boost

# 配置
sudo cmake . -DCMAKE_INSTALL_PREFIX=/usr/local/mysql \
-DMYSQL_DATADIR=/usr/local/mysql/data/ \
-DMYSQL_UNIX_ADDR=/usr/local/mysql/mysql.sock \
-DWITH_INNOBASE_STORAGE_ENGINE=1 \
-DWITH_MYISAM_STORAGE_ENGINE=1 \
-DENABLED_LOCAL_INFILE=1 \
-DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8 -DDEFAULT_COLLATION=utf8_general_ci \
-DMYSQL_USER=mysql \
-DWITH_DEBUG=0 \
-DWITH_EMBEDDED_SERVER=1 \
-DDOWNLOAD_BOOST=1 -DENABLE_DOWNLOADS=1 -DWITH_BOOST=/usr/local/boost

# 编译
sudo make

# 安装
sudo make install

# 新建用户和组mysql，切换/usr/local/mysql/下文件归属
sudo groupadd mysql
sudo useradd -g mysql mysql
sudo chown -R mysql:mysql /usr/local/mysql/

# 初始化mysql，生成一个临时密码，下一步登录使用
sudo /usr/local/mysql/bin/mysqld --initialize --user=mysql

sudo cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysql
sudo chmod 755 /etc/init.d/mysql
sudo /etc/init.d/mysql start|stop|status

sudo /etc/init.d/mysql start
sudo /usr/local/mysql/bin/mysql -u root -p
PASSWRORD: 临时密码
set password for 'root'@'localhost' = password('123456');

# 编辑环境变量
sudo vim ~/.bashrc
export PATH=$PATH:/usr/local/mysql/bin

source ~/.bashrc
```

### 安装python

```bash
cd ~
sudo apt isntall virtualenv
sudo virtualenv --no-site-packages --python=python3  virtualenv
sudo chown -R ubuntu:ubuntu virtualenv/
source virtualenv/bin/activate

pip install django
django-admin startproject web
cd web
sudo vim web/settings.py
# 修改配置 ALLOWED_HOSTS = ['*']
python manage.py runserver 0.0.0.0:8000
```

### 安装uwsgi

uwsgi 把python源码变为一个服务

### 部署django

### 启动命令





