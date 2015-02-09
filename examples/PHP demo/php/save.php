<?php

use Bryntum\CRUD, Bryntum\Scheduler;

try {
    // initialize application
    include 'init.php';

    $request = json_decode(file_get_contents('php://input'), true);

    $response = array(
        'success'   => false,
        'requestId' => $request['requestId']
    );

    $app->db->beginTransaction();

    // Here we reject client's changes if we suspect that they are outdated
    // considering difference between server and client revisions.
    // You can get rid of this call if you don't need such behavior.
    $app->checkRevision($request['revision']);

    $resourceHandler = $eventHandler = null;

    // if we have resources to sync
    if (isset($request['resources'])) {
        $resourceHandler = new Scheduler\ResourceSyncHandler($app);
        $response['resources'] = $resourceHandler->handle($request['resources'], CRUD\ADDED_AND_UPDATED_ROWS);
    }

    // if we have events to sync
    if (isset($request['events'])) {
        $eventHandler = new Scheduler\EventSyncHandler($app);
        $response['events'] = $eventHandler->handle($request['events'], CRUD\ADDED_AND_UPDATED_ROWS);
    }

    // then let's process records removals

    if ($eventHandler)
        $response['events'] = $eventHandler->handleRemoved($request['events'], $response['events']);

    if ($resourceHandler)
        $response['resources'] = $resourceHandler->handleRemoved($request['resources'], $response['resources']);

    $app->db->commit();

    $response['success'] = true;
    // return server revision mark
    $response['revision'] = $app->getRevision();

    die(json_encode($response));

// handle exceptions gracefully
} catch (Exception $e) {
    $app->db->rollback();

    $response['success'] = false;
    $response['message'] = $e->getMessage();
    $response['code'] = $e->getCode();
    die(json_encode($response));
}

