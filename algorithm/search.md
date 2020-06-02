# 查找

在一些数据元素中，通过一定的方法找出与给定关键字相同的的数据元素的过程

列表查找(线性表查找)：从列表中查找指定元素

- 输入：列表，待查找元素
- 输出：元素下标(未找到时 None或-1)

顺序查找：从头找到尾


二分查找：有序列表，折半查找

```
def linear_search(li, value):
    for index, v in enumerate(li):
        if v == value:
            return index

    else:
        return -1


def binary_search(li, value):
    left, right = 0, len(li) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if li[mid] == value:
            return mid
        elif li[mid] > value:
            right = mid -1
        elif li[mid] < value:
            left = mid + 1
    else:
        return -1
```