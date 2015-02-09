<?php

namespace Bryntum\Scheduler;

class ResourceSyncHandler extends \Bryntum\CRUD\SyncHandler
{

    private $scheduler;

    public function __construct(&$scheduler)
    {
        $this->scheduler = &$scheduler;
        $this->phantomIdMap = &$scheduler->phantomIdMap['resources'];
    }

    public function add(&$resource)
    {
        $this->scheduler->saveResource($resource);
        return array();
    }

    public function update(&$resource)
    {
        $this->scheduler->saveResource($resource);
        return array();
    }

    public function remove($resource)
    {
        $this->scheduler->removeResource($resource);
        return array();
    }

    protected function onRecordAdded($record, &$recordResponse, $phantomId)
    {
        parent::onRecordAdded($record, $recordResponse, $phantomId);

        // let's keep phantom Id to real Id mapping
        $this->phantomIdMap[$phantomId] = $recordResponse['Id'];

        return $recordResponse;
    }
}
