Ext.data.JsonP.Sch_widget_ExportDialogForm({"tagname":"class","name":"Sch.widget.ExportDialogForm","autodetected":{"aliases":true,"alternateClassNames":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"ExportDialogForm.js","href":"ExportDialogForm.html#Sch-widget-ExportDialogForm"}],"private":true,"extends":"Ext.form.Panel","aliases":{},"alternateClassNames":[],"mixins":[],"requires":["Ext.ProgressBar","Ext.data.Store","Ext.form.FieldContainer","Ext.form.field.Checkbox","Ext.form.field.ComboBox","Ext.form.field.Date","Sch.widget.ResizePicker"],"uses":[],"members":[{"name":"autoHeight","tagname":"property","owner":"Sch.widget.ExportDialogForm","id":"property-autoHeight","meta":{"private":true}},{"name":"bodyPadding","tagname":"property","owner":"Sch.widget.ExportDialogForm","id":"property-bodyPadding","meta":{"private":true}},{"name":"border","tagname":"property","owner":"Sch.widget.ExportDialogForm","id":"property-border","meta":{"private":true}},{"name":"buildExporterStore","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-buildExporterStore","meta":{"private":true}},{"name":"createFields","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-createFields","meta":{"private":true}},{"name":"createProgressBar","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-createProgressBar","meta":{"private":true}},{"name":"disableFields","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-disableFields","meta":{"private":true}},{"name":"getValues","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-getValues","meta":{"private":true}},{"name":"hideProgressBar","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-hideProgressBar","meta":{"private":true}},{"name":"initComponent","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-initComponent","meta":{"private":true}},{"name":"isValid","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-isValid","meta":{"private":true}},{"name":"onExporterChange","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-onExporterChange","meta":{"protected":true}},{"name":"onRangeChange","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-onRangeChange","meta":{"private":true}},{"name":"showProgressBar","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-showProgressBar","meta":{"private":true}},{"name":"updateProgressBar","tagname":"method","owner":"Sch.widget.ExportDialogForm","id":"method-updateProgressBar","meta":{"private":true}}],"code_type":"ext_define","id":"class-Sch.widget.ExportDialogForm","short_doc":"Form for Sch.widget.ExportDialog. ...","component":false,"superclasses":["Ext.form.Panel"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.form.Panel<div class='subclass '><strong>Sch.widget.ExportDialogForm</strong></div></div><h4>Requires</h4><div class='dependency'>Ext.ProgressBar</div><div class='dependency'>Ext.data.Store</div><div class='dependency'>Ext.form.FieldContainer</div><div class='dependency'>Ext.form.field.Checkbox</div><div class='dependency'>Ext.form.field.ComboBox</div><div class='dependency'>Ext.form.field.Date</div><div class='dependency'><a href='#!/api/Sch.widget.ResizePicker' rel='Sch.widget.ResizePicker' class='docClass'>Sch.widget.ResizePicker</a></div><h4>Files</h4><div class='dependency'><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm' target='_blank'>ExportDialogForm.js</a></div></pre><div class='doc-contents'><div class='rounded-box private-box'><p><strong>NOTE:</strong> This is a private utility class for internal use by the framework. Don't rely on its existence.</p></div><p>Form for <a href=\"#!/api/Sch.widget.ExportDialog\" rel=\"Sch.widget.ExportDialog\" class=\"docClass\">Sch.widget.ExportDialog</a>. This is a private class and can be overriden by providing <code>formPanel</code> option to\n<a href=\"#!/api/Sch.plugin.Export-cfg-exportDialogConfig\" rel=\"Sch.plugin.Export-cfg-exportDialogConfig\" class=\"docClass\">exportDialogConfig</a>.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-autoHeight' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-property-autoHeight' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-property-autoHeight' class='name expandable'>autoHeight</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-bodyPadding' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-property-bodyPadding' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-property-bodyPadding' class='name expandable'>bodyPadding</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'10 10 0 10'</code></p></div></div></div><div id='property-border' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-property-border' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-property-border' class='name expandable'>border</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>false</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-buildExporterStore' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-buildExporterStore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-buildExporterStore' class='name expandable'>buildExporterStore</a>( <span class='pre'></span> ) : Ext.data.Store<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Builds a store to be used for the Export mode combobox ...</div><div class='long'><p>Builds a store to be used for the <code>Export mode</code> combobox</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'></span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Ext.data.Store</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-createFields' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-createFields' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-createFields' class='name expandable'>createFields</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-createProgressBar' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-createProgressBar' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-createProgressBar' class='name expandable'>createProgressBar</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-disableFields' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-disableFields' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-disableFields' class='name expandable'>disableFields</a>( <span class='pre'>value</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-getValues' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-getValues' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-getValues' class='name expandable'>getValues</a>( <span class='pre'>asString, dirtyOnly, includeEmptyText, useDataValues</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>asString</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>dirtyOnly</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>includeEmptyText</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>useDataValues</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-hideProgressBar' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-hideProgressBar' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-hideProgressBar' class='name expandable'>hideProgressBar</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-initComponent' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-initComponent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-initComponent' class='name expandable'>initComponent</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-isValid' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-isValid' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-isValid' class='name expandable'>isValid</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onExporterChange' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-onExporterChange' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-onExporterChange' class='name expandable'>onExporterChange</a>( <span class='pre'>field, exporterId</span> )<span class=\"signature\"><span class='protected' >protected</span></span></div><div class='description'><div class='short'>This method is called after user selects an export mode in the corresponding field. ...</div><div class='long'><p>This method is called after user selects an export mode in the corresponding field.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>field</span> : Ext.form.field.Field<div class='sub-desc'><p>Reference to the form field</p>\n</div></li><li><span class='pre'>exporterId</span> : String<div class='sub-desc'><p>Selected exporter identifier</p>\n</div></li></ul></div></div></div><div id='method-onRangeChange' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-onRangeChange' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-onRangeChange' class='name expandable'>onRangeChange</a>( <span class='pre'>field, newValue</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>field</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>newValue</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-showProgressBar' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-showProgressBar' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-showProgressBar' class='name expandable'>showProgressBar</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-updateProgressBar' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.widget.ExportDialogForm'>Sch.widget.ExportDialogForm</span><br/><a href='source/ExportDialogForm.html#Sch-widget-ExportDialogForm-method-updateProgressBar' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.widget.ExportDialogForm-method-updateProgressBar' class='name expandable'>updateProgressBar</a>( <span class='pre'>value, text</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>text</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{"private":true}});