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

    # Check to make sure class is not in the same room at the same time
    if c1[0] == c2[0] and c1[1] == c2[1]:
        # print("class conflict")
        return False
    return True
