# 钩子编程 hooks.py



```python
# hooks.py
HOOKS = ['response']

def default_hooks():
    return {event: [] for event in HOOKS}

def dispatch_hook(key, hooks, hook_data, **kwargs):
    hooks = hooks or {}
    hooks = hooks.get(key)
    if hooks:
        if hasattr(hooks, '__call__'):
            hooks = [hooks]
        for hook in hooks:
            _hook_data = hook(hook_data, **kwargs)
            if _hook_data is not None:
                hook_data = _hook_data
    return hook_data

# models.py
class RequestHooksMixin(object):
    def register_hook(self, event, hook):
        if event not in self.hooks:
            raise ValueError('Unsupported event specified, with event name "%s"' % (event))
        if isinstance(hook, Callable):
            self.hooks[event].append(hook)
        elif hasattr(hook, '__iter__'):
            self.hooks[event].extend(h for h in hook if isinstance(h, Callable))

    def deregister_hook(self, event, hook):
        try:
            self.hooks[event].remove(hook)
            return True
        except ValueError:
            return False

class PreparedRequest(RequestHooksMixin):
    def __init__(self):
        self.hooks = default_hooks()
        
    def prepare(self, hooks=None):
        self.prepare_hooks(hooks)


# sessions.py 
# 默认hooks
self.hooks = default_hooks()
# 默认hooks + 定义Session时传入的hooks，如{'response': []}
hooks=merge_hooks(request.hooks, self.hooks)

r = adapter.send(request, **kwargs)
r = dispatch_hook('response', hooks, r, **kwargs)
```

