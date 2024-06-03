<?php

namespace App\Service;

use App\AppHelper\EmHelper;
use App\Entity\SystemSettings;
use App\Settings\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Exception;

use ScssPhp\ScssPhp\CompilationResult;
use ScssPhp\ScssPhp\Compiler;

use ScssPhp\ScssPhp\Exception\SassException;
use ScssPhp\ScssPhp\OutputStyle;

class ScssCompiler
{
    use Settings;

    protected string $src_dir;
    protected string $dest_dir;
    protected string $cache_dir;
    protected string $formatter;
    protected string $scss_file_name;
    protected string $css_file_name;
    protected string $destination_uri;
    protected string $map_option;
    protected array $settings;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly EmHelper               $emHelper,
        private readonly string                 $publicPath,
        private readonly string                 $projectDir
    )
    {

        if($this->emHelper->system_is_installed('SUPER_ADMIN')) {
            $appSettings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
            $this->settings = $appSettings->getApp();

            $this->src_dir = $this->publicPath . 'scss';
            $this->dest_dir = $this->publicPath . 'css';
            $this->cache_dir = $this->publicPath . $this->settings['scss_cache_dir'];

            $this->formatter = $this->settings['scss_map_output'];
            $this->map_option = $this->settings['scss_map_option'];
        }
    }

    /**
     * @throws Exception
     * @throws SassException
     */
    public function compileScssFile()
    {
        if (!is_dir($this->src_dir)) {
            return null;
        }
        if (!$this->check_if_dir($this->src_dir)) {
            return null;
        }
        $src = array_diff(scandir($this->src_dir), array('..', '.'));
        if ($src) {
            foreach ($src as $tmp) {
                if (str_starts_with($tmp, '_')) {
                    continue;
                }
                $file = $this->src_dir . DIRECTORY_SEPARATOR . $tmp;
                if (!is_file($file)) {
                    continue;
                }
                $pi = pathinfo($file);
                if ($pi['extension'] === 'scss') {
                    $this->scss_file_name = $pi['basename'];
                    $this->css_file_name = $pi['filename'] . '.css';

                    $cssDestination = $this->dest_dir . DIRECTORY_SEPARATOR . $this->css_file_name;
                    $source = $this->src_dir . DIRECTORY_SEPARATOR . $pi['basename'];
                    $this->destination_uri = '/css/';

                    $this->scssCompiler($source, $cssDestination);
                }
            }
        }
    }

    /**
     * @throws SassException
     */
    public function scssCompiler($source, $out = null): CompilationResult|bool|int
    {
        ignore_user_abort(true);
        set_time_limit(100);

        $cacheArr = null;
        if ($this->settings['scss_cache_active']) {
            $this->check_if_dir($this->cache_dir);
            $cacheArr = ['cacheDir' => $this->cache_dir];
        }
        $scssCompiler = new Compiler($cacheArr);
        $pi = pathinfo($source);
        $scssCompiler->addImportPath($pi['dirname'] . '/');

        switch ($this->formatter) {
            case 'expanded':
                $scssCompiler->setOutputStyle(OutputStyle::EXPANDED);
                break;
            case 'compressed':
                $scssCompiler->setOutputStyle(OutputStyle::COMPRESSED);
                break;
        }


        switch ($this->settings['scss_map_output']) {
            case 'expanded':
                $scssCompiler->setOutputStyle(OutputStyle::EXPANDED);
                break;
            case 'compressed':
                $scssCompiler->setOutputStyle(OutputStyle::COMPRESSED);
                break;
        }
        if ($this->settings['scss_map_active']) {

            switch ($this->settings['scss_map_option']) {

                case 'map_file':
                    $scssCompiler->setSourceMap(Compiler::SOURCE_MAP_FILE);
                    $scssCompiler->setSourceMapOptions(array(
                        'sourceMapWriteTo' => $this->dest_dir . DIRECTORY_SEPARATOR . $this->css_file_name . ".map",
                        'sourceMapURL' => $this->destination_uri . $this->css_file_name . ".map",
                        //  'sourceMapWriteTo' => $this->dest_dir . DIRECTORY_SEPARATOR . str_replace("/", "_", $this->css_file_name) . ".map",
                        // 'sourceMapURL' => '/scss/' . str_replace("/", "_", $this->css_file_name) . ".map",
                        'sourceMapFilename' => $this->css_file_name,
                        'sourceMapBasepath' => $this->src_dir
                    ));
                    break;
                case 'map_inline':
                    $scssCompiler->setSourceMap(Compiler::SOURCE_MAP_INLINE);
                    break;
            }
        } else {
            $scssCompiler->setSourceMap(Compiler::SOURCE_MAP_NONE);
        }

        $compiled = $scssCompiler->compileString(file_get_contents($source), $source);
        if ($this->settings['scss_map_option'] == 'map_file') {
            $mapDest = $this->dest_dir . DIRECTORY_SEPARATOR . $this->css_file_name . ".map";
            // $mapDest = $this->dest_dir. DIRECTORY_SEPARATOR . str_replace("/", "_", $this->css_file_name) . ".map";
            file_put_contents($mapDest, $compiled->getSourceMap());
        }
        if ($out !== null) {
            return file_put_contents($out, $compiled->getCss());
        }
        return $compiled;
    }

    public function start_scss_compiler_file(): void
    {
        try {
            $this->compileScssFile();
        } catch (Exception|SassException $e) {
            echo '<div class="d-flex justify-content-center flex-column position-absolute start-50 translate-middle bg-light p-3" style="z-index: 99999;width:95%;top:10rem;min-height: 150px; border: 2px solid #dc3545; border-radius: .5rem"> <span class="text-danger fs-5 fw-bolder d-flex align-items-center"><i class="bi bi-cpu fs-4 me-1"></i>SCSS Compiler Error:</span>   ' . $e->getMessage() . '</div>';
        }
    }


    public function delete_scss_compiler_cache($dir): void
    {
        if (is_dir($dir)) {
            $scanned_directory = array_diff(scandir($dir), array('..', '.'));
            foreach ($scanned_directory as $file) {
                $f = explode('_', $file);
                if (isset($f[0]) && $f[0] == 'scssphp') {
                    if (is_file($dir . DIRECTORY_SEPARATOR . $file)) {
                        @unlink($dir . DIRECTORY_SEPARATOR . $file);
                    }
                }
            }
        }
    }

    protected function check_if_dir($dir): bool
    {
        if (!is_dir($dir)) {
            if (!mkdir($dir, 0777, true)) {
                return false;
            }
        }
        return true;
    }
}