from socRequest import SocRequest
import timeit
start = timeit.timeit()
print(SocRequest().getSuicideJson())
end = timeit.timeit()
print("Runtime: ", end-start)
