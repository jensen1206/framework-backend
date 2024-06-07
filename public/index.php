<?php

use App\Kernel;

if (!is_dir(dirname(__DIR__). '/vendor' )) {

    if (!is_file(dirname(__DIR__) . '/composer.phar')) {
        if (copy('https://getcomposer.org/download/latest-stable/composer.phar', dirname(__DIR__) . '/composer.phar')) {
            chmod(dirname(__DIR__) . '/composer.phar', 0755);
        }
    }
    $re = '~\d.*~';
    preg_match($re, PHP_DATADIR, $matches);
    $matches ? $v = $matches[0] : $v = '';
    $phpData = 'php' . $v;
    $dir = dirname(__DIR__) . DIRECTORY_SEPARATOR;
    $cmd = sprintf('%s %scomposer.phar install --working-dir="%s"', $phpData, $dir, $dir);
    set_time_limit(60);
    echo 'composer install';
    exec($cmd);
}
require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool)$context['APP_DEBUG']);
};
