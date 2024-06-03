<?php
/**
 * define BASE_URL
 */
$archiv = '###ARCHIV_FILE###';
$err = filter_input(INPUT_GET, 'err', FILTER_UNSAFE_RAW) ?? null;
$error = '';
$protocol = 'http://';
if (isset($_SERVER['HTTPS']) &&
    ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1) ||
    isset($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
    $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') {
    $protocol = 'https://';
}

$baseUrl = $protocol . $_SERVER['HTTP_HOST'];
$redirect = $baseUrl . '/install';
const ROOT_DIR = __DIR__ . DIRECTORY_SEPARATOR;

if (!is_file(ROOT_DIR . $archiv)) {
 echo  $error = 'Falsche Installationsdatei';
}
if(!$error) {
    $zip = new ZipArchive();
    if ($zip->open(ROOT_DIR . $archiv) === TRUE) {
        $zip->extractTo(ROOT_DIR . DIRECTORY_SEPARATOR);
        $zip->close();
        header("Location: $redirect");
    }
}








