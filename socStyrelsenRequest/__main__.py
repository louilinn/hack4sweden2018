from socRequest import SocRequest

socRq1 = SocRequest()
socRq1.printHeader()
for i in range(2000, 2017):
    socRq1.printYearTotal(i)
