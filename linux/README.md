
## 设计思想

- 程序应该小而专一，只专注于一件事上，干掉90%用不到功能
- 程序不只要考虑性能，程序的可移植性更重要，如shell, python > c
- 一切皆文件，尽量使用文本文件来存储数据，避免二进制文件，文本文件有常见工具来处理awk, sed, grep等
- 让每个程序都成为过滤器，程序需要与其他工具配合使用，管道的支持非常重要
- 任何程序要考虑被批处理执行，尽量避免与用户交互

注: 测试环境 CentOS7

## 常用目录

合理规划的设计思想 26个英文字母 必须熟记

- boot 启动文件
- dev 设备文件
- etc 配置文件
- home 家目录 /home/$username
- media 移动存储自动挂载目录 /media/$device_name
- mnt 手动挂载目录
- opt 三方软件安装目录
- proc 内存系统文件
- root 管理员家目录
- run 里面的东西是系统运行时需要的，不能随便删除，重启时应该被抛弃，下次启动时重新生成
- srv 服务相关数据
- sys 系统文件
- tmp 临时文件
- usr 存放库文件、文档、命令、用户数据等
- var 日志文件
- lib 库文件

## 常用命令

命令格式

```
命令 [选项] [参数]

如 ls -a /tmp
* ls 命令
* -a 选项 等价于 --all
* tmp 参数

补充 [可选项] {必选项}
```

命令分类
- 内部命令 内核自带 执行效率高
- 外部命令 需要外部安装 系统已默认安装很多外部命令

```
[hostname]# type type
type is a shell builtin

[hostname]# type clear
clear is /usr/bin/clear

类似
- JavaScript typeof
- Python type(var)

[hostname]# echo $PATH    # 类似 print("xxx") 或 console.log("yyy")
/usr/local/bin
/usr/local/sbin
/usr/bin
/usr/sbin
区别
- bin的命令任何人都可以使用
- sbin的命令称为特权命令，只能管理员使用
```

常用命令

- 清屏命令 clear -> ctrl + l
- 帮助命令 man 有困难找男人
- 改变目录 cd
- 列表当前目录文件 ls [-a -l -d]
- 显示主机名 hostname
- 显示日期时间 date
- 显示日历 cal
- 计算器 bc
- 重启命令 reboot(普通用户)   shutdown -r | init -6  (管理员)
- 关机命令 halt(普通用户)  shutdwon -h | init -0  （管理员）
- 注销命令 logout
- 显示当前操作系统和机器的信息 uname  uname -a | uname -r
- 显示当前路径 pwd


## 文件相关

文件管理

- 新建 touch
- 删除 rm   rm -rf /
- 修改 mv   mv old new
- 查看 ls   ls -al
- 移动 mv
- 拷贝 cp   cp -rpf
- 查看 cat


touch
```
* 新建空文件 inode(文件元数据)+block(文件内容)  stat {文件名}
Access atime 访问的时间，如less file
Change ctime 节点修改时间，如修改文件名 mv file file1
Modify mtime 修改内容，会影响 atime ctime mtime
```

ls
```
ls -l /dev/
```

cat
```
用于连接文件并打印到标准输出设备上

cat - 所有文件
head - 开头
tail - 尾巴

cat /etc/passwd
cat -n /etc/passwd
tail -f /etc/passwd
```

文件夹管理
- 创建文件夹 mkdir
- 删除空文件夹 rmdir
- 删除不为空的文件夹 rm -r
- 改名 mv
- 查看 ls

```
mkdir -p a/b/c
rmdir -p a/b/c
```

## Vim

vim不是一个排版工具，只能编辑文本，没有菜单，只有命令

- 命令模式
- 插入模式  R  可以尝试下
- 末行模式  :
- 替换模式  aoi


命令模式
```
光标移到开头 gg
光标移到最后一行 G
光标移动一个单词 w

保存退出 ZZ

复制行 yy -yanked
复制n行 如5yy
粘贴到光标行后 p
粘贴到光标行前 P

向后不断删除字符 x
向前不断删除字符 X

删除行 dd
删除n行 如5dd

撤销操作 u

搜索
/search_key
```

末行模式
```
不保存，强制退出 q! 
保存 w
保存退出 wq

:s/old/new/ 只替换光标所在行第一个old

:set nu    设置行号
:set nonu  取消行号
```

相关文件
```
.viminfo   vim 如 命令操作记录
.vimrc  个人定制 如 set nu
```

## 用户和组

联想 web 应用权限设计

- 管理员 root
- 系统用户 uid小于1000 系统服务管理用户，一般不允许登录系统
- 普通用户 uid大于999 权限较小 可以登录系统 只能使用bin目录下的命令

组
- 就是一个用户容器，用来装用户，没有其他意义
- 默认情况下，新建用户的同时，系统会创建一个同名组装载该用户
- 在Linux中的每个用户必须属于一个组，不能独立于组外
- 在Linux中每个文件有所有者、所在组、其他组的概念
- Linux下的权限是针对具体文件设置的


用户管理
```
# user01 UID 1500; 附属于root组; 家目录/tmp/user01; 登录shell /bin/bash
useradd -u 1500 -G root -d /tmp/user01 -s /bin/bash -c "test user01" user01

# user02 系统用户; 不要家目录; 不允许交互登录
useradd -r -M -s /sbin/nologin user02

# user03 启用过期 过期时间为 2021-02-30
useradd -f 3 -e 2021-02-20 user03

# user04 UID 0 GID 0
useradd -o -u 0 -g 0 user04

# 切换用户
su - user01
su - user03
su - user04

# 锁定用户 解锁用户
passwd -l user01
passwd -u user01

# 设置密码 - 交互
passwd user01

# 设置密码
echo "passwd" | passwd --stdin user01

# 删除用户
userdel user01
rm -rf /home/user01
rm -rf /var/mail/user01

userdel -r user02   # 删除用户及关联文件

man usermod
```

密码文件
```
/etc/passwd
[用户名]:[隐藏密码占位]:[UID]:[GID]:[身份描述]:[主目录]:[登录shell]

/etc/shaow 影子文件 实际密码信息 密码过期时间
```

组
```
/etc/group
/etc/gpasswd

groupadd
groupdel
groupmod
gpasswd
```

用户创建相关文件
```
/etc/passwd 用户账户信息
/etc/shadow 用户账户安全信息
/etc/group   组账户信息
/etc/gpasswd 组账户安全信息

/etc/default/useradd 账户创建默认值
/etc/login.defs  密码套件配置
/etc/skel/ 创建家目录默认文件模板
```

## 权限
Linux权限其实就是用户对Linux中的文件和文件夹的权限
- 读 r(read)
- 写 w(write)
- 执行 x(execute)


## 软件安装
- rpm 源码封装后的格式，类似于exe格式 不是特别安全
- yum
- 源码 软件源代码，可以修改优化 推荐

rpm
```
rpm -ivh package_name
- 安装时会遇到依赖问题

rpm -qa
```

yum
```
yum install elinks


搭建yum源
- file 本地传输协议
- ftp http https 基于网络


配置客户端
cd /etc/yum.repos.d

# 必须.repo结尾 如 testing.repo
[ftp]
name=ftp
baseurl=ftp://localhost/pub
gpgcheck=0

# 本地源
[local]
baserurl=file:///mnt/dvd
gpgcheck=0

less /etc/yum.conf
cachedir=/var/cache/yum/$basearch/$releasever
keepcache=0
logfile=/var/log/yum.log

man yum
- yum install
- yum remove 
- yum update
- yum search
```

源码安装
```
# 安装nginx
cd ~
wget http://nginx.org/download/nginx-1.18.0.tar.gz
tar -zxvf nginx-1.18.0.tar.gz
cd nginx-1.18.0 

# configure 检查安装环境及依赖
./configure
yum install pcre-devel zlib-devel

# make 编译生成安装文件
make

# 安装到系统
make install
```

## 系统服务

- 初始化进程 pid=1 
- 特殊守护进程 systemd  命令systemctl

独立服务
- 各类服务启动关闭等操作脚本 /usr/lib/systemd/system

```
systemctl [command] [unit]
command主要有
- start 立刻启动后面的unit
- stop 立刻关闭后面的unit
- restart 即stop->start
- reload 不关闭unit，加载配置
- enable 开机自启动unit
- disable 开机不启动unit
- status 展示有没有执行、开始是否自启动等信息
- is-active 有没有正在执行
- is-enabled 有没有开机自启动
- kill 向unit发送信号
- show 列出配置
- mask 注销unit，即无法启动
- unmask 取消对unit的注销

# 部署vsftpd服务
yum install vsftpd

vim /usr/lib/systemd/system/vsftpd.service   # 该服务软件的启动脚本

[Unit]
Description=Vsftpd ftp daemon
After=network.target

[Service]
Type=forking
ExecStart=/usr/sbin/vsftpd /etc/vsftpd/vsftpd.conf

[Install]
WantedBy=multi-user.target

systemctl status vsftpd
systemctl start vsftpd
```

非独立服务 *了解即可
- xinetd，小的服务放到xinetd托管，提供访问控制、日志和资管管理等功能
```
# 配置文件
/etc/xinetd.conf
# 用于存放被托管的服务的目录
/etc/xinetd.d/

yum install -y telnet-server telnet xinetd
```


## 进程

Linux系统中几乎任何行动都会以进程的形式进行。进程是完成工作的形式，Linux内核的基本职责就是为进程提供做事情的地方以及使用的资源，不让彼此撞车

- ps 静态任务管理器
- top 动态任务管理器
- kill 杀死单个进程
- killall 杀死一个进程树

ps
```
ps aux
[COMMAND] 中括号表示系统进程 不可删除
```

top
```
空格 立即刷新
h 帮助
```

kill
```
原理：向Linux内核发送一个操作系统信号和进程号，然后内核对该进程号指定的进程进程处理

kill -l 列出所有信号
```

## 网络管理

NetworkManager网络管理服务，受systemd管理，可通过nmtui界面和nmcli命令来配置

- nmtui 文本界面下管理
- nmcli 命令行设置

```
yum install NetworkManager
systemctl start NetworkManager
systemctl enable NetworkManager
systemctl status NetworkManager

/etc/sysconfig
/etc/NetworkManager/子目录中

# nmtui
which nmtui
rpm -qf /usr/bin/nmtui
NetworkManager-tui-1.18.8-2.el7_9.x86_64

# nmcli
nmcli --help

其中
ens33 物理设备的名字 kernel
eth1  设备逻辑名字

ifconfig
ip addr show
```


## 性能管理


## 管道

上一个命令的输出作为下一个命令的输入

```
cat /etc/passwd | head -2
```

## 筛选 grep

```
grep --help
Usage: grep [OPTION]... PATTERN [FILE]...


# 忽略大小写
grep -i "Root" passwd

# 扩展正则 同 egrep "root" passwd
grep -E "root" passwd

# 取反
grep -v "root" passwd

# 只输出包含该字符串内容的文件名 -r 递归
grep -l -r "root" /etc

# 输出匹配的行数
grep -c "root" passwd

# 输出匹配行邻近行 
-B, --before-context=NUM
-A, --after-context=NUM
-C, --context=NUM
grep -C 5 "root" passwd
```

## 排序 sort
```
常和管道协作的排序命令 
cat tmp | sort -r -n -o t2
sort -n -t: -k3 /etc/passwd

-n 按数字排序
-r 倒序
-o 输出到文件
-t 分隔符
-k 关键字(按照指定列来排序)
```

##  重定向

```
# > 重定向输入, 若t1中有内容直接覆盖
echo "Hello world" > t1
# >> 重定向追加，若t1中有内容重开一行追加
echo "Hello world111" >> t1
echo "Hello world222" >> t1
# < 重定向输出
# << 重定向追加输出

0 代表标准输入 stdin
1 代表标准输出 stdout
2 代表标准错误输出 stderr

2>&1的意思: 把标准错误传送到标准输出要去的任何位置
echo "xxxx" > /dev/null 2>&1

<EOF   EOF  类似左右括号()
```

## 精确查找 - find

递归地在层次目录中处理文件，find语法和其他命令略有区别
find path -option 动作

```
# 按文件名搜索 passwd
find / -name passwd
find / -iname Passwd

# 指定层级
find / -maxdepth 2 -name passwd
find / -maxdepth 3 -mindepth 3 -name passwd
find / -name passwd -maxdepth 2 2> /dev/null    # 注意顺序和 2> /dev/null

# 搜索空文件或空文件夹
find / -empty

# 按权限查找
find / -perm 644 -name passwd

# 按照所属用户查找
find / -user nining
find / -uid 1000

# 按照文件类型来查找
find / -uid 1000 -type f		# 普通文件
find / -uid 1000 -type d		# 目录
find / -uid 0 -type l				# 链接文件
b 	块设备文件
c 	字符设备文件
p		管道文件
s		套接字文件

# 按照文件大小 c(字节) k(KB) M(MB) G(GB)
find / -size +100M -size -105M 2> /dev/null
```

## 模糊查找 - locate (了解即可)

- Linux系统每天特定时间自动索引备份到系统数据库中的文件
- 需要安装 yum install 指定包
- /var/lib/mlocate/locatedb
- updatedb

locate -i passwd	# 其实就是 "find / -name passwd" 另一种写法 


## shell


### shell介绍

shell是一个程序，采用C语言编写，用用户和Linux内核沟通的桥梁。它既是一种命令式语言，又是一种解释性编程语言。

用户 <-> shell <-> Linux内核


shell脚本: 将完成一个任务的所有命令按照执行的先后顺序，自上而下写入到一个文本文件中，然后给予执行权限


### shell基本组成

```
- 脚本起名有意义 nginx_install.sh
- #!/usr/bin/bash 指定该脚本运行的解释器   或者 /usr/bin/env bash
- # 注释说明
    # Author: Lightnning
    # Created Time: 2021-02-15 01:01:01
    # Script Description: This is just a testing script.
- 给执行权限 chmod 700 nginx_install.sh 或解释器
./nginx_install.sh 或者  bash nginx_install.sh
- cat /etc/shells 多个shell
- 退出脚本 释放系统资源 NUM 返回值状态码 echo $?   0 - 255
exit NUM   
```

脚本的执行
```
# 给予脚本执行权限
./script.sh

# 其他方式
bash script.sh

-x: 查看脚本的执行过程
-n: 脚本是否有语法错误

# . 和 source 读取文件，执行文件里的命令
. script.sh
source script.sh
```


shell中的特殊符号

```
~ 家目录 cd ~
- 上次目录 cd -
!ec 最近的ec 开头的命令 或 history -> !num 执行历史命令
$ 取变量中的内容  echo $USER
`` 字符串中的命令 echo "Date: `date +%F`"

重定向
wc < text.txt   统计数据流
wc text.txt 统计文本
```

计算器
```
# 整数
expr + - \*  / %    \转义符  整型
expr 1 + 1
expr 1 - 1
expr 1 \* 100
expr 10 / 3
expr 10 % 3
echo $?  查看上一条命令是否成功 从而判断是否为整型

echo 10 + 1 &> /dev/null; echo $?  系统的回收站

或者
echo $((100 + 2))

# 小数
echo "当前内存使用率: `echo "scale=2; 141*100/7966" | bc`%"
```


### 变量

变量：变量是编程中最常用的一种临时在内存中存取数据的一种方式

- 某个内容多次使用，代码中重复出现，可用变量存起来
- 某些命令的执行结果存起来


变量分类

- 全局变量 所有用户都可以使用，保存在/etc/profile和/etc/bashrc文件中
- 本地环境变量 用户私有变量 只有本地用户才能使用，保存在家目录 .bash_profle和.bashrc文件中
- 用户自定义变量 如脚本中定义的变量

变量定义格式:   变量名=值  

在shell编程中变量名和等号之间不能有空格，尽量用大写和命令区分

```
clear

NAME='linda'
AGE=18
SCORE=100

echo -e "name: $NAME, age: $AGE, score: $SCORE"

```
- 取消变量 unset AGE
- 定义全局变量 export GENDER='female'  注意关键字 export 子shell也可用该变量
- 环境变量 env  所有变量 set

内置变量

系统变量(内置bash中变量): shell本身已经固定好了它的名字和作用
```
$? 上一条命令执行状态 0: 正常  非0: 异常或出错
```


有类型的变量 declare
```
-i 将变量看成整数
-r 只读 不能修改值，不能unset
-x export
-a 索引数组 普通数组
-A 关联数组

declare -i num
```


### 格式化输出

计算机程序其实就是三步: 输入、运算、输出

echo命令：将输入的字符串送往标准输出(默认显示器)

```
语法：echo [-ne] [字符串]
-n  不要在字符串结尾换行，即不加-n就换行了
-e  若字符串出现以下字符需特殊处理，而不会把它当成一般字符输出

\a  发出警告声
\b  删除前一个字符
\t  插入tab
\n  换行且光标移至行首
```
输出字体颜色

echo输出字体颜色，需要参数 -e
```
echo -e "\033[背景颜色;字体颜色m 字符串 \033[0m"
- 关注 \033[ 开头 和 m 结尾
- 字符串前后空格是字符串一部分
- ; 英文分号隔开背景颜色和字体颜色

字颜色 30-37

背景颜色 40-47
```

交互式输入

```
输入的数据如汪洋大海，需要一个定位，如变量，命令行编程第一个为命令所以变量放置第二
```




