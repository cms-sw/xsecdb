import argparse
from  wrapper.request_wrapper import RequestWrapper

xsdb_req = RequestWrapper()

parser = argparse.ArgumentParser(description='Insert new xsdb record')

parser.add_argument('--process', dest='process_name',
                    help='process_name field')

parser.add_argument('--is_valid', dest='isValid',
                    help='isValid field')

parser.add_argument('--xs', dest='cross_section', required=True,
                    help='cross_section value')

parser.add_argument('--tot_unc', dest='total_uncertainty', required=True,
                    help='total_uncertainty')

parser.add_argument('--oth_unc', dest='other_uncertainty',
                    help='other_uncertainty')

parser.add_argument('--accur', dest='accuracy', required=True,
                    help='accuracy')

parser.add_argument('--contact', dest='contact',
                    help='contact')

parser.add_argument('--das', dest='DAS', required=True,
                    help='DAS url')

parser.add_argument('--mcm', dest='MCM', required=True,
                    help='MCM url')

parser.add_argument('--eq_lumi', dest='equivalent_lumi',
                    help='equivalent_lumi')

parser.add_argument('--frac_neg_w', dest='fraction_negative_weight',
                    help='fraction_negative_weight')

parser.add_argument('--rewgh', dest='reweighting',
                    help='reweighting')

parser.add_argument('--cuts', dest='cuts',
                    help='cuts')

parser.add_argument('--shower', dest='shower', required=True,
                    help='shower')

parser.add_argument('--mtrx_gen', dest='matrix_generator',
                    help='matrix_generator')

parser.add_argument('--energy', dest='energy', required=True,
                    help='energy')

parser.add_argument('--comments', dest='comments',
                    help='comments')

parser.add_argument('--refs', dest='refs',
                    help='refs')

parser.add_argument('--discussion', dest='discussion',
                    help='discussion')

args = parser.parse_args()
args_dict = vars(args)
request_dict = dict((key, value) for key, value in args_dict.items() if value is not None)

xsdb_req.insert(keyval_dict=request_dict)