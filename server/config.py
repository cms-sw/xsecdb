import ConfigParser
import os
import json

class UpdatableStruct():
    def _update(self, **entries):
        self.__dict__.update(entries)

app_dir = os.path.dirname(__file__)

conf_dict = {}
cfg_parser = ConfigParser.RawConfigParser()
a = cfg_parser.read(app_dir + "/config.cfg")

for option in cfg_parser.options("strings"):
    conf_dict[option.upper()] = cfg_parser.get("strings", option)
for item in cfg_parser.items("lists"):
    conf_dict[item[0].upper()] = json.loads(item[1])

CONFIG = UpdatableStruct()
CONFIG._update(**conf_dict)
