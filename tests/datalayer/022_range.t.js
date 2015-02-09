StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')

    t.ok(Sch.model.Range, "Sch.model.Range is here")

    
    //======================================================================================================================================================================================================================================================
    t.diag('get dates')
    
    var range       = new Sch.model.Range({
        StartDate       : new Date(2011, 06, 10),
        EndDate         : new Date(2011, 06, 12)
    })
    
    
    t.isDeeply(range.getDates(), [
        new Date(2011, 06, 10),
        new Date(2011, 06, 11)
    ], 'Correct dates in range')
    
    
    var range       = new Sch.model.Range({
        StartDate       : new Date(2011, 06, 10, 1),
        EndDate         : new Date(2011, 06, 12, 1)
    })
    
    
    t.isDeeply(range.getDates(), [
        new Date(2011, 06, 10),
        new Date(2011, 06, 11),
        new Date(2011, 06, 12)
    ], 'Correct dates in range starting not at the days edge')
    
    
})    
