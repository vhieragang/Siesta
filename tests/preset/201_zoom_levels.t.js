StartTest(function(t) {
    var scheduler = t.getScheduler({
        viewPreset  : 'hourAndDay'
    }),
    presetName = 'hourAndDay', 
    presetTimeUnit = 'MINUTE', 
    presetResolution = 30, 
    presetIncrement = 3, 
    columnWidth = 140,
    zoomLevels = 0;

    zoomLevels = scheduler.zoomLevels.length;

    var added = scheduler.addZoomLevel(presetName, presetTimeUnit, presetResolution, presetIncrement, columnWidth);

    t.is(added, 7, 'New zoom level added in correct place');

    t.isNot(scheduler.zoomLevels.length, zoomLevels, 'Different amount of zoom levels');

    var removed = scheduler.removeZoomLevel(presetName, presetTimeUnit, presetResolution, presetIncrement, columnWidth);

    t.is(removed, true, 'Zoom level removed');

    t.is(scheduler.zoomLevels.length, zoomLevels, 'Equal amount of zoom levels');
});
