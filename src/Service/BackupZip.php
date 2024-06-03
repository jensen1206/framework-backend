<?php

namespace App\Service;
use ZipArchive;

class BackupZip extends ZipArchive
{
    public function addDir($location, $name): void
    {
        $this->addEmptyDir($name);
        $this->addDirDo($location, $name);
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