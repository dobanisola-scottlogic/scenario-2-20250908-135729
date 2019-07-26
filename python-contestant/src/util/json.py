import json
import re
from dataclasses import asdict
from enum import Enum
from typing import Callable

camel_pat = re.compile(r'([A-Z])')
under_pat = re.compile(r'_([a-z])')


def camel_to_underscore(name: str) -> str:
    return camel_pat.sub(lambda x: '_' + x.group(1).lower(), name)


def underscore_to_camel(name: str) -> str:
    return under_pat.sub(lambda x: x.group(1).upper(), name)


def change_dict_naming_convention(dictionary: dict, case_convert_function: Callable[[str], str]):
    new_dictionary = {}
    for key, value in dictionary.items():
        new_value = value
        if isinstance(value, dict):
            new_value = change_dict_naming_convention(value, case_convert_function)
        elif isinstance(value, list):
            new_value = list()
            for x in value:
                new_value.append(change_dict_naming_convention(x, case_convert_function))
        elif isinstance(value, Enum):
            new_value = value.value
        new_dictionary[case_convert_function(key)] = new_value
    return new_dictionary


def loads(json_input: str) -> dict:
    json_obj = json.loads(json_input)
    return change_dict_naming_convention(json_obj, camel_to_underscore)


def dumps(obj) -> str:
    if isinstance(obj, list):
        obj_dict = [change_dict_naming_convention(asdict(o), underscore_to_camel) for o in obj]
    else:
        obj_dict = change_dict_naming_convention(asdict(obj), underscore_to_camel)
    return json.dumps(obj_dict)
