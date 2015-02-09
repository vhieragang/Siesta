<?php

namespace Bryntum\Scheduler;

class EventSyncHandler extends \Bryntum\CRUD\SyncHandler
{

    private $scheduler;

    public function __construct(&$scheduler)
    {
        $this->scheduler = &$scheduler;
    }

    public function prepareData(&$data)
    {
        if (isset($data['Resizable'])) {
            $data['Resizable'] = @$data['Resizable'] ? 1 : 0;
        }
        if (isset($data['Draggable'])) {
            $data['Draggable'] = @$data['Draggable'] ? 1 : 0;
        }

        $result = array();

        $resourceIds = $this->scheduler->phantomIdMap['resources'];

        $id = @$data['ResourceId'];

        // get newly created ResourceId if this is a reference to a phantom resource
        if (isset($resourceIds[$id])) {
            // use & return actual ResourceId
            $data['ResourceId'] = $result['ResourceId'] = $resourceIds[$id];
        }

        return $result;
    }

    public function add(&$event)
    {
        $response = $this->prepareData($event);
        $this->scheduler->saveEvent($event);
        return $response;
    }

    public function update(&$event)
    {
        $response = $this->prepareData($event);
        $this->scheduler->saveEvent($event);
        return $response;
    }

    public function remove($event)
    {
        $this->scheduler->removeEvent($event);
        return array();
    }
}
