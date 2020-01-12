# 02 python调试工具 pdb

### pdb - The Python Debugger

print --&gt; Python 自带的Debug工具：pdb

*  **非侵入式方法**（不用额外修改源代码，在命令行下直接运行就能调试）

```python
python -m pdb filename.py
```

*  **侵入式方法**（需要在被调试的代码中添加一行代码然后再正常运行代码

```python
import pdb; pdb.set_trace()
```

当你在命令行看到下面这个提示符时，说明已经正确打开了pdb

```python
(Pdb) h or help command

l(ist) [first [,last] | .]    # List source code for the current file.
ll     # List the whole source code for the current funtion or frame.

b/tbreak/cl     # 添加/临时/清除断点

p expression    # Print the value of the expression   

 # 逐行调试命令 - 执行下一行
 s    # 能够进入函数体
 n    # 不会进入函数体
 r    # 在函数中时会直接执行到函数返回处
 
 # 非逐行调试命令
 c    # 持续执行下去，直到遇到一个断点
 unt lineno  # 持续执行直到运行到指定行(或遇到断点)
 j lineno    # 直接跳转到指定行(注意，被跳过的代码不执行)
 
 
 a    # 在函数中时打印函数的参数和参数的值
 whatis expression    # 打印表达式的类型，常用来打印变量值
 interact             # 启动交互式解释器
 w     # 打印堆栈信息
 
 enter # 执行最近命令
```

PS：pip install [ipdb](https://xmfbit.github.io/2017/08/21/debugging-with-ipdb/)，基于ipython的pdb，带颜色

