/*
* JAVA Scheduler Demo
* Bryntum AB ©2014
*/

This is a demo showing our Ext Scheduler component running with a JAVA backend.

Required software
=================

Requirements for this example :
- Aoache Maven (http://maven.apache.org/)
- Apache Tomcat 7+ application server
- JDK 7+ (OpenJDK 7+ can be used as well)
- MySQL 5+

Database connection setup
=========================

The first step is to run the SQL scripts to setup the database tables. It is done easily utilising the sql/setup.sql file included with the demo. After running
the file in the SQL manager of your choice (like phpMyAdmin), you need to set the DB parameters in `src/main/webapp/META-INF/context.xml` file.
Change host, username, password and database name to the correct values.
For example here we have connection set to use user name "root" and password "password" while database is located at "localhost" server and has "bryntum_scheduler" name:

  <Resource name="jdbc/TestDB" auth="Container" type="javax.sql.DataSource"
       maxActive="100" maxIdle="30" maxWait="10000"
       username="root" password="password" driverClassName="com.mysql.jdbc.Driver"
       url="jdbc:mysql://localhost:3306/bryntum_scheduler"/>

See this page for extra details: http://tomcat.apache.org/tomcat-7.0-doc/jndi-datasource-examples-howto.html

Building the example
====================

To build the example proceed to its folder and run this command:

mvn package

After the command completion there will be created a new "target" folder where you can find "scheduler-crud-1.0.war" file.
Next step to be done is deploying this file to Tomcat application server.

Application deploy
==================

The simplest way to deploy the application is to use special web-interface provided by Tomcat. We need to open "Tomcat Web Application Manager" page in a web browser (by default it's URL is: tomcat_host:tomcat_port/manager/html).
On this page under the list of deployed application you can find a section named "Deploy" and its subsection "WAR file to deploy".
There you have to pick built "scheduler-crud-1.0.war" file using "Select WAR file to upload" input box and then click "Deploy" button.
After this Tomcat will deploy the application to the following URL:

tomcat_host:tomcat_port/scheduler-crud-1.0/

So after opening this page in a browser you will see the running example.

Note: If you want to deploy the application to some another URL please refer Tomcat docs: http://tomcat.apache.org/tomcat-7.0-doc/deployer-howto.html).

Note: There is also a possibility to setup application deployment using "maven" tool that we used for application building.
So "mvn tomcat:deploy" command (or "mvn tomcat:redeploy" in case of re-deploying) will automatically build the application and deploy it to the server.
Details can be found here: http://tomcat.apache.org/maven-plugin-2.2/tomcat7-maven-plugin/usage.html
Also there are a number of related HOWTOs that can be googled easily.
