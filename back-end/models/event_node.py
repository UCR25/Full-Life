from typing   import list

class Category:
    def __init__(self, category):
        if not  isinstance(category, str):
            raise TypeError("category needs to be a string")
        self.category = category

    def __eq__(self, other):
        if not isinstance(other, str):
            raise TypeError("other needs to be a string")
        return self.category == other

class EventNode:
    def __init__(self, name, address, description=None, startTime=None, endTime=None):
        self.name = name
        self.address = address
        self.description = description
        self.startTime = startTime
        self.endTime = endTime
        self.categoriesList = []

    def addToList(self, otherCategory):
        self.categoriesList.append(otherCategory)

    def __eq__(self, other):
        return self.name == other.name and self.address == other.name
    
class EventNodeBuilder:
    def __init__(self, name, address):
        self.EventNode = EventNode(name, address)

    def setDescription(self, description):
        self.EventNode.description = description

    def setStartTime(self, startTime):
        self.EventNode.startTime = startTime

    def setEndTime(self, endTime):
        self.EventNode.endTime = endTime

    def build(self):
        return self.EventNode
        
#event node manager makes nodes from the event node database
#back builder 