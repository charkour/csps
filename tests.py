from aima_python import search

# Testing Search
try:
    problem = search.Problem()
except TypeError:
    print("0")

problem = search.Problem("initial")
assert problem.initial == "initial"
assert problem.goal == None
print("1")

try:
    problem.actions(None)
except NotImplementedError:
    print("2")

try:
    problem.result(None, None)
except NotImplementedError:
    print("3")

assert problem.goal_test(None)

problem.goal = 1
assert not problem.goal_test(None)
assert problem.goal_test(1)

problem.goal = [1, 2]
assert not problem.goal_test(None)
assert problem.goal_test(2)
print("4")

assert problem.path_cost(1, None, None, None) == 2
assert problem.path_cost(10, None, None, None) == 11
print("5")

try:
    problem.value(None)
except NotImplementedError:
    print("6")
