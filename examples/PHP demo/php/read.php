<?php

try {
    // initialize application
    include 'init.php';

    $request = json_decode( file_get_contents('php://input'), true );

    $response = array(
        'success'   => false,
        'requestId' => $request['requestId']
    );

    $storeParams = array();

    foreach ($request['stores'] as $store) {
        if (is_array($store)) {
            // keep request params for the store
            $storeParams[$store['storeId']] = $store;
        } else {
            // if no params let's keep null
            $storeParams[$store] = null;
        }
    }

    // if EventStore was requested for loading
    if (isset($storeParams['events'])) {
        $response['events'] = array(
            // get rows of requested page
            'rows' => $app->getEvents($storeParams['events']),
            // get total number of found events
            'total' => $app->getFoundRows()
        );
    }

    // if ResourceStore was requested for loading
    if (isset($storeParams['resources'])) {
        $response['resources'] = array(
            // get rows of requested page
            'rows' => $app->getResources($storeParams['resources']),
            // get total number of found resources
            'total' => $app->getFoundRows()
        );
    }

    $response['success'] = true;
    // return server revision mark
    $response['revision'] = $app->getRevision();

    die(json_encode($response));

// handle exceptions gracefully
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
    $response['code'] = $e->getCode();
    die(json_encode($response));
}

