# 抽象工厂模式

定义一个工厂类接口，让工厂子类来创建一系列相关或相互依赖的对象

{% hint style="info" %}
例如：成产一部手机，需要手机壳、CPU、操作系统三类对象进行组装，其中每类对象都有不同的种类。对每个具体工厂，分别生产一部手机所需要的三个对象。
{% endhint %}

相比工厂方法模式，抽象工厂模式中的每个具体工厂都生产一套产品

```python
from abc import ABCMeta, abstractmethod

# --- 抽象产品 ---
class PhoneShell(metaclass=ABCMeta):
    @abstractmethod
    def show_shell(self):
        pass

class CPU(metaclass=ABCMeta):
    @abstractmethod
    def show_cpu(self):
        pass

class OS(metaclass=ABCMeta):
    @abstractmethod
    def show_os(self):
        pass

# --- 抽象工厂 ---
class PhoneFactory(metaclass=ABCMeta):
    @abstractmethod
    def make_shell(self):
        pass

    @abstractmethod
    def make_cpu(self):
        pass

    @abstractmethod
    def make_os(self):
        pass

# --- 具体产品 ---
class SmallShell(PhoneShell):
    def show_shell(self):
        print('普通手机小手机壳')

class BigShell(PhoneShell):
    def show_shell(self):
        print('普通手机大手机壳')

class AppleShell(PhoneShell):
    def show_shell(self):
        print('苹果手机壳')

class SnapDragonCPU(CPU):
    def show_cpu(self):
        print('骁龙CPU')

class MediaTekCPU(CPU):
    def show_cpu(self):
        print('联发科CPU')

class AppleCPU(CPU):
    def show_cpu(self):
        print('评估CPU')

class Android(OS):
    def show_os(self):
        print('Android系统')

class IOS(OS):
    def show_os(self):
        print('IOS系统')

# --- 具体工厂 ---
class MiFactory(PhoneFactory):
    def make_cpu(self):
        return SnapDragonCPU()

    def make_os(self):
        return Android()

    def make_shell(self):
        return BigShell()

class HuaweiFactory(PhoneFactory):
    def make_cpu(self):
        return MediaTekCPU()

    def make_os(self):
        return Android()

    def make_shell(self):
        return SmallShell()

class IPhoneFactory(PhoneFactory):
    def make_cpu(self):
        return AppleCPU()

    def make_os(self):
        return IOS()

    def make_shell(self):
        return AppleCPU()

# --- 客户端 ---
class Phone(object):
    def __init__(self, cpu, os, shell):
        self.cpu = cpu
        self.os = os
        self.shell = shell

    def show_info(self):
        print('手机信息：')
        self.cpu.show_cpu()
        self.os.show_os()
        self.shell.show_shell()

def make_phone(factory):
    cpu = factory.make_cpu()
    os = factory.make_os()
    shell = factory.make_shell()
    return Phone(cpu, os, shell)

p1 = make_phone(MiFactory())
p1.show_info()
```

**优点：**

* 将客户端与类的具体实现相分离
* 每个工厂创建了一个完整的产品系列，使得易于交换产品系列
* 有利于产品的一致性\(即产品之间的约束关系\)

**缺点:**

* 难以支持新种类的\(抽象\)产品

