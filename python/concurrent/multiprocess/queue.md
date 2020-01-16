# 队列

内存中共享数据块+自动实现锁机制

```python
from multiprocessing import Queue

# 队列中不应该放大文件，而是精简的小文件
# 队列用的是内存中数据，size不可能无限大
q = Queue(3)

q.put('hello')
q.put({'key': 'value'})
q.put([1, 2, 3])
print(q.full())
```

