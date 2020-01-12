# django源码精读

### django 功能概览

* 英文官文文档  [https://docs.djangoproject.com/en/2.2/](https://docs.djangoproject.com/en/2.2/)
* 坚持英文阅读，前提是有英文阅读的感觉，可以从读一本英文小说，或[像这样](../../enterprise-tools/ubuntu.md)开始

#### 一次请求来看django

![](../../../.gitbook/assets/django.png)

快速入门：[https://docs.djangoproject.com/en/2.2/intro/](https://docs.djangoproject.com/en/2.2/intro/)，老老实实来一遍

### 搭建源码阅读环境

#### 版本控制

* 语义化版本  [https://semver.org/lang/zh-CN/](https://semver.org/lang/zh-CN/)  
* 官文版本说明  [https://docs.djangoproject.com/en/2.2/internals/release-process/](https://docs.djangoproject.com/en/2.2/internals/release-process/)   
* Example: 2.0.x, 2.1.x, **2.2\(LTS\)**, 3.0.x, 3.1.x, **3.2\(LTS\)**, etc.
* Feature 淘汰策略   如何根据当前判断号判断，升级是否有影响 python -Wd
* 开源项目 发版计划周期 [https://code.djangoproject.com/wiki/Version1.11Roadmap](https://code.djangoproject.com/wiki/Version1.11Roadmap)

#### 可调试的环境

* 版本选择 Django 2.2.4 \(2019-09-02 开学季\)
* 加注释的源码  [https://github.com/ni-ning/django/tree/source-comment](https://github.com/ni-ning/django/tree/source-comment)
* Winows 10 + Pycharm 2017.2.4 + Python 3.6.3

Windows系统下搭建虚拟环境

```bash
pip install virtualenv
pip install virtualenvwrapper   # 这是对virtualenv的封装版本，一定要在virtualenv后安装
  
virtualenv -p python django-inside-dev  # 创建名字为django-inside-dev的虚拟环境

cd djanog-inside-dev
cd Scripts    # 或 C:\virtualenv\django-inside-dev\Scripts\ 加入环境变量
activate  # 启动虚拟环境
deactive  # 退出虚拟环境

cd C:\virtualenv
# fork一下官方源码djagno
git clone --branch 2.2.4 git@github.com:ni-ning/django.git
git checkout -b resource-comment
git add .
git commit -m 'first step to read django code'

# 虚拟环境下源码安装
python setup.py install

# Pycharm 配置选择该虚拟环境下的Python解释器
# 打开Pycharm的Terminal自动进入activate环境
```

Pycharm打开虚拟环境django-inside-dev/site-packages的django源码，在Pycharm的命令行模式可以随时修改随时调试，爽歪歪

![](../../../.gitbook/assets/image%20%2821%29.png)

### 源码结构概况

#### 项目结构

开源项目最外层项目包括：测试tests，发布setup.py，文档docs，以及核心源码结构django

#### 结构源码

```python
django/django
- apps    # class AppConfig / class Apps
- bin     # django-admin -> management.execute_from_command_line()
- conf    # global_settings.py
- contrib
    |- admin    # resister
    |- auth     # authenticate,login,logout,get_user_model,get_user
    |- sessions # Session
- core
    |- cache
    |- mail
    |- serializers
- db
  |- models    # class Signal
- forms
- http         # HttpRequest, HttpResponse, Http404, SimpleCookie
- middleware
- template
- templatetags
- test
- urls        # path, re_path, include
- utils
- views
- shortcuts.py
```

