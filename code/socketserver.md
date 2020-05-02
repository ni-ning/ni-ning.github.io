# socketserver

socket编写简单的网络程序很方便，但复杂一点的网络程序还是用现成的框架比较好

* 专心事务逻辑，而不是套接字的各种细节
* socketserver模块简化了编写网络服务程序的任务
* socketserver模块也是python标准库中很多服务器框架的基础

### socketserver基本使用

```python
# 支持并发的server.py
import socketserver
'''
网络通信必备步骤：
1. 需要初始化逻辑
tcp_socket_server = socket()
tcp_socket_server.bind(ip_port)
tcp_socket_server.listen(5)
2. 建立连接逻辑
tcp_socket_server.accept()
3. 收发数据逻辑
conn.recv(1024) conn.send(bytes)
'''
IP_PORT = ('127.0.0.1', 8888)

class MyServer(socketserver.BaseRequestHandler):
    def handle(self):
        '''
        并发的业务逻辑, recv和send操作
        '''
        while True:
            # 此while循环实现持续聊天
            client_data = self.request.recv(1024)
            if client_data.decode('utf-8') == 'exit':
                print('客户端断开连接，等待新用户连接....')
                break
            print('客户端发送来的数据: %s' % str(client_data, 'utf-8'))
            response = input('返回响应数据>: ').strip()
            self.request.sendall(bytes(response, 'utf-8'))
        self.request.conn.close()

server = socketserver.ThreadingTCPServer(IP_PORT, MyServer)
server.serve_forever()
'''
socketserver使用模式：
1. 功能类
    class MyServer(socketserver.BaseRequestHandler):
        def handle(self): 
2. server = socketserver.ThreadingTCPServer(IP_PORT, MyServer)
3. server.serve_forever()
'''

# client.py
import socket
ip_port = ('127.0.0.1', 8888)
sock = socket.socket()
sock.connect(ip_port)
print('客户端启动...')
while True:
    inp = input('输入发送数据 >>: ').strip()
    sock.sendall(bytes(inp, 'utf-8'))
    if inp == 'exit':
        break
    server_response = sock.recv(1024)
    print('服务端响应数据： %s' % str(server_response, 'utf-8'))
sock.close()
```

### 源码分析

socketserver模块可以简化网络服务器的编写，Python把网络服务抽象成两个主要的类，一个是Server类，用于处理连接相关的网络操作，另外一个则是RequestHandler类，用于处理数据相关的操作。并且提供两个MixIn 类，用于扩展 Server，实现多进程或多线程

