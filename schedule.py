from tools.aima.csp import backtracking_search, CSP
import itertools


def get_variables(assignments):
    return list(assignments.keys())


def get_faculty(assignments):
    """From https://thispointer.com/python-how-to-create-a-list-of-all-the-values-in-a-dictionary/"""
    unique_values = []

    for x in assignments.values():
        if x not in unique_values:
            unique_values.append(x)
    return unique_values


def get_neighbors(vars_list):
    """Return a dict of neighbors, where for each class a
    list of all other classes are presented"""
    res = {}
    for variable in vars_list:
        res[variable] = [neighbor for neighbor in vars_list if neighbor != variable]
    return res
# TODO: add the room constraints. i.e. labs only go in labs


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
        # print("faculty conflict")
        return False
    # print(c1[0], c2[0], c1[2], c2[2])

    # Check to make sure class is not in the same room at the same time
    if c1[0] == c2[0] and c1[1] == c2[1]:
        # print("class conflict")
        return False
    return True


user_constraints = {"cs100a": "meyer", "cs104a": "schuurman", "cs104b": "schuurman", "cs104c": "schuurman",
                    "lcs104a": "sykes", "lcs104b": "schuurman", "lcs104c": "sykes", "lcs104d": "schuurman",

                    "lcs104e": "sykes",
                    "cs106a": "norman",
                    "lcs106a": "norman",
                    "cs108a": "vanderlinden",
                    "cs108b": "arnold", "lcs108a": "wieringa", "lcs108b": "arnold", "cs112a": "adams",
                    "cs112b": "adams", "lcs112a": "norman", "lcs112b": "wieringa", "cs195a": "norman",
                    "cs212a": "plantinga", "cs212b": "plantinga", "cs214a": "adams", "cs214b": "adams",
                    "lcs214a": "meyer", "lcs214b": "meyer", "cs232a": "norman", "cs232b": "norman",
                    "cs262a": "vanderlinden", "cs262b": "vanderlinden", "lcs262a": "vanderlinden",
                    "lcs262b": "vanderlinden", "cs295a": "norman", "cs300a": "schuurman", "lcs300a": "schuurman",
                    "cs332a": "norman",
                    "cs336a": "norman",
                    "cs342a": "bailey",
                    "cs344a": "vanderlinden",
                    "cs364a": "vedra",
                    "cs374a": "adams",
                    "cs383a": "bailey",
                    "cs384a": "schuurman",
                    "cs384b": "schuurman",
                    # NOTE: skip cs390
                    "cs394": "bailey",
                    # NOTE: skip cs 396/8 and CS-W60
                    "data101a": "bailey",
                    "data101b": "bailey",
                    "data175a": "brendavanderlinden",
                    "data175b": "brendavanderlinden",
                    "data175c": "momeyer",
                    "data202a": "arnold",
                    "data303": "arnold",
                    "data383": "bailey",
                    # TODO: other idis classes?
                    # TODO: add stats classes
                    
                    }

# TODO: add ability to have multiple professors: like cs364 and data 303

# attributes for constraint problem
attributes = {
    "time": ["mwf800", "mwf900", "mwf1030", "mwf1130", "mwf1230", "mwf130", "mwf230", "tth830", "tth1030"],
    "room": ["sb372", "nh064", "nh253", "sb337", "sb354", "sb010", "sb382", "hh336", "hh334"]
}

# derive problem variables from assignments
variables = classes = get_variables(user_constraints)

# each variable and their neighbors
neighbors = get_neighbors(variables)

# derive faculty from assignments
faculty_list = get_faculty(user_constraints)
attributes["faculty"] = faculty_list

# create list of lists and make a cartesian product of them
attribute_list = [attributes["time"], attributes["room"],
                  attributes["faculty"]]
possible_values = list(itertools.product(*attribute_list))

# get all possible domains
domains = dict(map(lambda a_class: respect_assignments(a_class, possible_values, user_constraints), classes))

# TODO: sum of the number of elements rather than number of classes.
# TODO: give an estimate of the search space. Size of domain?
print(len(domains))
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
