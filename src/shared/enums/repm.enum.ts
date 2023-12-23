enum RoleType {
  PROPERTYOWNER = "PropertyOwner",
  PROPERTYMANAGER = "PropertyManager",
}

enum RequestType {
  PLUMBING = "Plumbing",
  ELECTRICAL = "Electrical",
  PAPERWORK = "Paperwork",
  PAINTING = "Painting",
  CIVIL = "Civil",
  OTHER = "Other",
}

enum PriorityType {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

enum PropertyType {
  FLAT = "Flat",
  HOUSE = "House",
  VILLA = "Villa",
}

enum RequestLogType {
  PARTS = "Parts",
  REPAIR = "Repair",
  SERVICE = "Service",
}

enum ReminderStatus {
  SENT = "Sent",
  SEEN = "Seen",
  DISMISSED = "Dismissed",
  SNOOZED = "Snoozed",
}

enum ServiceRequestStatus {
  SAVED = "Saved",
  SENT = "Sent",
  INPROGRESS = "In Progress",
  COMPLETED = "Completed",
  ONHOLD = "On Hold",
  CANCELLED = "Cancelled",
}

enum PropertyManagerAssignment {
  ASSIGNEDACTIVE = 1,
  ASSIGNEDINACTIVE = 0,
}

export {
  RoleType,
  RequestType,
  PriorityType,
  PropertyType,
  RequestLogType,
  ReminderStatus,
  ServiceRequestStatus,
  PropertyManagerAssignment,
};
