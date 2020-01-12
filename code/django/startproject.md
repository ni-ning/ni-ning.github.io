# 03 创建一个django项目

### 源码分析

`django-admin startproject project1`执行的主干逻辑代码

```python
# django/bin/django-admin.py
from django.core import management
if __name__ == '__main__':
    management.execute_from_command_line()


# django/core/management/__init__.py
@functools.lru_cache(maxsize=None)    # 函数级别缓存， 666
def get_commands():
    commands = {name: 'django.core' for name in find_commands(__path__[0])}
    return commands

def load_command_class(app_name, name):
    # 如何根据动态的名字字符串拼接导入路径，import_module
    module = import_module('%s.management.commands.%s' % (app_name, name))
    return module.Command()

class ManagementUtility:
    def __init__(self, argv=None):
        self.argv = argv or sys.argv[:]
    def fetch_command(self, subcommand):
        commands = get_commands()
        app_name = commands[subcommand]    # 'djanog.core'
        klass = load_command_class(app_name, subcommand)    # 'startproject'
        return klass
    def execute(self):
        subcommand = self.argv[1]    # startproject
        self.fetch_command(subcommand).run_from_argv(self.argv)

def execute_from_command_line(argv=None):
    utility = ManagementUtility(argv)
    utility.execute()
    

# django/core/management/commands/startproject.py
class Command(TemplateCommand):
    def handle(self, **options):
        project_name = options.pop('name')
        target = options.pop('directory')
        options['secret_key'] = get_random_secret_key()
        super().handle('project', project_name, target, **options)
# django/core/management/templates.py
class TemplateCommand(BaseCommand):
    def handle(self, app_or_project, name, target=None, **options):
        '''模板文件拷贝'''
# django/core/management/base.py
class BaseCommand:
    def run_from_argv(self, argv)
        self.execute(*args, **cmd_options)
    def execute(self, *args, **options):
        output = self.handle(*args, **options)
        return output
    def handle(self, *args, **options):
        raise NotImplementedError()
```

### 总结经验

* 对外提供接口，适合以函数方式实现，execute\_from\_command\_line
* class ManagementUtility: 适合处理解析参数，分发处理
* 结合目录 commands，实现动态导入
* BaseCommand - TemplateCommand - Comand，典型的接口-实现模式

