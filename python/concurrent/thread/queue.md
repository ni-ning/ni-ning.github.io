# 线程队列queue

#### 线程queue

线程queue可以保证多线程之间共享数据，并且自动加锁

```python
import queue

# 先进先出：队列
q1 = queue.Queue(3)
q1.put([1, 2, 3])
q1.put('string')
q1.put({'user': 'Linda', 'password': 123456})
# q1.put('ddd')                 # block=True
# q1.put('ddd', block=False)      # raise queue.Full
# q1.put('ddd', block=True, timeout=3)    # # raise queue.Full

print(q1.get())
print(q1.get())
print(q1.get())
# print(q1.get(block=False))      # queue.Empty
# print(q1.get_nowait())          # queue.Empty
# print(q1.get(block=True, timeout=3))    # queue.Empty

# 后进先出：堆栈
q2 = queue.LifoQueue(3)
q2.put([1, 2, 3])
q2.put('string')
q2.put({'user': 'Linda', 'password': 123456})
print(q2.get())
print(q2.get())
print(q2.get())

# 优先级队列：输入元祖，数字越小，优先级越高，越先出
q3 = queue.PriorityQueue()
q3.put((10, 'one'))
q3.put((30, 'two'))
q3.put((20, 'three'))
print(q3.get())
print(q3.get())
print(q3.get())
```

