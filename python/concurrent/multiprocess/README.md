# 并发编程之多进程

## 进程理论

### 什么是进程

进程：正在进行的一个过程或者说一个任务，而负责执行任务则是CPU。比如

* 执行一个简单脚本，python bar.py 就会出现一个进程
* 双击pycharm，就会出现一个进程，即运行一个软件
* 运行nginx，就会出现一个进程，即运行一个服务
* 执行tail, grep也会出现进程

### 并发与并行

无论是并发还是并行，在用户看来都是`同时`运行，其实进程或线程都是一个任务而已，真正干活的是CPU，而一个CPU同一时刻只能执行一个任务

* 并发：是伪并行，即看起来是同时运行，单个CPU+多道技术实现并发
* 并行：同时运行，只有具备多个CPU才能实现并行

### 进程的创建

硬件 -&gt; OS -&gt; 进程 -&gt; 进程的创建

* 系统初始化\(如Linux ps命令，Windows任务管理器\)，默认创建一些进程
* 一个进程运行过程中开启了子进程\(如Nginx开启多进程，os.fork，subprocess.Popen等\)
* 用户的交互式请求\(如双击QQ\)
* 一个批处理作业的初始化\(如在大型机批处理系统中的应用\)

OS不同，创建的方式有区别

* Unix中 fork ；Windows中CreateProcess

关于创建的子进程，Unix和Windows

* 相同点：父进程和子进程有各自不同的地址空间\(多道技术要求物理层面实现进程之间内存的隔离\)，任何一个进程的在其地址空间中的修改都不会影响到另外一个进程；
* 不同点：在Unix中，子进程的初始地址空间是父进程的一个副本，提示：子进程和父进程是可以有只读的共享内存区的。但是对于windows系统来说，从一开始父进程与子进程的地址空间就是不同的。

### 进程的终止

* 正常退出\(自愿，如exit\)
* 出错退出\(自愿，如python bar.py中bar.py不存在\)
* 严重错误\(非自愿，如引用不存在的内存，1/0等，但可以捕获try...except...\)
* 被其他进程杀死\(非自愿，如kill -9\)

### 进程的层次结构

无论Unix还是windows，进程只有一个父进程，不同的是：

* 在UNIX中所有的进程，都是以init进程为根，组成树形结构。父子进程共同组成一个进程组，这样，当从键盘发出一个信号时，该信号被送给当前与键盘相关的进程组中的所有成员。
* 在windows中，没有进程层次的概念，所有的进程都是地位相同的，唯一类似于进程层次的暗示，是在创建进程时，父进程得到一个特别的令牌（**称为句柄**）,该句柄可以用来控制子进程，但是父进程有权把该句柄传给其他子进程，这样就没有层次了。

### 进程的状态

`tail -f access.log | grep '404'`

执行 `tail` 开启一个子进程，执行`grep` 开启另外一个子进程，两个子进程之间基于管道`|` 通讯，将`tail`的结果作为`grep`的输入，进程`grep`在等待输入\(即I/O\)时的状态称为**阻塞**，此时`grep`无法运行

两种情况下会导致一个进程在逻辑上不能运行：

* 进程挂起是自身原因，遇到I/O阻塞，便要让出CPU让其他进程去执行，这样保证CPU一直在工作；
* 与进程无关，是操作系统层面，可能会因为一个进程占用时间过多，或者优先级等原因，而调用其他的进程去使用CPU

一个进程的三种状态：

![](../../../.gitbook/assets/jin-cheng-de-san-zhong-zhuang-tai.png)

### 进程并发的实现

进程并发的实现在于，硬件中断一个正在运行的进程，把此时进程运行的所有状态保存下来，为此，操作系统维护一张表格，即进程表（process table），每个进程占用一个进程表项（这些表项也称为进程控制块）

![](../../../.gitbook/assets/jin-cheng-zhuang-tai-biao.png)

该表存放了进程状态的重要信息：程序计数器、堆栈指针、内存分配状况、所有打开文件的状态、帐号和调度信息，以及其他在进程由运行态转为就绪态或阻塞态时，必须保存的信息，从而保证该进程在再次启动时，就像从未被中断过一样。
