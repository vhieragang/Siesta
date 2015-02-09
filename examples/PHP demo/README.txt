/*
* PHP Scheduler Demo
* Bryntum AB ©2012
*/

This is a demo showing our Ext Scheduler component running with a PHP backend.

Requirements to run this example :
 - Any web server (Apache or similar)
 - PHP 5+
 - MySQL 5+


SETUP
-------------------------

1. First setup the database tables. It can be easily done using the `sql/setup.sql` file included with the demo. Run
the script file in the SQL manager of your choice (like phpMyAdmin).

2. Now you need to set the database connection parameters in the `php/config.php` file. To do this first you need to copy existing `php/config.template.php` file to `php/config.php`.
Then edit newly created `php/config.php` to change host, username, password and database name to correct values.

3. Launch `index.html` in your browser.
