<?php

namespace App\Service;
use ZipArchive;

class FlxZip extends ZipArchive
{
     private array $options;


        public function __construct($options)
        {
            $this->options = $options;
        }

    public function addDir($location, $name): void
    {

        $notCopy = ['node_modules', 'cache', 'backups', 'migrations', 'archive', 'vendor', 'log'];
        if(!in_array(basename($name), $this->options)  ) {
                $this->addEmptyDir($name);
                $this->addDirDo($location, $name);
        }
    }

    private function addDirDo($location, $name): void
    {
        if($name){
            $name .= '/';
        }
        $location .= '/';

        $dir = opendir($location);
        while ($file = readdir($dir)) {


            if (filetype($location . $file) == 'dir' && preg_match("/^\./", $file)) {
                continue;
            }

            $do = (filetype($location . $file) == 'dir') ? 'addDir' : 'addFile';
            $this->$do($location . $file, $name . $file);
        }
    }
}