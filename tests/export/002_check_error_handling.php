<?php
header("HTTP/1.1 500 Internal Server Error", true, 500);
throw new Exception("Uncaught exception!");

