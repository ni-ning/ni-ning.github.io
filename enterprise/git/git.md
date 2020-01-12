# Git

## 一、git 基本使用

### 1. git 简介

牛人Linus Torvalds为方便管理开源系统Linux,  用C语言编写的分布式版本控制系统

* 开源免费
* 分布式
* 版本控制
* 分支管理

### 2. 安装配置

```bash
sudo apt-get install git
git --version

# --global 表示这台机器上所有git仓库都使用这个配置
sudo git config --global user.name "nining"
sudo git config --global user.email "nining1314@gmail.com"
git config --list
```

### 3. 版本库

版本库又名仓库，英文名repository，可以简单理解为一个目录，该目录里面的所有文件都可以被git管理起来，每个文件的修改、删除，git都能跟踪还原

```bash
sudo makdir git_repo
cd git_repo
git init
tree .git
```

{% hint style="info" %}
版本控制系统只能跟踪文本文件的改动，如txt，网页，程序源码等
{% endhint %}

另外区分一下git工作区、暂存区和版本库的概念

* 工作区：电脑中看到的目录
* 暂存区：或称缓存区，一般存放在.git目录下index文件中
* 版本库：工作区有一个隐藏的目录.git，这个不算工作区，而是git的版本库

![](../../../.gitbook/assets/git.jpg)

* 对工作区的修改或新增文件执行 `git add file` 时，暂存区的目录树被更新，同时工作区修改或新增的文件内容被写入到对象库中的一个新的对象中，而该对象的ID被记录到缓存区的文件索引中;
* 工作区 --&gt; `git add file` --&gt;  缓存区;  缓存区直接删除 `git rm --cached file`; 
* 只更改了工作区内容，没提交到缓存区， 若想丢弃工作区更改的内容，直接从缓存区拉最新内容即可

  `git checkout -- file`

* 已提交到缓存区，工作区和缓存区保持一致，版本库还是原状，思路还是覆盖操作 `git reset HEAD; git checkout -- file`
* 或比较危险的操作，`git checkout HEAD file`，直接覆盖缓存区和工作区
* 版本库可以实现真正意义上的版本管理，恢复到某次提交 `git reset --hard commit_id`
* 跳转到很早的版本时，但又想往回恢复，查看编号 `git reflog`
* 查看提交日志 `git log; git log --oneline`

### 4. 基本操作

```bash
git status    # 常用，有操作提示
git init      # 产生 .git 目录

git diff file              # 工作目录与缓存区比较
git diff --cached file     # 缓存区与本地仓库比较

git add/commit/reset

git log
git log --oneline
git reflog

....
```

### 5. 分支管理

```bash
# 拉取远程分支，再切换
git fetch origin feature1
git checkout feature1

# 分支合并
git branch -a  # 查看远程所有分支
git branch     # 查看本地所有分支
git checkout -b feature                   # 新增并切换分支
git checkout feature/auto_allocate_2019   # 切换分支
git branch -d feature                     # 删除分支

git merge feature  # 当前分支合并分支 feature
```

### 6. 标签

```bash
# 常用于稳定版本与发布
git tag v1.0
git tag -a v1.0 -m "this is tag v1.0"
git tag
git show v1.0
git reset --hard v1.0
git tag -d v1.0
```

### 7. 资源链接

\[git 简明教程\] \([https://www.runoob.com/manual/git-guide/](https://www.runoob.com/manual/git-guide/)\)

\[git 教程\]\([https://www.runoob.com/git/git-tutorial.html](https://www.runoob.com/git/git-tutorial.html)\)

\[廖雪峰 git教程\]\([https://www.liaoxuefeng.com/wiki/896043488029600](https://www.liaoxuefeng.com/wiki/896043488029600)\)

## 二、git submodule

### 1. 如何理解git submodule <a id="&#x5982;&#x4F55;&#x7406;&#x89E3;git-submodule"></a>

git submodule相对于parent repo来说，依然是一个独立的git repo，完全不需要依赖于任何一个parent repo存在。git submodule和parent repo的关联主要是这两点：

* **路径** git submodule作为一个子目录组织在parent repo中，相当于把submodule repo关联了一个parent repo下的路径。
* **版本** parent repo里采用的git submodule哪一个版本，完全依赖于parent repo中记录submodule的一个COMMIT的SHA ID。换句话说，当我们在parent repo中commit一个submodule时，实际上我们只是commit了这个submodule当前所使用的COMMIT的SHA ID而已。

### 2. git submodule最须谨慎的地方 <a id="git-submodule&#x6700;&#x987B;&#x8C28;&#x614E;&#x7684;&#x5730;&#x65B9;"></a>

采用git submodule时，对submodule做一次修改，反映在parent repo上时，实际上对应着两次commit（push），首先是对submodule的，然后是对parent repo的。这样是很容易产生遗漏的。如果我们对submodule仅仅commit而没有push，那么在另外的地方pull下来的parent repo是无法正常使用的，因为parent对应的submodule的COMMIT SHA ID并不存在。

### 3. git submodule功能范例 <a id="git-submodule&#x529F;&#x80FD;&#x8303;&#x4F8B;"></a>

我们将统一的把parent git repo称作PARENT\_REPO，git submodule自己的repo叫做SUB\_REPO。

#### 增加一个submodule <a id="&#x589E;&#x52A0;&#x4E00;&#x4E2A;submodule"></a>

```bash
cd PARENT_REPO
git submodule add git@github.com:ni-ning/SUB_REPO.git ./SUB_REPO
git submodule update --init
git commit .gitmodules -m "Added submodule as ./SUB_REPO"
```

#### 更新全部的submodule <a id="&#x66F4;&#x65B0;&#x5168;&#x90E8;&#x7684;submodule"></a>

```bash
cd PARENT_REPO
git pull
git submodule update --init [--force]
```

如果需要覆盖submodule所映射到目录，需要指定 --force 参数。

### 4. 在submodule中进行修改

我们在SUB\_REPO进行一次修改，并且在parent repo中采用这个修改。

```bash
cd PARENT_REPO
cd SUB_REPO
git commit -m "changes in submodule"
git push
cd ..
git add SUB_REPO
git commit -m "adopt changes in submodule"
```

### 5. clone PARENT REPO时包括submodule

```bash
git clone --recursive git@github.com:ni-ning/PARENT_REPO.git
```

### 6. 删除submodule

```bash
git rm -f SUB_REPO
git commit -m "remove submodule"
```

除了上述操作外，还需要手动删除.git/config中，\[submodule "SUB\_MODULE"\]标签及其内容。

### 7. git submodule的建议工作流 <a id="git-submodule&#x7684;&#x5EFA;&#x8BAE;&#x5DE5;&#x4F5C;&#x6D41;"></a>

如果开发涉及子模块，那么我们建议以两种方式来管理工作流：

* 开发只涉及子模块的内部，无需修改parent repo，直接在子模块建立一个开发分支即可。在完成后修改merge回这个子模块的主分支。
* 需要从parent repo和这个submodule都建立一个新的分支出来，parent repo和submodule都在新建的分支上开发，在开发完成后首先commit submodule，再commit parent repo。比如

```bash
# 下面的例子中，主分支为master，涉及的submodule为user 
# 创建开发分支 
git submodule update -- user 
git checkout -b feature/abc_2019 
cd user 
git checkout -b feature/abc_2019  
# 开发完成 cd user 
git add ...
git commit ... && git push ... 
cd .. 
git add user 
git add ... # 主分支自己的其他修改 
git commit ...  
# 合并开发分支 
cd user 
git checkout master 
git merge feature/abc_2019; 
git commit ... 
git push ... 
cd .. 
git checkout master 
git merge feature/abc_2019 
git add user 
git commit ... 
git push ..
```



