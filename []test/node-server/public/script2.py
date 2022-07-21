import sys

out = "Hello {param1}!".format(param1=sys.argv[1])
print(out)

sys.stdout.flush()