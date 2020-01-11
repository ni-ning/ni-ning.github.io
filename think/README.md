# 设计模式

### 设计模式

对**软件设计**中普遍存在\(反复出现\)的各种问题，所提出的解决方案。每一个设计模式系统的命名、解释和评价了面向对象系统中一个重要的和重复出现的设计。

* "四人帮" \(Gang of Four, GoF\) 
* &lt;&lt;设计模式: 可复用面向对象软件的基础&gt;&gt;

### 面向对象

设计模式是面向对象的设计

**封装**

* 把属性和方法封装到类里，体现出类里面和类外面
* Python 私有 \_\_  \_类里能访问，类外不能访问概念

**继承**

* 类之间的复用代码

**多态**

* Python是多态语言，程序员可不用多关注

### 接口

接口：若干抽象方法的集合

作用：限制实现接口的类必须按照接口给定的调用方式实现这些方法；使用者通过了解接口就可以明白实现类的使用方式

```python
class Payment(object):
    def pay(self, money):
        raise NotImplementedError

class AliPay(Payment):
    pass

class WechatPay(Payment):
    def pay(self, money):
        pass

a = AliPay()
# a.pay(1000)    # 不调用，不抛出异常

w = WechatPay()
w.pay(1000)      # 已实现，调用不抛出异常
```

```python
from abc import ABCMeta, abstractmethod

class Payment(metaclass=ABCMeta):
    @abstractmethod
    def pay(self, money):
        pass

class AliPay(Payment):
    pass

a = AliPay()    # AliPay必须实现抽象方法，否则会抛出异常
```

### 面向对象设计原则

SOLID原则

* 开放封闭原则：一个软件实体如类、模块和函数应该对扩展开放，对修改关闭。即软件实体尽量在不修改原有代码的情况下进行扩展；
* 里式替换原则：所有引用父类的地方必须能透明地使用其子类的对象；
* 依赖倒置原则：高层模块不应该依赖底层模块，二者都应该依赖其抽象；抽象不应该依赖细节；细节应该依赖抽象。换言之，要针对接口编程，而不是针对实现编程；
* 接口隔离原则：使用多个专门的接口，而不使用单一的总接口，即客户端不应该依赖那些它不需要的接口；
* 单一职责原则：不要存在多于一个导致类变更的原因。通俗的说，即一个类只负责一项职责

### 设计模式分类

* 创建型模式：怎样创建对象，目的隐藏底层逻辑
* 结构型模式：几个类之间协同工作
* 行为型模式：侧重方法

