
## 设计思想

- 程序应该小而专一，只专注于一件事上，干掉90%用不到功能
- 程序不只要考虑性能，程序的可移植性更重要，如shell, python > c
- 一切皆文件，尽量使用文本文件来存储数据，避免二进制文件，文本文件有常见工具来处理awk, sed, grep等
- 让每个程序都成为过滤器，程序需要与其他工具配合使用，管道的支持非常重要
- 任何程序要考虑被批处理执行，尽量避免与用户交互


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

## 性能管理




