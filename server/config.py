import ConfigParser
import os

class UpdatableStruct():
    def _update(self, **entries):
        self.__dict__.update(entries)

app_dir = os.path.dirname(__file__)

conf_dict = {}
cfg_parser = ConfigParser.RawConfigParser()
a = cfg_parser.read(app_dir + "/config.cfg")

for option in cfg_parser.options("strings"):
    conf_dict[option.upper()] = cfg_parser.get("strings", option)

CONFIG = UpdatableStruct()
CONFIG._update(**conf_dict)
