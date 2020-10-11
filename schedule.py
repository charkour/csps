from csp import backtracking_search, CSP
import itertools

# create list of variables,
classes = ["cs108", "cs112", "cs212", "cs214", "cs262", "cs232"]

# each variable and their neighbors
neighbors = {
    "cs108": ["cs112", "cs212", "cs214", "cs262", "cs232"],
    "cs112": ["cs108", "cs212", "cs214", "cs262", "cs232"],
    "cs212": ["cs108", "cs112", "cs214", "cs262", "cs232"],
    "cs214": ["cs108", "cs112", "cs212", "cs262", "cs232"],
    "cs262": ["cs108", "cs112", "cs212", "cs214", "cs232"],
    "cs232": ["cs108", "cs112", "cs212", "cs214", "cs262"]
}

attributes = {
    "faculty": ["schuurman", "adams", "vanderlinden", "norman"],
    "time": ["mwf900", "mwf1030", "mwf1130", "tth1030"],
    "room": ["nh253", "sb382"]
}

# referenced for itertools: https://stackoverflow.com/questions/798854/all-combinations-of-a-list-of-lists
attribute_list = [attributes["time"], attributes["room"], attributes["faculty"]]
possible_values = list(itertools.product(*attribute_list))

# referenced for function mapping: https://www.geeksforgeeks.org/python-map-function/
domains = dict(map(lambda aClass: (aClass, possible_values[:]), classes))


def constraints(Class1, c1, Class2, c2):
    """Constraints for class scheduling
    c1 and c2 are tuples in the form (time, room, faculty)
    returns true if constraints are met.
    The constraint that there is only one section of class
    is implicit because classes are variables.
    """
    # Return true if same class.
    if Class1 == Class2:
        return True

    # check to make sure faculty is not teaching at the same time
    if c1[0] == c2[0] and c1[2] == c2[2]:
        return False

    # Check to make sure class is not in the same room at the same time
    if c1[0] == c2[0] and c1[1] == c2[1]:
        return False
    return True


# Setup problem
problem = CSP(classes, domains, neighbors, constraints)

solution = backtracking_search(problem)

# Adapted from u03constraint/queens.py
if solution is not None and problem.goal_test(solution):
    print('Solution:')
    print(solution)
else:
    print('Failed - domains: ' + str(problem.curr_domains))
    problem.display(problem.infer_assignment())