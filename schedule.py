from tools.aima.csp import backtracking_search, min_conflicts, CSP
import itertools
import timeit


def get_variables(assignments):
    """returns the keys, which are the variables in the CSP"""
    return list(assignments.keys())


def get_faculty(assignments):
    """
    Returns a list of faculty derived from the assignments.
    ref: https://thispointer.com/python-how-to-create-a-list-of-all-the-values-in-a-dictionary/
    """
    unique_values = []

    for prof in assignments.values():
        if prof not in unique_values:
            unique_values.append(prof)
    return unique_values


def get_neighbors(vars_list):
    """Return a dict of neighbors, where for each class a
    list of all other classes are presented"""
    res = {}
    for variable in vars_list:
        res[variable] = [neighbor for neighbor in vars_list if neighbor != variable]
    return res


def check_room(a_class):
    """Based on the class, return its valid room assignments"""
    # todo: is there a better way to write this?
    if a_class.startswith("l"):
        if a_class.startswith("lcs"):
            return cs_lab_rooms
        else:
            return bio_lab_rooms
    elif a_class.startswith("cs") or a_class.startswith("data") or a_class.startswith("idis"):
        return cs_rooms + both
    elif a_class.startswith("stat") or a_class.startswith("math"):
        return math_stat_rooms + both
    else:  # a_class.startswith("bio"):
        return bio_rooms


def respect_assignments(a_class, possible_value_tuples, assignments):
    """Limit the domain for a class to only consist of possible
    (time, room, faculty) combinations where faculty is the same
    on the assignment"""
    prof = assignments[a_class]
    valid_rooms = check_room(a_class)
    limited_domain = [value for value in possible_value_tuples if (value[2] == prof
                                                                   and value[1] in valid_rooms)]
    # TODO: potentially optimize code based on heuristic of once a class slot is picked,
    # remove it from the possible domains for other classes. Would require a copy of the list
    # to modify and copy over if the CSP has to back track.
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
                    "idis110a": "bobeldyk",
                    "math100a": "turner",
                    "math132a": "bolt",
                    "math169a": "ferdinands",
                    "math170a": "ferdinands",
                    "math171a": "bolt",
                    "math171b": "bolt",
                    "math171c": "moseley",
                    "math171d": "moseley",
                    "math172a": "sunukjian",
                    "math172b": "scofield",
                    "math172c": "kapitula",
                    "math190a": "scofield",
                    "math221a": "klanderman",
                    "math222a": "talsma",
                    "math231a": "scofield",
                    "math231b": "kapitula",
                    "math231c": "scofield",
                    "math251a": "scofield",
                    "math251b": "scofield",
                    "math252a": "pruim",
                    "math252b": "pruim",
                    "math255a": "moseley",
                    "math270a": "ferdinands",
                    "math271a": "ferdinands",
                    "math270b": "bolt",
                    "math271b": "bolt",
                    "math270c": "kapitula",
                    "math271c": "kapitula",
                    "math301a": "turner",
                    "math305a": "moseley",
                    "math323a": "genzink",
                    "math327a": "klanderman",
                    "math331a": "kapitula",
                    "math351a": "ferdinands",
                    "math355a": "kapitula",
                    "math359a": "klanderman",
                    "math361a": "ferdinands",
                    "math390a": "moseley",
                    "math391a": "moseley",
                    "math395a": "klanderman",
                    "mathw81a": "moseley",
                    "mathw82a": "pruim",
                    "stat143a": "pamplantinga",
                    "stat143b": "pamplantinga",
                    "stat143c": "barbaraadams",
                    "stat143d": "barbaraadams",
                    "stat143e": "talsma",
                    "stat145a": "scofield",
                    "stat241a": "jager",
                    "stat241b": "jager",
                    "stat241c": "jager",
                    "stat243a": "deruiter",
                    "stat245a": "deruiter",
                    "stat343a": "pruim",
                    "stat344a": "deruiter",
                    "stat390a": "pruim",
                    # TODO: add engineering classes and cognates
                    "bio115a": "miller",
                    "bio123a": "miller",
                    "bio141a": "shen",
                    "bio141b": "shen",
                    "lbio141a": "shen",
                    "lbio141b": "grasman",
                    "lbio141c": "grasman",
                    "lbio141d": "shen",
                    "bio160a": "grasman",
                    "bio160n": "wertz",
                    "lbio160a": "grasman",
                    "lbio160b": "dejong",
                    "lbio160c": "dejong",
                    "lbio160n": "wertz",
                    "bio161a": "koetje",
                    "lbio161a": "miller",
                    "lbio161b": "miller",
                    "bio205a": "bebej",
                    "lbio205a": "bebej",
                    "lbio205b": "bebej",
                    "lbio205c": "bebej",
                    "lbio205d": "bebej",
                    "lbio205e": "barrett",
                    "bio206a": "dubois",
                    "bio206b": "barret",
                    "lbio206a": "dubois",
                    "lbio206b": "barret",
                    "lbio206c": "dubois",
                    "lbio206d": "boldenow",
                    "bio207a": "wertz",
                    "bio207b": "wertz",
                    "lbio207a": "wertz",
                    "lbio207b": "wertz",
                    "lbio207c": "wertz",
                    "lbio207d": "shen",
                    "lbio207e": "shen",
                    "lbio207f": "shen",
                    "lbio207g": "keen",
                    "lbio207h": "keen",
                    "lbio207i": "keen",
                    "bio230a": "dornbos",
                    "lbio230a": "koetje",
                    "lbio230b": "barrett",
                    "lbio230c": "koetje",
                    "bio250a": "miller",
                    "bio250b": "dejong",
                    "bio295a": "koetje",
                    "bio321a": "wilstermann",
                    "lbio321a": "wiltermann",
                    "lbio321b": "wiltermann",
                    "bio331a": "boldenow",
                    "lbio331a": "boldenow",
                    "lbio331b": "boldenow",
                    "bio332a": "dornbos",
                    "lbio332a": "dornbos",
                    "bio333a": "shen",
                    "lbio333a": "shen",
                    "bio335a": "barrett",
                    "lbio335a": "boldenow",
                    "bio336a": "wertz",
                    "lbio336a": "wertz",
                    "bio338a": "miller",
                    "lbio338a": "miller",
                    "bio345a": "grasman",
                    "lbio345a": "grasman",
                    "bio346a": "warners",
                    "lbio346a": "warners",
                    "bio354a": "dornbos",
                    "bio364a": "koetje",
                    "bio395a": "bebej",
                    "bio396a": "dubois"
                    }

# TODO: add ability to have multiple professors: like cs364 and data 303

# attributes for constraint problem
attributes = {
    "times": ["mwf800", "mwf900", "mwf1030", "mwf1130", "mwf1230", "mwf130", "mwf230", "tth830", "tth1030"],
    "rooms": []
}

# TODO: prefer rooms and then 
math_stat_rooms = ["nh251", "nh259", 'nh276', 'nh261', "nh295"]
cs_rooms = ["sb372", "nh253", "sb010", "sb382", "hh336", "hh334", "sc203"]
both = ["nh064", "a"]
cs_lab_rooms = ["sb337", "sb354"]
bio_rooms = ["sb256", "sb276", "cfaud", "hc300", "sb103"]
bio_lab_rooms = ["sb277", "dh132", "dh106", "dh124", "sb210"]

# start timer
start = timeit.default_timer()

# set rooms
attributes["rooms"] = math_stat_rooms + cs_rooms + both + cs_lab_rooms + bio_rooms + bio_lab_rooms

# derive problem variables from assignments
variables = classes = get_variables(user_constraints)

# each variable and their neighbors
neighbors = get_neighbors(variables)

# derive faculty from assignments
faculty_list = get_faculty(user_constraints)
attributes["faculty"] = faculty_list

# create list of lists and make a cartesian product of them
attribute_list = [attributes["times"], attributes["rooms"],
                  attributes["faculty"]]
possible_values = list(itertools.product(*attribute_list))

# get all possible domains
domains = dict(map(lambda a_class: respect_assignments(a_class, possible_values, user_constraints), classes))

# Setup problem
problem = CSP(variables, domains, neighbors, constraints)

# TODO: could write a function for backtracking that uses a heuristic to sort
# which variables should be assigned first, like classes of professors that need to teach the most.
# solution = backtracking_search(problem)
# solution = min_conflicts(problem, max_steps=1000)
solution = min_conflicts(problem)

# top timer
stop = timeit.default_timer()
print('Time: ', stop - start)

# print result
# TODO: sum of the number of elements rather than number of classes.
# TODO: give an estimate of the search space. Size of domain?
print('Number of Domains: ' + str(len(domains)))
print('Variables: ' + str(variables))
print('Domains: ' + str(domains))
print('Neighbors: ' + str(neighbors))
print('Professors: ' + str(sorted(faculty_list)))
if solution is not None and problem.goal_test(solution):
    print('Solution:')
    print(solution)
else:
    print('Failed - domains: ' + str(problem.curr_domains))
    problem.display(problem.infer_assignment())
