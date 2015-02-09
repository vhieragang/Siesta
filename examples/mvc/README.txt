/*
* MVC Scheduler Demo
* Bryntum AB ©2012
*/

This demo shows how our ExtScheduler component can be used with the ExtJS MVC architecture.
The example is also compatible with the Sencha CMD tool (http://docs.sencha.com/ext-js/4-1/#!/guide/command) after performing these changes :

	- First we need to create a folder with the ExtJS source that will be used by our example.
	  To do this we'll have to generate a new clean application using CMD, so run this command in your console/terminal :

	    sencha -sdk /path/to/sdk generate app MyApp /path/to/MyApp

	- Copy the 'ext' folder from the newly generated application to the folder for this example

	- Open .sencha/app/sencha.cfg file and edit 'app.classpath' configuration option changing /absolute_path_to_scheduler/js/Sch
	  to a proper path to the Ext Scheduler source folder.

	- Open index.html and uncomment the css/js imports (comment or remove the default ones)

	- Now you can build your application using :

	sencha app build

	- And refresh it by calling:

	sencha app refresh





