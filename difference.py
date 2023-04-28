# import diffoscope
import diffoscope.comparators

print('Diffoscoping')
# path to the first repository
repo1_path = ""

# path to the second repository
repo2_path = ""

# generate a diffoscope report for the two repositories
diffoscope_report = diffoscope.comparators.compare(repo1_path, repo2_path)

# print the diffoscope report
print(diffoscope_report)
