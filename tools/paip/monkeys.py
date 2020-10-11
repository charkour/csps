from gps import gps

problem = {
    "start": ["at door", "on floor", "has ball", "hungry", "chair at door"],
    "finish": ["not hungry"],
    "ops": [
    {
        "action": "climb on chair",
        "preconds": ["chair at middle room", "at middle room", "on floor"],
        "add": ["at bananas", "on chair"],
        "delete": ["at middle room", "on floor"]
    },
    {
        "action": "push chair from door to middle room",
        "preconds": ["chair at door", "at door"],
        "add": ["chair at middle room", "at middle room"],
        "delete": ["chair at door", "at door"]
    },
    {
        "action": "walk from door to middle room",
        "preconds": ["at door", "on floor"],
        "add": ["at middle room"],
        "delete": ["at door"]
    },
    {
        "action": "grasp bananas",
        "preconds": ["at bananas", "empty handed"],
        "add": ["has bananas"],
        "delete": ["empty handed"]
    },
    {
        "action": "drop ball",
        "preconds": ["has ball"],
        "add": ["empty handed"],
        "delete": ["has ball"]
    },
    {
        "action": "eat bananas",
        "preconds": ["has bananas"],
        "add": ["empty handed", "not hungry"],
        "delete": ["has bananas", "hungry"]
    }
    ]
}

def main():
    start = problem['start']
    finish = problem['finish']
    ops = problem['ops']
    for action in gps(start, finish, ops):
        print(action)

if __name__ == '__main__':
    main()