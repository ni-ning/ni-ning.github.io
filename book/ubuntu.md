本章节关于 The Linux Command Line 读书笔记，语言通俗易懂，适合入门，并且图书是开源性质

* 官网\(包含下载链接\)  [http://linuxcommand.org/](http://linuxcommand.org/)
* 中文开源翻译  [http://billie66.github.io/TLCL/index.html](http://billie66.github.io/TLCL/index.html)

## Introduce

> Freedom is the power to decide what your computer does, and the only way to have this freedom is to know what your computer is doing.Freedom is a computer that is without secrets, one where everything can be known if you care enought to find out.

> It's been said that "graphical user interfaces make easy tasks easy, while command line interfaces make difficult tasks possible" and this is still very true today.

> Linux is not just a piece of software; it's also a small parg of the larger Unix culture, which has its own languuage and history.

This book is divided into four parts, each covering some aspect of the command line experience:

* **Part 1 - Learning The Shell** starts our exploration of the basic language of the command line including such things as the structure of commands, file system naviagtion, command line editing, and finding help and documentation for commands.
* **Part 2 - Configuration And The Environment** covers editing configuration files that control the computers oparation from the command line.
* **Part 3 - Command Tasks and Essential Tools** explores many of the ordinary tasks that are commonly performed form the command line. Unix-like operating systems, such as Linux, contain many "classic" command line programs that are used to perform powerful operations on data.
* **Part 4 - Writing Shell Scripts** introduces shell programming,  an admittedly rudimentary, but easy to learn, technique for automating many common computeing tasks. By learning shell programming, you will become familiar with concepts that canbe applied to many other programming languages.

> Technically speaking, Linux is the name of the operating systems's kernel, nothing more.

> This book is an ongoing project, like many open source software projects.


快速识别整段英文信息：形容词的中心词 + 动词结构 + 形容词的宾语结构，说明性介词结构


## Part 1 - Learning the Shell

###  1 - What Is the Shell?

> The shell is a program that takes keyboard commands and passes them to the operating system to carry tou.

* `date`
* `cal` to display a calendar of the curruent month
* `df`  to see the current amount of free space on our disk drives
* `free` to display the amount of free memory

介词定位术

* on our Linux system
* at the prompt
* in this chapter

### 2 - Navigation

* `pwd` - Print name of current working directory
* `cd` - Change directory
* * cd  Changes the working directory to your home directory
* * cd  -  Changes the working directory to the previous working directory
  * cd ~username
* `ls` - List directory contents

### 3 - Exploring the System

* `ls`  get a list of files and subdirectories contained in the current working directory
* `ls /usr`  specify the directory to list
* `ls ~ /usr`  specify multiple direcotories
* `ls -l`  change the format of the output to reveal more detail

#### Options and Arguments

This brings us to a very important point about how most commands work. Commands are often followed by one or more _**options**_ that modify their behavior, and further, by one or more _**arguments**_, the items upon which the command acts. So most commands look kind of like this:

```bash
command -options arguments
```

the ls command has a large of possible options. The most common are listed below.

![](../../.gitbook/assets/image%20%2810%29.png)

#### A Longer Look at Long Format

![](../../.gitbook/assets/image%20%286%29.png)

#### Determing a File's Type with file

#### View File Contents with less  - Less Is More

`less /etc/passwd`  to examine the file that defines all teh sysmtem's user accounts.

The less program was designed as an improved replacement of an earlier Unix program call _**more**_.

{% hint style="info" %}
英文名词 an improved replacement  &lt;  --  &gt;  中文动词  提高替换
{% endhint %}

#### Taking a Guided Tour

命令行界面：双击选中，点击滑轮粘贴

`/`  Where everything begins.

`/bin`  Contains binaries\(programs\) that must be present for the system to boot and run.

```bash
# 每个字母开头，挑选一个代表
bash    cp    df    echo    grep    hostname    ip
journalctl    kill    less    mkdir    mv    netstat    
ping    rm    sed    touch    which
```

`/boot`  the Linux kernal, initail RAM disk image,  and the boot loader.

* /boot/grub/grub.conf
* /boot/vmlinuz

`/dev`   device nodes, "Everything is a file"

* /etc/passwd
* /etc/crontab

`/home`  

`/lib`  similiar to DLLS

`/lost+found`   for recovery

`/media`\` on modern Linux system, for removable media

`/mnt`   on older Linux system, for removable media

`/opt`  to hold commercial software products

`/proc`  a virtual file system, will give us a picture of how the kernel sees the computer

* /proc/cpuinfo

`/root`  the home directory for the root account

`/sbin`  vital system tasks for the superuser

```bash
fdisk    reboot    shutdown    init
```

`/tmp`

`/usr`  the directory is likely the largest one

`/usr/bin`  installed by the Linux distribution, hold thousands of programs

```bash
apt-get    curl    file    git    killall    link    python    ssh
telnet   vim     wc    wget    whereis    whatis    whoami
```

`/usr/lib`

`/usr/local`

`/usr/sbin`  system administration programs

* netplan

`/usr/share`

`/usr/share/doc`

`/var`   data that is likely to change is stored, such as databases, spool files, user mail.

`/var/log`   log files

#### Symbolic Links

In most Unix-like systems it is possible to have a file referenced by multiple names.

* foo -&gt; foo.2.7
* libc.so.6 -&gt; libc.2.6.so

#### Hard Links

### 4 - Manipulating Files and Directories

* cp - Copy files and directories
* mv - Move/rename files and directories
* mkdir - Create directories
* rm - Remove files and directories
* ln - Create hard and symblic links

These five commands are among the most frequently user Linux commands.

#### Wildcards

Since the shell uses filenames so much, it provides special charaters to help us rapidly specify groups of filenames. These special charaters are called _**wildcards**_.

Wildcards can be used with any command that accepts filenames as arguments.

#### mkdir - Create Directories

mkdir direcotory...

When three periods follow an argument in the description of a command\(as above\), it means that the argument can be repeated.

**rm的options**

![](../../.gitbook/assets/image%20%2828%29.png)

这节的小练习，多敲几遍

```bash
cd ~
mkdir playground
mkdir dir1 dir2
cp -iv /etc/passwd .
mv passwd fun
mv fun dir1
mv dir1/fun dir2
mv dir2/fun .
mv fun dir1
mv dir1 fir2
mv dir2/dir1 .
mv dir1/fun .
```

`ln -s item symbolic-link`

### 5 - Working with Commands

We will attempt to remove mysterious options and arguments and even create our own commands.

#### What Exactly Are Commands?

* an executable program
* a command built into the shell itself
* a shell function, related with the _**environment**_
* an alias

type - Display a Command's Type  

是 shell builtin, executable program 还是 alias，拉出来看看

which - Display an Executable's Location    only works for executable programs

man - Disaplay a Program's Manual Page

whatis - Display One-Line Manual Page Descriptions

help - Get Help for Shell Builtins

Creating Our Own Commands with alias

* alias foo='cd /usr; ls; cd -'
* unalias foo
* alias

### 6 - Redirection

In this lesson we are going to unleash what may be the coolest feature of the command line. It's called I/O redirection. I/O redirection allows us to change where output goes and where input comes from. Normally, output goes to the screen and input comes form the keyboard, but with I/O redirection, we can change that.

#### Standard Input, Output, and Error

Many of the programs produce output of some kind.

* results
* status and error messages

按照一切都是文件的规则，程序会把正常的输出值 to a special file called _**standard output**_ and 错误状态信息 to another file called _**standard error**_. In addition, many programs take input from a facility called _**standard input**_, which is, by default, attached to the keyboard.

```python
# Redirecting Standard Output
ls -l /usr/bin > ls-output.txt    # 类似python open 的 'w' 模式
> ls-output.txt                   # 清空

ls -l /usr/bin >> ls-output.txt   # 类似python open 的 'a' 模式

# Redirecting Standard Error
ls -l /bin/usr 2> ls-error.txt
ls -l /bin/usr 2>> ls-error.txt

# Redirecting Standard Output and Standard Error to One File
ls -l /usr/bin &> ls.txt
ls -l /usr/bin &>> ls.txt

# Disposing of Unwanted Output
# 'silence is golden' /dev/null In Unix Culture
ls -l /bin/usr 2> /dev/null
```

#### Redirecting Standard Input

cat - Concatenate Files

* The cat command reads one or more files and copies them to standard output.
* We can use it to display files without paging.
* Cat is often used to display shourt text files.

```bash
# enter cat with no argument
cat        # ctrl + d --> end

cat > lazy_dog.txt
cat < lazy_dog.txt
```

#### Pipelines

Using the pipe operator \| \(vertical lar\), the standard output of one command  can be piped into the standard input of another.

```bash
command1 | command2  # 作为 command2 的 argument
command1 > file1     # 会覆盖文件 file1

# Filters
ls /bin /usr/bin | sort | less    # 把 /bin 和 /usr/bin 统一输出排序

# uniq - Report or Omit Repeat Lines
ls /bin /usr/bin | sort | uniq | less      # 去重
ls /bin /usr/bin | sort | uniq -d | less   # 重复项

# wc - Print Line, Word, and Byte Counts
wc ls-output.txt
>>> 713  6702 44983 ls-output.txt
ls /bin /usr/bin | sort | uniq | less | wc -l

# grep - Print Lines Matching a Pattern
# When grep encounters a 'pattern' in the file, it prints out the lines containing it.
ls /bin /usr/bin | sort | uniq | grep zip
# a couple of handy options for grep
-i, ignore case
-v, those lines that do not match the pattern

# head/tail - Print First/Last Part of Files
# 默认 10 行 -n 指定
head -n 5 ls-output.txt
tail -n 5 ls-output.txt
# monitor the file, and when new lines are appended, they immediately appear on the display
tail -f /var/log/messages
```

### 7 - Seeing the World as the Shell Sees It

#### Expansion

Each time we type a command and press the Enter key, _**bash**_ perform serveral substituions\(replacement\) upon the text before it carries out our command.

_**echo**_ - It prints its text arguments on standard output.

```bash
# Pathname Expansion
echo d*
echo /usr/*

# Tilde Expansion
echo ~    # /home/ubuntu

# Arithmetic Expansion allows us to use the shell prompt as a calculator
echo $((2 + 2))
echo Five divided by two equals $((5/2))

# Brace Expansion
echo Front-{A,B,C}-Back
>>> Front-A-Back Front-B-Back Front-C-Back

# Parameter Expansion
echo $USER
printenv | less

# Command Subsitution allows us to use the output of a command as an expansion
echo $(ls)
echo -l $(which cp)
file $(ls -d /usr/bin/* | grep zip)
echo -l `which cp`    # in older shell programs

# Quoting
echo this is a    test.
>>> this is a test.

echo text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER
>>> text /home/ubuntu/foo.txt a b foo 4 ubuntu
echo "text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER"
>>> text ~/*.txt {a,b} foo 4 ubuntu
echo 'text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER'
>>> text ~/*.txt {a,b} $(echo foo) $((2+2)) $USER

# Escaping Characters
echo "The balance for user $USER is: \$5.00"
>>> The balance for user ubuntu is: $5.00
```

### 8 - Advanced Keyboard Tricks

#### Command Line Editing

bash uses a library \(a shared collection of routines that different programs can use\) called _**Readline**_ to implement command line editing.

```bash
# Cursor Movement
ctrl + a    Move cursor to the beginning of the line.
ctrl + e    Move cursor to the end of the line.
ctrl + l    Clear the screen and move the cursor the top-left cornor. clear

# Cutting and Pasting (Killing and Yanking) Text
# The Readline documention uses the terms killing and yanking to refer to
# what we would commonly call cutting and pasting
ctrl + k    Kill text from the cursor location to the end of line.
ctrl + u    Kill text from the cursor locaiton to the beginning of the line.
ctrl + y    Yank text from the kill-ring and insert it at the cursor location
```

#### Completion - Tab

#### Using History

the hidden file _**.bash\_history**_ in our home directory kept the list of history commands.

```bash
history
history | less
!88    # magic command, history expansion

ctrl + r    # 搜索历史命令
>>>(reverse-i-search)`': xxxx
```

### 9 - Permissions

Operating systems in the Unix tradition differ from those in the MS-DOS tradition in that they are not only _**multitasking systems**_, but also _**multi-user systems**_.

多人同时登录必须保证各自操作的安全，不能随意操作别人的文件，不能破坏电脑

#### Owners, Group Members, and Everybody Else

```bash
less /etc/passwd
less /etc/group
less /etc/shadow

id
```

**Reading, Writing, and Executing**

_**chmod**_ - Change File Mode

```bash
# r->4,  w->2,  x->1
# common ones: 7(rwx), 6(rw-), 5(r-x), 4(r--), and 0(---)
chmod 600 foo.txt
```

![](../../.gitbook/assets/image%20%2815%29.png)

文件和文件夹略有不同

![](../../.gitbook/assets/image%20%2819%29.png)

示例说明

![](../../.gitbook/assets/image%20%2823%29.png)

#### sudo - Execute a Command as Another User

To authenticating using sudo, requires the user's own password.

_**passwd**_ - Changing Your Password

### 10 - Processes

Processes are how Linux organizes the different programs waiting for their turn at the CPU.

#### How a Process Works

init  --&gt;  init scripts  --&gt;  system services, namely daemon programs, which just sit in the background

> The kernel maintains information about each process to help keep things organized.

#### View Processes

```bash
ps aux # BSD Style, a snapshot of the machine's state at the moment
top    # display a continuously updating(default 3s) display of the system processes
pstree # Outputs a process list arranged in a tree-like pattern 
       # showing the parent-child relations between processes.

kill -9 process_id
killall xlogo
```

## Part 2 - Configuration and the Environment

### 11 - The Environment

> As we discussed earlier, the shell maintains a body of information during our shell session called the _**environment**_.

#### What is Stored in the Environment?

* environment variables
* shell variables, and some programmatic data, namely aliases and shell funtions

```bash
# Examining The Environment
set        # show both the shell and environment variables
printenv   # only display the latter

printenv USER
echo $USER
alias

# Some Interesting Variables
$SHELL    $HOME    $LANG    $PATH    $PS1    $PWD    $TERM    $USER
```

#### How Is The Environment Established?

> When we log on to the system, the _**bash**_ program starts, and reads a serias of configuration scripts called startup files, which define the default environment shared by all users.

* a login shell session, a virtual console session, username and password
* a non-login shell session, in the GUI

![](../../.gitbook/assets/image%20%2812%29.png)

#### Modifying the Environment

> Since we know where _**the startup files**_ are and what _**they**_ contain, we can modify _**them**_ to customize our environment.

{% hint style="info" %}
英文当中代词多，因为用的多
{% endhint %}

#### Activating Our Changes

The changes we have made to our .bashrc will not take effect until we close our terminal session and start a new one because the .bashrc file is only read at the beginning of a session.

`source ~/.bashrc`

### 12 - A Gentle Introduction to vi

#### Why We Should Learn vi

* vi is almost always available.
* vi is lightweiht and fast.
* We don't want other Linux and Unix users to think we are cowards.

### 13 - Customizing the Prompt

The Prompt is defined by an environment variable named PS1\(short for "prompt string 1"\)

#### Adding Color

Most terminal emulator programs respond to certain non-printing character sequences to control such things as character attributes\(such as color, bold text, and the dreaded blinking text\) adn cursor position.

## Part 3 - Common Tasks and Essential Tools

### 14 - Package Management

Most distributions fall into one of two camps of packaging technologies: the Debian .deb camp and the Red Hat .rmp camp

![](../../.gitbook/assets/image%20%283%29.png)

If a package requires a shared resource such as a shared library, it is said to have a _**dependency**_.

Package management systems usually consist of two types of tools.

* Low-level tools which handles tasks such as installing and removing package files
* High-level tools that perform metadata searching and dependency resolution

![](../../.gitbook/assets/image%20%2827%29.png)

![](../../.gitbook/assets/image%20%2825%29.png)

#### Finding a Package in a Repository

![](../../.gitbook/assets/image%20%2813%29.png)

#### Installing a Package from a Repository

![](../../.gitbook/assets/image.png)

#### Installing a Package from a Package File

If a package file has been downloaded from a source other than a repository, it can be installed directly\(though without dependency resolution\) using a low-level tool.

![](../../.gitbook/assets/image%20%287%29.png)

#### Removing a Package

![](../../.gitbook/assets/image%20%2816%29.png)

#### Updating Packages from a Repository

![](../../.gitbook/assets/image%20%2824%29.png)

#### Updating a Package from a Package File

![](../../.gitbook/assets/image%20%2826%29.png)

#### Listing Installed Packages

![](../../.gitbook/assets/image%20%2817%29.png)

#### Determining Whether a Package is Installed

display information about an installed package

![](../../.gitbook/assets/image%20%285%29.png)

![](../../.gitbook/assets/image%20%284%29.png)

`dpkg --status emacs  or sudo apt-cache show tmux`

#### Finding Which Package Installed a File

![](../../.gitbook/assets/image%20%2818%29.png)

```bash
sudo apt-get update
sudo apt-cache search tmux    # 查询可安装软件名称
sudo apt-get install tmux     # 安装
sudo apt-get remove tmux      # 删除
sudo apt-get updgrade         # 更新所有，慎用; 某个可删除再安装
sudo apt-cache show tmux      # 查看安装信息

dpkg -i tmux-xxx.xx.xx
dpkg -i tmux-xxx.xx.xx
dpkg -s|--status tmux    # 查看安装信息
dpkg -S tmux             # 查看安装路径
```

### 16 - Networking

#### ping - Send an ICMP ECHO\_REQUEST to network hosts

Most network devices recving this packet will reply to it, allowing the network connection to be verified.

performance statistics

#### traceroute - Print the route packets trace to a network host

#### ip - Show/manipulate routing, devices, policy routing and tunnels

The `ip` program is a multi-purpose network configuration tool that makes use of the full range networking of features available in mordern Linux kernels.

`ip [OPTIONS] OBJECT { COMMAND | help } 如 ip address`

The first, called `lo`, is the loopback interface, a virtual interface that the system uses to "talk to itself" and the second, called `eth0`, is the Ethernet interface.

### 17 - Search for Files

#### locate - Find Files the Easy Way

```bash
locate bin/zip    # 定位文件文件名
```

* updatedb 定时任务统计文件名

#### find - Find Files the Hard Way

```bash
find ~ -type f -name '*.jpg' -size +1M

find ~ \( -type f -not -perm 0600 \) -or \( -type d -not -perm 0700 \)
```

### 18 - Archiving and Backup

> Throughout the history of computing, there has been a struggle to get the most data into the smallest available space, whether that space be memory, storage devices, or network bandwidth.

compression algorithoms: lossless and lossy

#### gzip - compress one or more files 会把源文件替换成压缩版本 

```bash
gzip foo.txt
>>> foo.txt.gz

gzip -d foo.txt.gz or gunzip foo.txt.gz
>>> foo.txt

# 同理
bzip2 foo.txt
>>> foo.txt.bz2

bzip2 foo.txt.bz2 or bunzip2 foo.txt.bz2
>>> foo.txt
```

* 无压缩空间的的文件，避免再次压缩，文件会变大，因会增加额外信息 gzip picture.zip

#### tar - short for tape archive  打包与解包

* .tar for a 'plain' tar archive
* .tgz for a gzipped archive

tar --help \| less

![](../../.gitbook/assets/image%20%281%29.png)

* 其中 f 指定文件 archive.tar
* c 关联 create
* x 关联 extract
* a slightly odd way of expressing options, 可不加 leading dash

```bash
mkdir -p playground/dir-{001...100}
touch playground/dir-{001...100}/file-{A..Z}

tar cf p.tar playground  # 打包 to p.tar from playground
tar tvf p.tar            # 详细展示p.tar内容
mkdir foo
tar xf p.tar -C foo       # 解包p.tar 到 目录foo  
```

#### zip - both a compression tool and an archiver

```bash
zip -r p.zip playground    # put playground to p.zip
unzip p.zip
```

#### rsync - synchronizing files and directories

```bash
rsync -av source destination
```

### 23 - Compiling Programs

Why compile software?

* Availability. Linux 发布版包括了一些常用软件，但是不是全部. In some case, need to compiling
* Timeliness. 尝试新版本

#### What is Compiling?

Simply put, compiling is the process of translating _**source code**_ \(the human-readable description of a program written by a programmer\) into the native language of the computer's processor.

* machine language
* assembly language  --&gt; assembler --&gt; machine language
* high-level programming language  --&gt; compiler  --&gt; 有些会编译成 汇编语言
* linking, libraries, executable program file
* A program called _**linker**_ is used to form the connections between the output of the compiler and the libraries that the compiled program requires.

#### Are All Programs Compiled?

* 编译型语言
* 解释性语言

#### Compiling a C Program

```bash
which gcc
>>>/usr/bin/gcc

wget https://ftp.gnu.org/gnu/diction/diction1.11.tar.gz 
tar xzf diction-1.11.tar.gz

cd diction-1.11

./configure    # 产生重要文件 Makefile
make           # 结合 Makefile 生成安装程序
>>> make: Nothing to be done for `all'.
rm getopt.o
make

make install    # 安装程序
```

* The file `Makefile` describes the relationships and dependencies among the components that comprise the finished program.
* 重要文件 可研究  README INSTALL

## Part 4 - Writing Shell Scripts

### 24 - Writing Your First Script

#### What are Shell Scripts?

In the simplest terms, a shell script is a file containing a series of commands. The shell reads this file and carries the commands as though they have been entered directly on the command line.

#### How to Write a Shell Script

* Write a script
* Make the script executable
* Put the script somewhere the shell can find it

编写脚本 vim hello

```bash
#!/bin/bash
# This is our first script.
echo 'Hello World!'
```

* 第一行 The \#! charater sequence is, in fact, a special constuct called a shebang. The shebang is used to tell the kernel the name of the  interpreter that should be used to execute the script that follows.
* 第二行 \# 注释
* 第三行 同命令行模式下 echo 'Hello World!' 

修改为可执行，并调整执行路径

```bash
chmod 755 hello
./hello.sh

export PATH=~/bin:"$PATH"
```

### 27 - Flow Control: Branching with if

```bash
x=5

if [ "$x" -eq 5 ]; then
    echo "x equals 5"
else
    echo "x does not equal 5"
fi
```

The if statement has the following syntax:

```bash
if commands; then
    commands
[elif commands; then
    commands...]
[else
    commands]
fi
```

#### Exit Status

Commands\(including the scripts and shell functions we write\) issue a value to the system when they terminate, called an exit status.This value, which is an integer in the range of 0 to 255, indicates the success of failure of the command's execution. By convention, a value of zero indicates success and any other value indicates failure. The shell provides a parameter that we can use to examine the exit status. Here we see it in action:

```bash
ls -d /usr/bin
>>> /usr/bin
echo $?
>>> 0
ls -d /bin/usr
>>> ls: cannot access /bin/usr: No such file or directory
echo $?
>>> 2
```

#### test

By far, the command used most frequently with if is test. The test command performs a variety of checks and comparisions. It has two equvalent forms. The first, shown here:

`test expression`

And the second, more popular form, shown here:

`[ expression ]`

#### File Expressions

```bash
-d file    # file exists and is a directory
-e file    # file exists
-f file    # file exists and is a regular file

-r file    # file exists and is readable
-w file    # file exists and is writable
-x file    # file exists and is executable
```

```bash
#!/bin/bash
FILE=~/.bashrc

if [ -e "$FILE" ]; then
   if [ -f "$FILE" ]; then
       echo "$FILE is a regular file."
   fi
   
   if [ -d "$FILE" ]; then
       echo "$FILE if a directory."
   fi
   
   if [ -r "$FILE" ]; then
       echo "$FILE is readable"
   fi
   
   if [ -w "$FILE" ]; then
       echo "$FILE is writable"
   fi
   
   if [ -x "$FILE" ]; then
       echo "$FILE is executable/searchable"
   fi
else
    echo "$FILE does not exist"
    exit 1
fi

exit
```

* "$FILE" 注意加引号
* exit defaults to the exit status of the last command executed

#### String Expressions

```bash
-n string    # The length of string is greater than zero.
-z string    # The length of string is zero.

string1 = string2    # The use of double equal signs is supported by bash
string2 == strint2   # and is generally preferred, but it is not POSIX compliant
```

```bash
#!/bin/bash

# test-string: evaluate the value of a string

ANSWER=maybe

if [ -z "$ANSWER" ]; then
    echo "There is no answer."
    exit 1
fi

if [ "$ANSWER" = "yes" ]; then
    echo "The answer is YES."
elif [ "$ANSWER" = "no" ]; then
    echo "The answer is NO."
elif [ "$ANSWER" = "maybe" ]; then
    echo "The answer is MAYBE."
else
    echo "The answer is UNKNOWN."
fi

```

#### Integer Expressions

```bash
int1 -eq int2    # int1 is equal to int2.
int1 -ne int2    # int1 is not equal to int2.
int1 -le int2    # int1 is less than or equal to int2.
int1 -lt int2    # int1 is less than int2.
int1 -ge int2    # int1 is greater than or equal to int2.
int1 -gt int2    # int1 is greater than int2.
```

#### A More Modern Version of test

Modern versions of bash include a compound command that acts an enhanced replacement for test.

It uses the following syntax:

`[[ expression ]]`

* 兼容 \[ expressoin \]
* 支持正则 string1 =~ regex

#### \(\( \)\) - Designed for Integers

### 28 - Reading Keyboard Input

#### read - Read Values from Standard Input

```bash
read INT
read -p "Enter value >"
echo "REPLY = '$REPLY'"
```

### 29 - Flow Control: Looping with while/until

#### while

```bash
while commands; do
    commands
done
```

```bash
#!/bin/bash

DELAY=3

while [[ "$REPLY" != 0 ]]; do
    clear
    echo "
        Please Select:
        
        1. Display System Information
        2. Display Disk Space
        3. Display Home Space Utilization
        0. Quit
    "
    read -p "Enter selection [0-3] > "
    
    if [[ "$REPLY" =~ ^[0-3]$ ]]; then
        if [[ "$REPLY" == 1 ]]; then
            echo "Hostname: $HOSTNAME"
            uptime
            sleep "$DELAY"
        fi
        
        if [[ "$REPLY" == 2 ]]; then
            df -h
            sleep "$DELAY"
        fi
        
        if [[ "$REPLY" == 3 ]]; then
            if [[ "$(id -u)" -eq 0 ]]; then
                echo "Home Space Utilization (All Users)"
                du -sh /home/*
            else
                echo "Home Space Utilization ($USER)"
                du -sh "$HOME"
            fi
            sleep "$DELAY"
        fi
    else
        echo "Invalid entry."
        sleep "$DELAY"
    fi
done
```

## Part 5 - Practice

#### 设置时区

```bash
date -R
/etc/localtime  -> /usr/share/zoneinfo/Etc/UTC

sudo cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

