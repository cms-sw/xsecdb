import json

class Record(object):
    def __init__(self, data, valid_from, valid_to, is_valid):
        self.process_name = data['process_name']
        self.cross_section = data['cross_section']
        self.total_uncertainty = data['total_uncertainty']
        self.other_uncertainty = data['other_uncertainty']
        self.cuts = data['cuts']
        self.energy = data['energy']
        self.kFactor = data['kFactor']
        self.reweighting = data['reweighting']
        self.shower = data['shower']
        self.matrix_generator = data['matrix_generator']
        self.contact = data['contact']
        self.DAS = data['DAS']
        self.MCM = data['MCM']
        self.refs = data['refs']
        self.accuracy = data['accuracy']
        self.validFrom = valid_from
        self.validTo = valid_to
        self.isValid = is_valid
        self.equivalent_lumi = data['equivalent_lumi']
        self.fraction_negative_weight = data['fraction_negative_weight']

    def json(self):
        return json.dumps(self.__dict__)