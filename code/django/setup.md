# 01 软件打包与部署

### 打包与部署

**开发者**把代码，经过**分发服务**，部署到**生产服务**器

* docker
* zip
* git
* setup.py

### setup.py 打包

distuils是标准库中负责建立Python第三方库的安装器，对于简单的分发很有用，但功能缺少。 _**setuptools**_是distuitls增强版, 不包括在标准库中, 是一个优秀的, 可靠的Python包安装与分发工具

**本地开发者  -- 打包上传pypi服务器 -- 使用者直接 pip install &lt;package&gt;**

```python
# 1. 在用户目录下创建.pypirc文件。
# 添加权限：chmod 600 ~/.pypirc
[distutils]
index-servers = pypi

[pypi]
repository=https://upload.pypi.org/legacy/
username=******
password=******

# 2. 安装twine
pip install twine
# 3. 在项目根目录执行
python setup.py sdist bdist_wheel
# 4. 上传打包文件
twine upload dist/*
```

### setup.py 常用配置

详细说明参考[官文文档](https://setuptools.readthedocs.io/en/stable/setuptools.html#developer-s-guide)

PS：被忽视的攻击面：Python package 钓鱼，[https://paper.seebug.org/326/](https://paper.seebug.org/326/)

