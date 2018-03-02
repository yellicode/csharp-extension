"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Enumerates the possible collection types to generated for properties and parameters.
 */
var CollectionType;
(function (CollectionType) {
    CollectionType[CollectionType["ICollection"] = 0] = "ICollection";
    CollectionType[CollectionType["IEnumerable"] = 1] = "IEnumerable";
    CollectionType[CollectionType["IList"] = 2] = "IList";
})(CollectionType = exports.CollectionType || (exports.CollectionType = {}));
var NamespaceFeatures;
(function (NamespaceFeatures) {
    NamespaceFeatures[NamespaceFeatures["None"] = 0] = "None";
    NamespaceFeatures[NamespaceFeatures["XmlDocSummary"] = 1] = "XmlDocSummary";
    NamespaceFeatures[NamespaceFeatures["All"] = 1] = "All";
})(NamespaceFeatures = exports.NamespaceFeatures || (exports.NamespaceFeatures = {}));
var ClassFeatures;
(function (ClassFeatures) {
    ClassFeatures[ClassFeatures["None"] = 0] = "None";
    ClassFeatures[ClassFeatures["XmlDocSummary"] = 1] = "XmlDocSummary";
    ClassFeatures[ClassFeatures["Generalizations"] = 2] = "Generalizations";
    ClassFeatures[ClassFeatures["InterfaceRealizations"] = 4] = "InterfaceRealizations";
    ClassFeatures[ClassFeatures["All"] = 7] = "All";
    ClassFeatures[ClassFeatures["AllExceptXmlDocs"] = 6] = "AllExceptXmlDocs";
})(ClassFeatures = exports.ClassFeatures || (exports.ClassFeatures = {}));
var InterfaceFeatures;
(function (InterfaceFeatures) {
    InterfaceFeatures[InterfaceFeatures["None"] = 0] = "None";
    InterfaceFeatures[InterfaceFeatures["XmlDocSummary"] = 1] = "XmlDocSummary";
    InterfaceFeatures[InterfaceFeatures["Generalizations"] = 2] = "Generalizations";
    InterfaceFeatures[InterfaceFeatures["All"] = 3] = "All";
    InterfaceFeatures[InterfaceFeatures["AllExceptXmlDocs"] = 2] = "AllExceptXmlDocs";
})(InterfaceFeatures = exports.InterfaceFeatures || (exports.InterfaceFeatures = {}));
var EnumFeatures;
(function (EnumFeatures) {
    EnumFeatures[EnumFeatures["None"] = 0] = "None";
    EnumFeatures[EnumFeatures["XmlDocSummary"] = 1] = "XmlDocSummary";
    /**
     * Writes enumeration member initializers. This flag only applies when values are provided in the model.
     */
    EnumFeatures[EnumFeatures["Initializers"] = 2] = "Initializers";
    EnumFeatures[EnumFeatures["All"] = 3] = "All";
    EnumFeatures[EnumFeatures["AllExceptXmlDocs"] = 2] = "AllExceptXmlDocs";
})(EnumFeatures = exports.EnumFeatures || (exports.EnumFeatures = {}));
var EnumMemberFeatures;
(function (EnumMemberFeatures) {
    EnumMemberFeatures[EnumMemberFeatures["None"] = 0] = "None";
    EnumMemberFeatures[EnumMemberFeatures["XmlDocSummary"] = 1] = "XmlDocSummary";
    /**
     * Writes enumeration member initializers. This flag only applies when values are provided in the model.
     */
    EnumMemberFeatures[EnumMemberFeatures["Initializers"] = 2] = "Initializers";
    EnumMemberFeatures[EnumMemberFeatures["All"] = 3] = "All";
    EnumMemberFeatures[EnumMemberFeatures["AllExceptXmlDocs"] = 2] = "AllExceptXmlDocs";
})(EnumMemberFeatures = exports.EnumMemberFeatures || (exports.EnumMemberFeatures = {}));
var PropertyFeatures;
(function (PropertyFeatures) {
    PropertyFeatures[PropertyFeatures["None"] = 0] = "None";
    PropertyFeatures[PropertyFeatures["XmlDocSummary"] = 1] = "XmlDocSummary";
    /**
     * The access modifier if the owner is not an Interface.
     */
    PropertyFeatures[PropertyFeatures["AccessModifier"] = 2] = "AccessModifier";
    PropertyFeatures[PropertyFeatures["OptionalModifier"] = 4] = "OptionalModifier";
    PropertyFeatures[PropertyFeatures["All"] = 7] = "All";
    PropertyFeatures[PropertyFeatures["AllExceptXmlDocs"] = 6] = "AllExceptXmlDocs";
})(PropertyFeatures = exports.PropertyFeatures || (exports.PropertyFeatures = {}));
var MethodFeatures;
(function (MethodFeatures) {
    MethodFeatures[MethodFeatures["None"] = 0] = "None";
    MethodFeatures[MethodFeatures["XmlDocSummary"] = 1] = "XmlDocSummary";
    MethodFeatures[MethodFeatures["XmlDocParameters"] = 2] = "XmlDocParameters";
    MethodFeatures[MethodFeatures["XmlDocReturns"] = 4] = "XmlDocReturns";
    /**
    * The access modifier if the owner is not an Interface.
    */
    MethodFeatures[MethodFeatures["AccessModifier"] = 8] = "AccessModifier";
    MethodFeatures[MethodFeatures["All"] = 15] = "All";
    MethodFeatures[MethodFeatures["AllExceptXmlDocs"] = 8] = "AllExceptXmlDocs";
})(MethodFeatures = exports.MethodFeatures || (exports.MethodFeatures = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFjQTs7R0FFRztBQUNILElBQVksY0FJWDtBQUpELFdBQVksY0FBYztJQUN0QixpRUFBVyxDQUFBO0lBQ1gsaUVBQVcsQ0FBQTtJQUNYLHFEQUFLLENBQUE7QUFDVCxDQUFDLEVBSlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFJekI7QUFFRCxJQUFZLGlCQUlYO0FBSkQsV0FBWSxpQkFBaUI7SUFDekIseURBQVEsQ0FBQTtJQUNSLDJFQUFzQixDQUFBO0lBQ3RCLHVEQUFtQixDQUFBO0FBQ3ZCLENBQUMsRUFKVyxpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQUk1QjtBQWVELElBQVksYUFPWDtBQVBELFdBQVksYUFBYTtJQUNyQixpREFBUSxDQUFBO0lBQ1IsbUVBQXNCLENBQUE7SUFDdEIsdUVBQXdCLENBQUE7SUFDeEIsbUZBQThCLENBQUE7SUFDOUIsK0NBQTZELENBQUE7SUFDN0QseUVBQTBELENBQUE7QUFDOUQsQ0FBQyxFQVBXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBT3hCO0FBcUJELElBQVksaUJBTVg7QUFORCxXQUFZLGlCQUFpQjtJQUN6Qix5REFBUSxDQUFBO0lBQ1IsMkVBQXNCLENBQUE7SUFDdEIsK0VBQXdCLENBQUE7SUFDeEIsdURBQXFDLENBQUE7SUFDckMsaUZBQWtDLENBQUE7QUFDdEMsQ0FBQyxFQU5XLGlCQUFpQixHQUFqQix5QkFBaUIsS0FBakIseUJBQWlCLFFBTTVCO0FBaUJELElBQVksWUFTWDtBQVRELFdBQVksWUFBWTtJQUNwQiwrQ0FBUSxDQUFBO0lBQ1IsaUVBQXNCLENBQUE7SUFDdEI7O09BRUc7SUFDSCwrREFBcUIsQ0FBQTtJQUNyQiw2Q0FBa0MsQ0FBQTtJQUNsQyx1RUFBK0IsQ0FBQTtBQUNuQyxDQUFDLEVBVFcsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFTdkI7QUFFRCxJQUFZLGtCQVNYO0FBVEQsV0FBWSxrQkFBa0I7SUFDMUIsMkRBQVEsQ0FBQTtJQUNSLDZFQUFzQixDQUFBO0lBQ3RCOztPQUVHO0lBQ0gsMkVBQXFCLENBQUE7SUFDckIseURBQWtDLENBQUE7SUFDbEMsbUZBQStCLENBQUE7QUFDbkMsQ0FBQyxFQVRXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBUzdCO0FBVUQsSUFBWSxnQkFVWDtBQVZELFdBQVksZ0JBQWdCO0lBQ3hCLHVEQUFRLENBQUE7SUFDUix5RUFBc0IsQ0FBQTtJQUN0Qjs7T0FFRztJQUNILDJFQUF1QixDQUFBO0lBQ3ZCLCtFQUF5QixDQUFBO0lBQ3pCLHFEQUF1RCxDQUFBO0lBQ3ZELCtFQUFvRCxDQUFBO0FBQ3hELENBQUMsRUFWVyxnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQVUzQjtBQWlCRCxJQUFZLGNBV1g7QUFYRCxXQUFZLGNBQWM7SUFDdEIsbURBQVEsQ0FBQTtJQUNSLHFFQUFzQixDQUFBO0lBQ3RCLDJFQUF5QixDQUFBO0lBQ3pCLHFFQUFzQixDQUFBO0lBQ3JCOztNQUVFO0lBQ0gsdUVBQXVCLENBQUE7SUFDdkIsa0RBQXVFLENBQUE7SUFDdkUsMkVBQWlDLENBQUE7QUFDckMsQ0FBQyxFQVhXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBV3pCIn0=