# GitHub

### 1. GitHub简介

GitHub面向开源及私有软件项目的托管平台，只支持git作为版本库格式托管

* Git代码仓库托管
* Web管理界面
* 社交

### 2.  从远程拉代码

```bash
# HTTPS方式需要用户名密码
# SSH方式需要公私钥验证
cd repo
git clone git@github.com:ni-ning/repo.git
```

一些注意事项

* `git pull origin xxx_branch`相当于做了两件事，即`git fetch;git merge origin/xxx_branch`
*  分支`origin/xxx_branch`是本地代码库中保留一份远端分支的copy，在第一次执行`origin/xxx_branch`时，会在本地代码库中创建一个对应`xxx_branch`的分支，执行`git fetch`相当于在更新`origin/xxx_branch`这个分支的内容，执行`git pull`时，是把`origin/xxx_branch`这个分支merge到`xxx_branch`

### 3. 从本地推代码

```bash
# 本地仅仅系统目录 repo repo/README.md
cd repo
git init
git add README.md
git commit -m 'first commit'
git remote add origin git@github.com:ni-ning/repo.git
git push -u origin master

# 已经git初始化后的工作目录 repo，即存在.git目录
cd repo
git remote add origin git@github.com:ni-ning/repo.git
git push -u origin master

# 查看工作目录远程版本库
git remote -v

# 添加第二个远程库 gitee
git remote add gitee git@gitee.com:nining1314/repo.git
git push -u gitee master

# git push -u
-u 表示以后可以用 git push 代替 git push gitee master
```



