# setuptools

setuptools 是 python内置distutils的加强版，可以更好地创建和分发python包，尤其是解决了包之间的依赖关系

### 项目程序结构

开源项目最外层为项目名称，如最外层的nining，其中包含核心源码程序包nining和安装文件setup.py

```python
nining
  |- nining
       |-__init__.py
       |-contrib
           |-__init__.py
           |-thrid.py
       |-app.py
       |-constant.py
       |-errors.py
       |-logs.py
  |- setup.py
```

### 使用安装文件创建 wheel

#### Source distribution

使用sdist可以大包成source distribution，支持的压缩格式有.tar.gz和.zip

```bash
python setup.py sdist --formats=gztar,zip
```

现在目录下多出dist和\*.egg-info目录

* dist内保存了打好的源码包，名为为setup.py中定义的name,version以及指定的包格式，如nining-0.0.1.tar.gz
* --formats指定打出.tar.gz和.zip包

#### Built distribution

使用bdist可以打出built distribution, 和源码包相比，由于预先构建好，所以安装更快

wheel也是一种built包，而且是官方推荐的打包方式

```bash
pip install wheel
python setup.py bdist_wheel

python setup.py bdist_wininst  # windows exe 格式
```

执行成功后，目录下除了dist和\*.egg-info目录外，还有一个build目录用于存储打包中间数据。wheel包的名称为 nining-0.0.1-py3-none-any.whl，其中py3指明只支持python3

### 安装 wheel

使用bdist\_wheel打包后，可以使用pip安装到本地python的site-packages目录

```bash
pip install dist/nining-0.0.1-py3-none-any.whl
```

可以和其他使用的pip安装第三库一样使用

```python
from nining.app import func

func()
```

应用开发过程中会频繁变更，每次安装都需要先卸载旧版本很麻烦。使用develop开发模式安装的话，实际代码不会拷贝到site-packages下，而是除了一个指向当前应用的链接\(\*.egg-link\)，这样当前位置源码改动就会马上反映到site-packages

```bash
pip install -e . # 或者 python setup.py develop
```

### 上传wheel到pypi

wheel包可以自己使用和传输给其他人使用，但是维护更新不方便，而pypi作为python的软件仓库，让所有人可以方便的上传和下载，以及管理第三方库

* 登录 [https://pypi.org/](https://pypi.org/)，注册账号
* pip install twine，因setup.py upload 只支持http上传包到pypi，由twine取代
* twine upload dist/\*
* 输入username和password即上传至pypi，如果不想每次输入账号，可在家目录下创建.pypirc

```text
[distutils]
index-servers =
pypi

[pypi]
repository: https://upload.pypi.org/legacy/
username: ***
password: ***
```

### setup\(\) 参数

#### name

项目名，也是最终在pypi上搜索的名称，如name='nining'

#### version

项目版本，一般由major,minor,maintence组成，如version='0.0.1'

#### packages

列出项目内需要被打包的所有package，一般用setuptools.find\_packages\(\)自动发现

```text
packages=find_packages(exclude=['docs', 'tests*'])
```

#### description

项目的简短描述，会显示在pypi名字下面，如description='First process about setuptools'

对项目的完整描述，使用long\_description，如果此字符串是rst格式的，pypi自动渲染成html显示

#### url

通常为github的链接或readthedocs链接

#### author

作者信息

```text
author='nining'
author_email='nining1314@gmail.com'
```

#### license

项目许可证，如license='MIT', 更多可参考[https://choosealicense.com/](https://choosealicense.com/)

#### classifiers

项目分类，完整可参考[https://pypi.org/pypi?%3Aaction=list\_classifiers](https://pypi.org/pypi?%3Aaction=list_classifiers)

### 其他初始化文件

在阅读github上的python库时，除了最基本核心的setup.py文件和主程序之外，还有其他一些文件

#### setup.cfg

包含构建时的一些默认参数

```text
[bdist_wheel]
universal=1
```

用于在使用 bdist\_wheel 的时候的默认设置 --universal 参数

#### README.rst/README.md

项目说明文档，使用[reStructureText](http://docutils.sourceforge.net/rst.html)可以在pypi上很好的渲染

#### MANIFEST.in

此文件在打源码包的时候告诉setuptools还需要打包哪些文件

#### LICENSE

项目许可说明文件

### 参考链接

* [源文链接](https://blog.csdn.net/chenfeidi1/article/details/80873979#%E5%88%86%E5%8F%91%E5%B7%A5%E5%85%B7-setuptools)
* [在pypi上发布python包详细教程](http://www.mamicode.com/info-detail-2484744.html)

