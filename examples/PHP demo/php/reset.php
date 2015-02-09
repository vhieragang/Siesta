<?php
// initialize application
include 'init.php';

$app->db->exec('alter table events drop foreign key fk_events_resources');

$app->db->query('truncate table options');
$app->db->query('truncate table events');
$app->db->query('truncate table resources');

$app->db->exec('alter table events add constraint fk_events_resources foreign key(ResourceId) references resources (Id)');

$app->insert('options', array('name' => 'revision', 'value' => '1'));
