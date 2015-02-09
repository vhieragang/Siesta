{
    deliverySteps : [
        {Id : "conveyor", Name : "Load Conveyor 1", PersonsAssigned : 3},
        {Id : "machine1", Name : "Start Machine 1", PersonsAssigned : 1},
        {Id : "spareparts", Name : "Gather spare parts", PersonsAssigned : 2},
        {Id : "packaging1", Name : "Packaging #1", PersonsAssigned : 4},
        {Id : "packaging2", Name : "Packaging #2", PersonsAssigned : 2},
        {Id : "truckloading", Name : "Truck loading", PersonsAssigned : 2}
    ],
    deliveries : [
        {
            Id   : "g1",
            Name : "Delivery 1",
            Date : "2011-01-01 11:30"
        },
        {
            Id   : "g2",
            Name : "Delivery 2",
            Date : "2011-01-01 14:15"
        }
    ],

    deliveryTasks : [
        { ResourceId: "conveyor", DeliveryId : "g1", Name : "Task 1", StartDate : "2011-01-01 10:30", EndDate : "2011-01-01 11:00"},
        { ResourceId: "machine1", DeliveryId : "g1", Name : "Task 2", StartDate : "2011-01-01 10:40", EndDate : "2011-01-01 11:00"},
        { ResourceId: "spareparts", DeliveryId : "g1", Name : "Task 3", StartDate : "2011-01-01 10:40", EndDate : "2011-01-01 11:10"},
        { ResourceId: "packaging1", DeliveryId : "g1", Name : "Task 4", StartDate : "2011-01-01 10:20", EndDate : "2011-01-01 10:50"},
        { ResourceId: "packaging2", DeliveryId : "g1", Name : "Task 5", StartDate : "2011-01-01 11:10", EndDate : "2011-01-01 11:30"},
        { ResourceId: "truckloading", DeliveryId : "g1", Name : "Task 6", StartDate : "2011-01-01 11:30", EndDate : "2011-01-01 12:20"},

        { ResourceId: "conveyor", DeliveryId : "g2", Name : "Task 11", StartDate : "2011-01-01 13:30", EndDate : "2011-01-01 14:00"},
        { ResourceId: "machine1", DeliveryId : "g2", Name : "Task 12", StartDate : "2011-01-01 13:30", EndDate : "2011-01-01 13:40"},
        { ResourceId: "spareparts", DeliveryId : "g2", Name : "Task 13", StartDate : "2011-01-01 13:20", EndDate : "2011-01-01 13:55"},
        { ResourceId: "packaging1", DeliveryId : "g2", Name : "Task 14", StartDate : "2011-01-01 13:50", EndDate : "2011-01-01 14:00"},
        { ResourceId: "packaging2", DeliveryId : "g2", Name : "Task 15", StartDate : "2011-01-01 13:40", EndDate : "2011-01-01 14:10"},
        { ResourceId: "truckloading", DeliveryId : "g2", Name : "Task 16", StartDate : "2011-01-01 14:15", EndDate : "2011-01-01 14:40"}
    ]
}
        
        