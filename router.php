<?php
    $filename = __DIR__."/api".$_SERVER["REQUEST_URI"] . ".php";

    if (file_exists($filename)) {
        header("Access-Control-Allow-Origin: *");
        include($filename);
    } else {
        echo "{\"success\":false,\"error\":\"Неправильный запрос\"}";
    }
?>
