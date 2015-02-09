/*
 * FOR THE TESTS TO WORK, YOU NEED TO HAVE YOUR EXT JS SDK FOLDER ON THE SAME LEVEL AS THE EXT SCHEDULER/GANTT FOLDER
 */

if ($.browser.msie && $.browser.version.match(/7|8|9/)) {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Trident/5.0") > -1 && userAgent.indexOf("MSIE 7.0") > -1) {
        throw "IE9 Compatibility View";
    }
    else if (userAgent.indexOf("Trident/4.0") > -1 && userAgent.indexOf("MSIE 7.0") > -1) {
        throw "IE8 Compatibility View";
    }
}

var Harness = Siesta.Harness.Browser.ExtJS;
//var debug = typeof Ext !== "undefined";  // Use debug versions when a browser harness is present
var debug = true;
var extRoot = Harness.getQueryParam('extroot');
var isSmokeTest = Harness.getQueryParam('smoke');
var isRelease = Harness.getQueryParam('release') == 1;
var isExtNightly = Harness.getQueryParam('extNightly');

var targetExtVersions;

// Using external Ext copy
if (extRoot) {
    // strip any trailing slashes
    extRoot = extRoot.replace(/\/$/, '');
    targetExtVersions = ['external'];
} else {
    targetExtVersions = [
        '5.1.0'
    ];

    if (isRelease) targetExtVersions = [ targetExtVersions.pop() ];
}

if (isSmokeTest) {
    // Only run smoke tests against latest version
    targetExtVersions = [targetExtVersions[targetExtVersions.length - 1]];
}

Harness.configure({
    title : 'Ext Scheduler Test Suite',
    sandboxBoundaryByGroup         : false,
    testClass                      : Bryntum.Test,
    allowExtVersionChange          : false,
    disableCaching                 : false,
    autoCheckGlobals               : true,
    keepResults                    : false,
    overrideSetTimeout             : true,
    enableCodeCoverage             : !isSmokeTest && Boolean(window.IstanbulCollector),
    cachePreload                   : isSmokeTest,

    expectedGlobals                : [
        'Sch',

        // Ext leaks
        'i',
        'checkErrorTask',
        'onDirectCaptureEvent'
    ],

    failOnMultipleComponentMatches : true,
    failKnownBugIn                 : Harness.getQueryParam('failKnownBugIn')
});

var topItems = [];

function getExtPaths(extRoot, jsFile, rtl) {

    if (isExtNightly) {
        // two days ago
        var dt = new Date(new Date() - 2*1000*60*60*24),
            m = dt.getMonth() + 1,
            d = dt.getDate();

        extRoot = extRoot + '/s5-' + dt.getFullYear() + (m < 10 ? '0' :'') + m + (d < 10 ? '0' :'') + d + '/ext/';
    }

    jsFile = jsFile || 'ext-all-debug.js';

    return {
        extRoot : extRoot,
        jsRoot  : extRoot + '/build/',
        cssRoot : extRoot + '/build/packages/ext-theme-classic/build/resources/',
        js      : extRoot + '/build/' + jsFile,
        css     : extRoot + '/packages/ext-theme-classic/build/resources/' + (rtl ? 'ext-theme-classic-all-rtl.css' : 'ext-theme-classic-all.css')
    };
}

function getTestSuite(extRoot, extVersion) {

    var extPaths = getExtPaths(extRoot);
    var extRTLPaths = getExtPaths(extRoot, 'ext-all-rtl-debug.js', true);

    var rtlPreloads = [
        extRTLPaths.css,
        extRTLPaths.js,
        '../resources/css/sch-all.css',
        '../sch-all-debug.js'
    ];

    var suite = [
        {
            group           : 'Sanity',
            sandbox         : false,
            items           : [
                'sanity/010_sanity.t.js',
                'sanity/014_default_configs.t.js',
                'sanity/015_subclass.t.js',
                'sanity/016_dom_footprint.t.js'
            ]
        },
        {
            group           : 'Sanity slow',
            forceDOMVisible : false,
            items           : [
                'sanity/012_no_overrides.t.js',
                {
                    url         : 'sanity/013_lint.t.js',
                    alsoPreload : [ "sanity/jshint.js" ]
                },
                {
                    alsoPreload : ["sanity/symbols.js"],
                    url         : 'sanity/017_private_method_overrides.t.js'
                },
                {
                    url     : 'sanity/018_on_demand_full.t.js',
                    preload : [ extRoot + "/build/ext-debug.js" ]
                },
                {
                    url     : 'sanity/019_unscoped_css_rules.t.js',
                    preload : [
                        '../resources/css/sch-all.css',
                        extPaths.jsRoot + '/ext-all.js'
                    ]
                },
                $.browser.msie ? null : {
                    url         : 'sanity/020_sencha_cmd_app.t.js',
                    hostPageUrl : 'cmd_app/build/production/TestApp/'
                },
                {
                    url     : 'sanity/021_sanity_checks.t.js',
                    preload : [
                        extPaths.cssRoot + '/ext-theme-classic-all.css',
                        extPaths.jsRoot + '/ext-all-debug.js',
                        '../sch-all' + (debug ? '-debug' : '') + '.js'
                    ]
                }
            ]
        },
        {
            group : 'Basic Ext grid/tree features',
            sandbox : false,

            items : [
                'basic_grid_features/010_column_resizing.t.js',
                'basic_grid_features/011_column_menu.t.js',
                'basic_grid_features/012_tree_store_crud.t.js'
            ]
        },

        {
            group : 'Column',
            items : [
                'column/001_summary.t.js',
                'column/002_column_width.t.js'
            ]
        },

        {
            group   : 'Calendar',
            items   : [
                'calendar/40_calendar_basic.t.js',
                'calendar/40_calendar_multi_column_events.t.js',
                'calendar/40_calendar_forcefit.t.js',
                'calendar/40_calendar_resize.t.js',
                'calendar/40_calendar_column.t.js'
            ]
        },

        {
            group : 'View presets',
            items : [
                'preset/200_preset.t.js'
            ]
        },
        {
            group           : 'Util',
            sandbox         : false,

            items : [
                'util/020_sch_util_date.t.js',
                'util/021_sch_util_date_dst.t.js',
                'util/022_sch_util_date2.t.js'
            ]
        },
        {
            group           : 'CRUD Manager',
            forceDOMVisible : false,

            items           : [
                'crud_manager/01_add_stores.t.js',
                'crud_manager/02_load_package.t.js',
                'crud_manager/03_change_set_package.t.js',
                'crud_manager/04_load_data.t.js',
                'crud_manager/05_apply_change_set.t.js',
                'crud_manager/05_apply_change_set_nested.t.js',
                'crud_manager/06_sync.t.js',
                'crud_manager/07_load.t.js',
                'crud_manager/08_auto_sync.t.js',
                'crud_manager/09_xml_encoder.t.js',
                'crud_manager/10_ajax_transport.t.js',
                {
                    url         : 'crud_manager/11_backend.t.js',
                    load        : {
                        url     : '../examples/PHP demo/php/read.php'
                    },
                    sync        : {
                        url     : '../examples/PHP demo/php/save.php'
                    },
                    resetUrl    : '../examples/PHP demo/php/reset.php'
                }/*,

                // Uncommenting following test will enable JAVA backend CRUD sample testing.
                // Note: This will require configuring requests proxying on your web-server (to avoid "same origin" issues).
                // Here is an example of how it can be done for Apache web server:
                //
                //     ProxyPass        /java-gantt-demo  http://127.0.0.1:8080/scheduler-crud-1.0
                //     ProxyPassReverse /java-gantt-demo  http://127.0.0.1:8080/scheduler-crud-1.0
                {
                    url         : 'crud_manager/11_backend.t.js?java',
                    load        : {
                        url     : '/scheduler-crud/services/load'
                    },
                    sync        : {
                        url     : '/scheduler-crud/services/sync'
                    },
                    resetUrl    : '/scheduler-crud/services/reset'
                }*/
            ]
        },
        {
            // will be executed with `forceDOMVisible` in IE
            group : 'Visual Util',

            items : [
                'util/023_sch_util_scrollmanager.t.js'
            ]
        },
        {
            group : 'Panel',

            items : [
                'panel/1101_panel_viewchange.t.js',
                'panel/1102_panel_api.t.js',
                'panel/1104_column_lines.t.js',
                {
                    preload : rtlPreloads,
                    url     : 'panel/1104_column_lines_rtl.t.js'
                },
                'panel/1105_panel_store_bindings.t.js',
                'panel/1106_panel_css.t.js',
                'panel/1107_panel_timeaxis.t.js',
                'panel/1108_scroll.t.js',
                'panel/1109_setorientation.t.js',
                'panel/1110_click_scroll.t.js',
                'panel/1111_start_end_dates.t.js',
                'panel/1112_partner_panel.t.js'
            ]
        },
        {
            group : 'Mixin',

            items : [
                'mixin/3100_abstractschedulerview.t.js',
                'mixin/3101_viewsorters.t.js'
            ]
        },
        {
            group           : 'Data components',
            sandbox         : false,

            items : [
                'datalayer/020_timeaxis.t.js',
                'datalayer/021_isDateRangeAvailable.t.js',
                'datalayer/022_range.t.js',
                'datalayer/023_loading_data.t.js',
                'datalayer/024_event.t.js',
                'datalayer/025_eventstore.t.js',
                'datalayer/026_customizable.t.js',
                'datalayer/026_custom_model_fields.t.js',
                'datalayer/027_resourcestore.t.js',
                'datalayer/027_tree_store_override.t.js',
                'datalayer/028_timeaxis_dst.t.js',
                'datalayer/029_resourcestore_multi_eventstore.t.js',
                'datalayer/030_timeaxis_dst_chile.t.js',
                'datalayer/031_timeaxis_noncontinuous.t.js',
                'datalayer/032_timeaxis_date_methods.t.js',
                'datalayer/033_timeaxis_calendar.t.js'
            ]
        },
        {
            group : 'Life cycles',
            sandbox : false,

            items : [
                'lifecycle/040_schedulergrid.t.js',
                'lifecycle/041_schedulertree.t.js',
                'lifecycle/042_schedulergrid_right_columns.t.js'
            ]
        },
        {
            group : 'Tree',
            sandbox : false,

            items : [
                'tree/120_tree.t.js',
                'tree/121_treeview_load.t.js',
                'tree/122_treeview_add_bug.t.js',
                'tree/123_treeview_rowheight.t.js'
            ]
        },
        {
            group : 'Plugins',

            items : [
                'plugins/080_zones.t.js',
                'plugins/080_zones_indicators.t.js',
                'plugins/080_zones_model_data.t.js',
                'plugins/081_lines.t.js',
                'plugins/081_lines_indicators.t.js',
                'plugins/083_currenttimeline.t.js',
                'plugins/084_eventeditor.t.js',
                'plugins/084_eventeditor_zindex.t.js',
                'plugins/085_simpleeditor.t.js',
                'plugins/086_dragselector.t.js',
                'plugins/087_pan.t.js',
                'plugins/087_pan_plus_resize.t.js',
                {
                    url             : 'plugins/088_resourcezones.t.js',
                    forceDOMVisible : true
                },
                {
                    url             : 'plugins/097_resourcezones_events.t.js',
                    forceDOMVisible : true
                },
                'plugins/171_null_zones.t.js',
                'plugins/092_event_tools.t.js',
                'plugins/093_column_lines.t.js',
                'plugins/093_column_lines2.t.js',
                'plugins/094_zones_hidden_panel.t.js',
                'plugins/094_print.t.js',
                'plugins/096_header_zoom.t.js',
                'plugins/098_cellplugin.t.js',
                'plugins/098_cellplugin_events.t.js',
                'plugins/098_cellplugin_external_listeners.t.js',
                'plugins/098_cellplugin_multiple_selection.t.js',
                'plugins/098_cellplugin_multiple_cell_events.t.js',
                'plugins/098_cellplugin_event_editing.t.js',
                'plugins/098_cellplugin_buffered.t.js',
                'plugins/098_cellplugin_grouping.t.js'
            ]
        },
        {
            group : 'Event API & Interaction',

            items : [
                'event/060_events.t.js',
                'event/061_dragdrop.t.js',
                'event/061_dragdrop_cancel.t.js',
                'event/061_dragdrop_multi.t.js',
                'event/061_dragdrop_sanity.t.js',
                {
                    alsoPreload : ['../../ExtGantt3.x/gnt-all-debug.js'],
                    url         : 'event/061_dragdrop_copy.t.js'
                },
                'event/061_dragdrop_outside_of_view.t.js',
                'event/061_dragdrop_filtered_timeaxis.t.js',
                'event/062_resize.t.js',
                'event/063_create.t.js',
                'event/064_single_selection.t.js',
                'event/065_multi_selection.t.js',
                'event/066_event_accessibility.t.js',
                {
                    url             : 'event/067_dd_container_scroll.t.js',
                    forceDOMVisible : true
                },
                'event/068_dragdrop_invalid.t.js',
                'event/069_scrollintoview.t.js',
                'event/070_dragdrop_tip.t.js',
                'event/080_scheduler_events.t.js'
            ]
        },
        {
            group : 'Rendering',
            sandbox : false,
            items : [
                'rendering/088_events.t.js',
                'rendering/089_switch_resources.t.js',
                'rendering/090_event_style.t.js',
                'rendering/091_template.t.js',
                'rendering/092_rowheight.t.js',
                'rendering/093_two_schedulers.t.js',
                'rendering/094_time_column_width.t.js',
                'rendering/095_timeCellRenderer.t.js',
                'rendering/096_vertical_layout.t.js',
                'rendering/097_resource_column_width.t.js',
                'rendering/098_vertical_resource_filter.t.js',
                'rendering/099_orientation_switching.t.js',
                'rendering/100_getVisibleDateRange.js',
                'rendering/101_get_visible_daterange_vertical.js',
                'rendering/102_rowheight_2.t.js',
                'rendering/102_rowheight_3.t.js',
                'rendering/103_layout.t.js',
                'rendering/104_event_layout.t.js',
                'rendering/105_forcefit_vertical.t.js',
                'rendering/106_vertical_timeaxis_projection.t.js',
                'rendering/107_disable_auto_adjust.t.js'
            ]
        },
        {
            group   : 'Validation',

            items : [
                'validation/100_allow_overlap.t.js',
                'validation/101_validator_functions.t.js'
            ]
        },
        {
            group : 'Timeaxis view',
            // This class should not rely on any Ext JS UI components
            items : [
                'header/200_timeaxisview_model.t.js',
                {
                    url     : 'header/201_timeaxisview.t.js',
                    // the new contract is that CSS should be always loaded (otherwise alert is shown in TimelineView)
                    // so such preloads are not quite correct
                    preload : [
                        extPaths.jsRoot + "/ext-all-debug.js",
                        "../sch-all-debug.js"
                    ]
                },

                'header/202_timeaxisview_events.t.js'
            ]
        },
        {
            group : 'Infinite scroll',
            items : [
                'infinite_scroll/01_rendering.t.js',
                'infinite_scroll/02_drag.t.js',
                'infinite_scroll/03_zooming.t.js',
                'infinite_scroll/04_size_change.t.js'
            ]
        },
        {
            group : 'Features',

            items : [
                'features/010_zoom_to_level.t.js',
                'features/010_zoom_to_span.t.js',
                'features/011_dragcreator.t.js',
                'features/012_dragdrop.t.js',
                'features/012_dragdrop_infinite_scroll.t.js',
                {
                    url     : 'features/012_dragdrop_rtl.t.js',
                    preload : rtlPreloads
                },
                'features/013_resize.t.js',
                'features/013_resize_with_snap_to_increment.t.js',
                'features/013_resize_vertical.t.js',
                'features/014_dragdrop_vertical.t.js',
                'features/015_refreshNode_with_grouping.t.js',
                'features/016_zooming_smoke_test.t.js',
                'features/017_grouping.t.js'
            ]
        },
        {
            group   : 'Header',
            sandbox : false,

            items : [
                'header/125_timeaxiscolumn_header_refresh.t.js',
                'header/310_single_timeheader.t.js',
                'header/311_single_time_axis_horizontal.t.js',
                'header/312_single_single_level_header.t.js',
                'header/313_single_time_axis_vertical.t.js',
                'header/314_single_headers_heights.t.js',
                'header/315_single_right_position_columns.t.js',
                'header/316_single_timeheader_mouseover.t.js',
                'header/317_filtered_time_axis_horizontal.t.js',
                'header/318_header_scroll_bug.t.js'
            ]
        },
        {
            group : 'Tooltip',

            items : [
                'tooltip/120_tooltip.t.js'
            ]
        },
        {
            group : 'State',

            items : [
                'state/130_stateful.t.js',
                'state/131_stateful_tree.t.js'
            ]
        },
        {
            group : 'View',

            items : [
                'view/2101_view.t.js',
                'view/2103_grouping_view.t.js',
                'view/2103_grouping_view2.t.js',
                'view/2104_subclass_view.t.js',
                'view/2105_spacer_el.t.js',
                'view/2106_add_events.t.js',
                'view/2107_timeaxis_projection.t.js',
                'view/2107_emptytext.t.js',
                'view/2108_getResourceRegion.t.js',
                'view/2109_timeAxisViewModel.t.js',
                'view/2110_getDateFromX.t.js',
                {
                    preload : rtlPreloads,
                    url     : 'view/2111_getDateFromX_rtl.t.js'
                },
                'view/2112_filtered_time_axis.t.js',
                {
                    preload : [
                        extPaths.cssRoot + "/ext-theme-classic-all.css",
                        extPaths.jsRoot + "/ext-all-debug.js",
                        '../resources/css/sch-all.css',
                        '../sch-all' + (debug ? '-debug' : '') + '.js'
                    ],
                    url     : 'view/2113_lazy_render.t.js'
                },
                'view/2114_display_date_format.t.js',
                'view/2115_eventStore_crud.t.js',
                'view/2115_eventStore_crud2.t.js',
                'view/2116_filtered_timeaxis_getdate.t.js'
            ]
        },
        {
            group : 'Buffered rendering',

            items : [
                'buffered_rendering/010_buffered_view.t.js',
                'buffered_rendering/015_buffered_scrolling.t.js',
                'buffered_rendering/020_buffered_view_cached.t.js',
                'buffered_rendering/030_buffered_view_sorting.t.js'
//                ,
//                'buffered_rendering/100_buffered_tree.t.js'
            ]
        },
        // tests for tree filtering - checking "pure-Ext" implementation
        {
            group : 'Tree store filtering',

            preload : [
                extPaths.cssRoot + "/ext-theme-classic-all.css",
                extPaths.jsRoot + "/ext-all-debug.js",
                '../resources/css/sch.view.tree.css',
                '../js/Sch/data/mixin/FilterableTreeStore.js',
                '../js/Sch/mixin/FilterableTreeView.js'
            ],

            items : [
                'treestore-filter/010_basic.t.js',
                'treestore-filter/011_hideNodesBy.t.js',
                'treestore-filter/020_check_parents.t.js',
                'treestore-filter/030_only_parents.t.js',
                'treestore-filter/50_re-apply-filter.t.js',
                'treestore-filter/60_collapse_expand.t.js'
            ]
        },
        // a separate group to use normal preloads
        {
            group : 'Scheduler filtering',

            items : [
                'treestore-filter/040_scheduler.t.js'
            ]
        },
        {
            group : 'Shared core features',

            items : [
                'shared/001_view.t.js'
            ]
        },
        {
            group       : 'Localization',
            sandbox     : false,
            items : [
                'localization/901_missing.t.js',
                'localization/902_unused.t.js'
            ]
        },
        {
            group : 'Export',
            items : [
                'export/001_export_sequence.t.js',
                'export/002_export.t.js',
                'export/003_export_rows_vertical.t.js',
                'export/004_export_multipage_columns.t.js',
                'export/005_export_rows_horizontal.t.js',
                'export/006_export_subclassing.t.js',
                'export/008_export_dialog.t.js',
                'export/009_export_dialog_date_format.t.js',
                'export/010_export_from_panel.t.js',
                'export/011_export_modes.t.js',
                'export/012_export_template_methods.t.js'
            ]
        }
    ];

    var appendVersion = function (items, version) {
        for (var i = 0; i < items.length; i++) {
            var url = items[i];

            if (url) {
                if (typeof url === 'string') {
                    items[i] += (url.match(/\?/) ? '&' : '?Ext=') + version;
                } else if (url.url) {
                    url.url += (url.url.match(/\?/) ? '&' : '?Ext=') + version;
                } else if (url.items) {
                    appendVersion(url.items, version);
                }
            }
        }
    };

    // Append version number, test url currently has to be unique
    if (targetExtVersions.length > 1) {
        appendVersion(suite, extVersion);
    }

    return suite;
}


// Add one top group per supported Ext JS version
for (var i = 0; i < targetExtVersions.length; i++) {
    var extVersion = targetExtVersions[i];
    var root = extRoot || '../../extjs-' + extVersion;
    var extPaths = getExtPaths(root, 'ext-all-debug.js');

    topItems.push({
        group    : extRoot ? extRoot : ('Ext JS ' + extVersion),

        // Only expand latest supported extVersion
        expanded : i === targetExtVersions.length - 1,

        preload : [
            extPaths.js,
            extPaths.css,

            {
                url        : '../sch-all' + (debug ? '-debug' : '') + '.js',
                instrument : true
            },
            '../resources/css/sch-all.css'
        ],

        items : getTestSuite(root, extVersion)
    });
}

if (!extRoot && !isSmokeTest) {
    // Inject tests exercising the examples
    var exampleUrls =
            [
                ($.browser.msie ? null : 'bbc/bbc.html'),
                //'cell-plugin/cell-plugin.html',
                'charting/charting.html',
                'columnsummary/columnsummary.html',
                'configuration/configuration.html',
                'customheader/customheader.html',
                'dragselector-plugin/dragselector-plugin.html',
                'ebay/ebay.html',
                'event-groups/index.html',
                'event-tools/event-tools.html',
                'eventeditor/editor.html',
                'events/events.html',
                'eventtemplates/eventtemplates.html',
                'excelexport/excelexport.html',
                'externaldragdrop/externaldragdrop.html',
                'timeaxis/timeaxis.html',
                'googlespreadsheet/spreadsheet.html',
                // until the Ext JS bug is fixed
                'grouping/grouping.html',
                ($.browser.msie ? null : 'html5/html5.html'),
                'linesandzones/linesandzones.html',
                'localization/localization.html',
                'meetup/meetup.html',

                'mvc/index.html',

                'pan-plugin/pan-plugin.html',
                'performance/performance.html',
                'print/print.html',
                'radiotime/radiotime.html',
                'rowheight/rowheight.html',
                'rtl/rtl.html',
                'scrollto/scrollto.html',
                'simpleeditor/simpleeditor.html',

                'timegap/timegap.html',
                'timeresolution/timeresolution.html',
                'tree/tree.html',
                'validation/validation.html',
                'vertical-orientation/vertical.html',
                'weekview/weekview.html',
                'zooming/zooming.html'
            ],
        exampleItems = [];

    for (var i = 0; i < exampleUrls.length; i++) {
        if (exampleUrls[i]) {
            exampleItems.push({
                hostPageUrl : '../examples/' + exampleUrls[i],
                url         : 'sdk_examples/10000_sanity.t.js?' + exampleUrls[i],
                name        : '[' + i + '] ' + exampleUrls[i]
            });
        }
    }

    topItems.push(
        {
            group : 'SDK Examples',

            expanded           : false,
            autoCheckGlobals   : false,
            overrideSetTimeout : false,

            items : exampleItems.concat(
                location.href.match(/ExtScheduler3\.x-current/) ?
                    []
                    :
                    [
                        {
                            hostPageUrl : '../examples/event-groups/index.html',
                            preload     : ['../util/expiration.js'],

                            url : 'sdk_examples/10001_expiration.t.js'
                        },
                        {
                            group : 'Functional Tests',
                            items : [
                                {
                                    hostPageUrl : '../examples/rowheight/rowheight.html',
                                    url         : 'sdk_examples/rowheight.t.js'
                                },
                                {
                                    hostPageUrl : '../examples/configuration/configuration.html',
                                    url         : 'sdk_examples/configuration.t.js'
                                },
                                {
                                    hostPageUrl : '../examples/eventeditor/editor.html',
                                    url         : 'sdk_examples/eventeditor.t.js'
                                },
                                {
                                    hostPageUrl : '../examples/validation/validation.html',
                                    url         : 'sdk_examples/async_dragdrop_zindex.t.js'
                                },
                                {
                                    hostPageUrl : '../examples/linesandzones/linesandzones.html',
                                    url         : 'sdk_examples/linesandzones.t.js'
                                }
                            ]
                        }
                    ]
            )
        }
    );
}

if (isSmokeTest) {

    topItems[0].items = topItems[0].items.filter(function (group) {
        return group.group in {
            'Sanity'          : 1,
            'Util'            : 1,
            'Data components' : 1
        };
    });
}

Harness.start.apply(Harness, topItems);

Harness.on('teststart', function(ev, test) {
    var console = test.global.console;

    if (console) {
        console.error = console.warn = function() {
            test.fail([].join.apply(arguments));
        };
    }
});
