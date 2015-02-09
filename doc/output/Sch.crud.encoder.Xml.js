Ext.data.JsonP.Sch_crud_encoder_Xml({"tagname":"class","name":"Sch.crud.encoder.Xml","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"Xml.js","href":"Xml.html#Sch-crud-encoder-Xml"}],"abstract":true,"aliases":{},"alternateClassNames":[],"extends":"Ext.Base","mixins":[],"requires":["Ext.XTemplate"],"uses":[],"members":[{"name":"format","tagname":"property","owner":"Sch.crud.encoder.Xml","id":"property-format","meta":{"private":true}},{"name":"stringReplaces","tagname":"property","owner":"Sch.crud.encoder.Xml","id":"property-stringReplaces","meta":{"private":true}},{"name":"decode","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-decode","meta":{}},{"name":"decodeRecord","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-decodeRecord","meta":{"private":true}},{"name":"decodeRecords","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-decodeRecords","meta":{"private":true}},{"name":"decodeStore","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-decodeStore","meta":{"private":true}},{"name":"encode","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-encode","meta":{}},{"name":"encodeRecord","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-encodeRecord","meta":{"private":true}},{"name":"encodeRecords","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-encodeRecords","meta":{"private":true}},{"name":"encodeStoreChanges","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-encodeStoreChanges","meta":{"private":true}},{"name":"encodeString","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-encodeString","meta":{"private":true}},{"name":"getElementByTagName","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-getElementByTagName","meta":{"private":true}},{"name":"getElementsByTagName","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-getElementsByTagName","meta":{"private":true}},{"name":"stringToXML","tagname":"method","owner":"Sch.crud.encoder.Xml","id":"method-stringToXML","meta":{"private":true}}],"code_type":"ext_define","id":"class-Sch.crud.encoder.Xml","short_doc":"Implements data encoding functional that should be mixed to a Sch.crud.AbstractManager sub-class. ...","component":false,"superclasses":["Ext.Base"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.Base<div class='subclass '><strong>Sch.crud.encoder.Xml</strong></div></div><h4>Requires</h4><div class='dependency'>Ext.XTemplate</div><h4>Files</h4><div class='dependency'><a href='source/Xml.html#Sch-crud-encoder-Xml' target='_blank'>Xml.js</a></div></pre><div class='doc-contents'><p>Implements data encoding functional that should be mixed to a <a href=\"#!/api/Sch.crud.AbstractManager\" rel=\"Sch.crud.AbstractManager\" class=\"docClass\">Sch.crud.AbstractManager</a> sub-class.\nUses <em>XML</em> as an encoding system.</p>\n\n<pre><code>// let's make new CrudManager using AJAX as a transport system and XML for encoding\nExt.define('MyCrudManager', {\n    extend  : '<a href=\"#!/api/Sch.crud.AbstractManager\" rel=\"Sch.crud.AbstractManager\" class=\"docClass\">Sch.crud.AbstractManager</a>',\n\n    mixins  : ['<a href=\"#!/api/Sch.crud.encoder.Xml\" rel=\"Sch.crud.encoder.Xml\" class=\"docClass\">Sch.crud.encoder.Xml</a>', '<a href=\"#!/api/Sch.crud.transport.Ajax\" rel=\"Sch.crud.transport.Ajax\" class=\"docClass\">Sch.crud.transport.Ajax</a>']\n});\n</code></pre>\n\n<h1>Request structure</h1>\n\n<p>Load request example:</p>\n\n<pre><code>&lt;load requestId=\"123890\"&gt;\n    &lt;store id=\"store1\" page=\"1\" pageSize=\"10\"/&gt;\n    &lt;store id=\"store2\"/&gt;\n    &lt;store id=\"store3\"/&gt;\n&lt;/load&gt;\n</code></pre>\n\n<p>Sync request:</p>\n\n<pre><code>&lt;sync requestId=\"123890\" revision=\"123\"&gt;\n    &lt;store id=\"store1\"&gt;\n        &lt;added&gt;\n            &lt;record&gt;\n                &lt;field id=\"$PhantomId\"&gt;q1w2e3r4t5&lt;/field&gt;\n                &lt;field id=\"SomeField\"&gt;smth&lt;/field&gt;\n                ...\n            &lt;/record&gt;\n            ...\n        &lt;/added&gt;\n        &lt;updated&gt;\n            &lt;record&gt;\n                &lt;field id=\"Id\"&gt;123&lt;/field&gt;\n                &lt;field id=\"SomeField\"&gt;new value&lt;/field&gt;\n                ...\n            &lt;/record&gt;\n            ...\n        &lt;/updated&gt;\n        &lt;removed&gt;\n            &lt;record&gt;\n                &lt;field id=\"Id\"&gt;345&lt;/field&gt;\n            &lt;/record&gt;\n            ...\n        &lt;/removed&gt;\n    &lt;/store&gt;\n\n    &lt;store id=\"store2\"&gt;\n        &lt;added&gt;...&lt;/added&gt;\n        &lt;updated&gt;...&lt;/updated&gt;\n        &lt;removed&gt;...&lt;/removed&gt;\n    &lt;/store&gt;\n&lt;/sync&gt;\n</code></pre>\n\n<h1>Response structure</h1>\n\n<p>Load response example:</p>\n\n<pre><code>&lt;data requestId=\"123890\" revision=\"123\" success=\"true\"&gt;\n\n    &lt;store id=\"store1\"&gt;\n        &lt;rows total=\"5\"&gt;\n            &lt;record&gt;\n                &lt;field id=\"Id\"&gt;9000&lt;/field&gt;\n                &lt;field id=\"SomeField\"&gt;xxxx&lt;/field&gt;\n                ...\n            &lt;/record&gt;\n            &lt;record&gt;\n                &lt;field id=\"Id\"&gt;123&lt;/field&gt;\n                &lt;field id=\"SomeField\"&gt;yyyy&lt;/field&gt;\n                ...\n            &lt;/record&gt;\n        &lt;/rows&gt;\n    &lt;/store&gt;\n\n    &lt;store id=\"store2\"&gt;\n        &lt;rows total=\"2\"&gt;\n            &lt;record&gt;\n                &lt;field id=\"Id\"&gt;1&lt;/field&gt;\n                &lt;field id=\"Field1\"&gt;aaa&lt;/field&gt;\n                ...\n            &lt;/record&gt;\n            &lt;record&gt;\n                &lt;field id=\"Id\"&gt;2&lt;/field&gt;\n                &lt;field id=\"Field1\"&gt;bbb&lt;/field&gt;\n                ...\n            &lt;/record&gt;\n        &lt;/rows&gt;\n    &lt;/store&gt;\n\n    &lt;store id=\"store3\"&gt;\n        &lt;rows total=\"2\"&gt;\n            &lt;record&gt;\n                &lt;field id=\"Id\"&gt;1&lt;/field&gt;\n                &lt;field id=\"Field2\"&gt;aaa&lt;/field&gt;\n                ...\n            &lt;/record&gt;\n            &lt;record&gt;\n                &lt;field id=\"Id\"&gt;2&lt;/field&gt;\n                &lt;field id=\"Field2\"&gt;bbb&lt;/field&gt;\n                ...\n            &lt;/record&gt;\n        &lt;/rows&gt;\n    &lt;/store&gt;\n&lt;/data&gt;\n</code></pre>\n\n<p>Sync response:</p>\n\n<pre><code>&lt;data requestId=\"123890\" success=\"true\" revision=\"124\"&gt;\n    &lt;store id=\"store1\"&gt;\n        &lt;rows&gt;\n            &lt;record&gt;\n                &lt;field id=\"$PhantomId\"&gt;q1w2e3r4t5&lt;/field&gt;\n                &lt;field id=\"Id\"&gt;9000&lt;/field&gt;\n            &lt;/record&gt;\n            &lt;record&gt;\n                &lt;field id=\"Id\"&gt;123&lt;/field&gt;\n                &lt;field id=\"SomeField2\"&gt;2013-08-01&lt;/field&gt;\n            &lt;/record&gt;\n        &lt;/rows&gt;\n        &lt;removed&gt;\n            &lt;record&gt;\n                &lt;field id=\"Id\"&gt;345&lt;/field&gt;\n            &lt;/record&gt;\n            ...\n        &lt;/removed&gt;\n    &lt;/store&gt;\n\n    &lt;store id=\"store2\"&gt;\n        &lt;rows&gt;...&lt;/rows&gt;\n        &lt;removed&gt;...&lt;/removed&gt;\n    &lt;/store&gt;\n&lt;/data&gt;\n</code></pre>\n\n<h1>Error response</h1>\n\n<pre><code>&lt;data requestId=\"123890\" success=\"true\" code=\"13\"&gt;\n    &lt;message&gt;Error description goes here&lt;/message&gt;\n&lt;/data&gt;\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-format' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-property-format' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-property-format' class='name expandable'>format</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'xml'</code></p></div></div></div><div id='property-stringReplaces' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-property-stringReplaces' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-property-stringReplaces' class='name expandable'>stringReplaces</a> : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>[[/&amp;/g, '&amp;amp;'], [/&lt;/g, '&amp;lt;'], [/&gt;/g, '&amp;gt;'], [/&quot;/g, '&amp;quot;']]</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-decode' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-decode' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-decode' class='name expandable'>decode</a>( <span class='pre'>response</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Decodes (parses) a XML response string to an object. ...</div><div class='long'><p>Decodes (parses) a <em>XML</em> response string to an object. The formats of processable server responses are displayed in an intro.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>response</span> : Object<div class='sub-desc'><p>The response to decode.</p>\n</div></li></ul></div></div></div><div id='method-decodeRecord' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-decodeRecord' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-decodeRecord' class='name expandable'>decodeRecord</a>( <span class='pre'>node</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-decodeRecords' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-decodeRecords' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-decodeRecords' class='name expandable'>decodeRecords</a>( <span class='pre'>rows</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>rows</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-decodeStore' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-decodeStore' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-decodeStore' class='name expandable'>decodeStore</a>( <span class='pre'>store</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>store</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-encode' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-encode' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-encode' class='name expandable'>encode</a>( <span class='pre'>request</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Encodes an request object to XML encoded string. ...</div><div class='long'><p>Encodes an request object to <em>XML</em> encoded string. The formats of requests are displayed in an intro.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>request</span> : Object<div class='sub-desc'><p>The request to encode.</p>\n</div></li></ul></div></div></div><div id='method-encodeRecord' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-encodeRecord' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-encodeRecord' class='name expandable'>encodeRecord</a>( <span class='pre'>record</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>record</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-encodeRecords' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-encodeRecords' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-encodeRecords' class='name expandable'>encodeRecords</a>( <span class='pre'>records</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>records</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-encodeStoreChanges' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-encodeStoreChanges' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-encodeStoreChanges' class='name expandable'>encodeStoreChanges</a>( <span class='pre'>store, changes</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>store</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>changes</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-encodeString' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-encodeString' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-encodeString' class='name expandable'>encodeString</a>( <span class='pre'>text</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Translates a string characters to XML safe ones ...</div><div class='long'><p>Translates a string characters to XML safe ones</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>text</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-getElementByTagName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-getElementByTagName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-getElementByTagName' class='name expandable'>getElementByTagName</a>( <span class='pre'>node, name</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>name</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-getElementsByTagName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-getElementsByTagName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-getElementsByTagName' class='name expandable'>getElementsByTagName</a>( <span class='pre'>node, name</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>search specified nodes only in a first level of children ...</div><div class='long'><p>search specified nodes only in a first level of children</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>node</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>name</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-stringToXML' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Sch.crud.encoder.Xml'>Sch.crud.encoder.Xml</span><br/><a href='source/Xml.html#Sch-crud-encoder-Xml-method-stringToXML' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Sch.crud.encoder.Xml-method-stringToXML' class='name expandable'>stringToXML</a>( <span class='pre'>text</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>text</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{"abstract":true}});