from socRequest import SocRequest
import timeit
start = timeit.timeit()
print(SocRequest().getDiagnoseJson('2026'))
end = timeit.timeit()
print("Runtime: ", end-start)
