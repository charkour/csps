from tools.aima.csp import backtracking_search, CSP
import itertools


def get_neighbors(vars_list):
    """Return a dict of neighbors, where for each class a
    list of all other classes are presented"""
    res = {}
    for variable in vars_list:
        res[variable] = [neighbor for neighbor in vars_list if neighbor != variable]
    return res


def respect_assignments(a_class, possible_value_tuples, assignments):
    """Limit the domain for a class to only consist of possible
    (time, room, faculty) combinations where faculty is the same
    on the assignment"""
    prof = assignments[a_class]
    limited_domain = [value for value in possible_value_tuples if value[2] == prof]

    return a_class, limited_domain


def constraints(class1, c1, class2, c2):
    """Constraints for class scheduling
    c1 and c2 are tuples in the form (time, room, faculty)
    returns true if constraints are met.
    The constraint that there is only one section of class
    is implicit because classes are variables.
    """
    # Return true if same class.
    if class1 == class2:
        return True

    # check to make sure faculty is not teaching at the same time
    if c1[0] == c2[0] and c1[2] == c2[2]:
        return False

    # Check to make sure class is not in the same room at the same time
    if c1[0] == c2[0] and c1[1] == c2[1]:
        return False
    return True


# problem variables
variables = classes = ["cs100a", "cs104a", "cs104b", "cs104c", "cs106a", "cs108a", "cs108b", "cs112a", "cs112b",
                       "cs195a",
                       "cs212a", "cs212b", "cs214", "cs262", "cs232", "cs344"]

# each variable and their neighbors
neighbors = get_neighbors(variables)

# attributes for constraint problem
attributes = {
    "faculty": ["meyer", "schuurman", "arnold", "adams", "plantinga", "vanderlinden", "norman"],
    "assignments": {"cs100a": "meyer", "cs104a": "schuurman", "cs104b": "schuurman", "cs104c": "schuurman",
                    "cs106a": "norman", "cs108a": "vanderlinden", "cs108b": "arnold", "cs112a": "adams",
                    "cs112b": "adams", "cs195a": "schuurman", "cs212a": "plantinga", "cs212b": "plantinga",
                    "cs214": "adams",
                    "cs232": "norman", "cs262": "vanderlinden", "cs344": "vanderlinden"},
    "time": ["mwf800", "mwf900", "mwf1030", "mwf1130", "mwf1230", "tth830", "tth1030"],
    "room": ["nh253", "sb382", "sb010", "sb354"]
}

# create list of lists and make a cartesian product of them
attribute_list = [attributes["time"], attributes["room"],
                  attributes["faculty"]]
possible_values = list(itertools.product(*attribute_list))

# get all possible domains
domains = dict(map(lambda a_class: respect_assignments(a_class, possible_values, attributes["assignments"]), classes))

# Setup problem
problem = CSP(variables, domains, neighbors, constraints)
solution = backtracking_search(problem)

# print result
print('Variables: ' + str(variables))
print('Domains: ' + str(domains))
print('Neighbors: ' + str(neighbors))
if solution is not None and problem.goal_test(solution):
    print('Solution:')
    print(solution)
else:
    print('Failed - domains: ' + str(problem.curr_domains))
    problem.display(problem.infer_assignment())
