<?php

namespace App\AppHelper;

use App\Settings\Settings;
use DateTime;
use DateTimeZone;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\Font\NotoSans;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Exception;
use finfo;
use Imagick;
use ImagickException;

use stdClass;
use Symfony\Polyfill\Intl\Icu\IntlDateFormatter;


class Helper
{
    use Settings;

    private static $instance;

    /**
     * @return static
     */
    public static function instance(): self
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct()
    {
    }

    /**
     * @throws Exception
     */
    public function generate_rand_int():int
    {
        return random_int(1000000000000000, 9999999999999999);
    }

    public function generate_callback_pw($passwordlength = 8, $numNonAlpha = 1, $numNumberChars = 3, $useCapitalLetter = true): string
    {
        $numberChars = '123456789';
        $specialChars = '!$&=;%?*-.+@_';
        //$specialChars = '!$%&=?*-:;.,+~@_';
        $secureChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
        $stack = '';
        $stack = $secureChars;
        if ($useCapitalLetter) {
            $stack .= strtoupper($secureChars);
        }
        $count = $passwordlength - $numNonAlpha - $numNumberChars;
        $temp = str_shuffle($stack);
        $stack = substr($temp, 0, $count);
        if ($numNonAlpha > 0) {
            $temp = str_shuffle($specialChars);
            $stack .= substr($temp, 0, $numNonAlpha);
        }
        if ($numNumberChars > 0) {
            $temp = str_shuffle($numberChars);
            $stack .= substr($temp, 0, $numNumberChars);
        }
        return str_shuffle($stack);
    }

    public function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public function verifyPassword(string $password, string $passwordHash): bool
    {
        return password_verify($password, $passwordHash);
    }

    public function generate_identifier($key = ''): string
    {
        if ($key) {
            $updateKey = chunk_split($key, 6, '-');
            return substr($updateKey, 0, 30) . strtoupper($this->generate_callback_pw(2, 0, 1));
        } else {
            $updateKey = strtoupper($this->generate_callback_pw(24, 0, 8));
        }

        $updateKey = chunk_split($updateKey, 6, '-');
        return substr($updateKey, 0, 27);
    }

    /**
     * @throws Exception
     */
    public function random_string($length = 16): string
    {
        if (function_exists('random_bytes')) {
            $bytes = random_bytes($length);
            $str = bin2hex($bytes);
        } elseif (function_exists('openssl_random_pseudo_bytes')) {
            $bytes = openssl_random_pseudo_bytes($length);
            $str = bin2hex($bytes);
        } else {
            $str = md5(uniqid('random_app_root', true));
        }
        return $str;
    }

    public function htmlspecialchars_decode($string, $style = ENT_COMPAT): string
    {
        if (!$string) {
            return '';
        }
        $translation = array_flip(get_html_translation_table(HTML_SPECIALCHARS, $style));
        if ($style === ENT_QUOTES) {
            $translation['&#039;'] = '\'';
        }
        return strtr($string, $translation);
    }

    public function check_is_install_imagick(): bool
    {       // || ! class_exists( 'ImagickPixel', false )
        if (!extension_loaded('imagick') || !class_exists('Imagick', false)) {
            return false;
        }

        if (version_compare(phpversion('imagick'), '2.2.0', '<')) {
            return false;
        }

        return true;

    }

    public function pregWhitespace($string): string
    {
        if (!$string) {
            return '';
        }
        return trim(preg_replace('/\s+/', ' ', $string));
    }

    public function trim_string($string): string
    {
        if (!$string) {
            return '';
        }
        return trim(preg_replace('/\s+/', '', $string));
    }


    public function escape($value = null)
    {
        if (!is_string($value)) {
            return $value;
        }
        if (!$value) {
            return '';
        }
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }

    public function preg_escape($string): string
    {
        if (!$string) {
            return $string;
        }
        $string = trim(preg_replace('/\s+/', ' ', $string));
        return $this->escape($string);
    }

    public function generate_key_id($key = ''): string
    {
        if ($key) {
            $updateKey = strtoupper($key);
            return chunk_split($updateKey, 6, '-');
        } else {
            $updateKey = strtoupper($this->generate_callback_pw(24, 0, 8));
        }

        $updateKey = chunk_split($updateKey, 6, '-');
        return substr($updateKey, 0, 27);
    }

    /**
     * @throws ImagickException
     */
    public function convert_svg_to_image($uploadDir, $src, $bezeichnung, $out = 'png', $quality = 80, $webp = false): object
    {

        $destDir = $uploadDir . 'convert' . DIRECTORY_SEPARATOR;
        if (!is_dir($destDir)) {
            mkdir($destDir, 0755, true);
            $htaccess = 'Require all denied';
            // file_put_contents($destDir . DIRECTORY_SEPARATOR . '.htaccess', $htaccess);
        }

        $return = new stdClass();
        $return->status = false;
        if (!class_exists("Imagick")) {
            $return->msg = 'Imagick not installed!';
            return $return;
        }

        if (!is_file($src)) {
            $return->msg = 'File not found -' . __LINE__;
            return $return;
        }

        $im = new Imagick();
        $file = $src;
        $svg = file_get_contents($file);

        $im->readImageBlob($svg);

        switch ($out) {
            case 'png':
                $im->setImageFormat("png24");
                break;
            case 'jpg':
            case 'jpeg':
                $im->setImageFormat("jpeg");
                break;
        }

        if (!$bezeichnung) {
            $return->msg = 'Filename not found! - ' . __LINE__;
            return $return;
        }
        $im->setImageCompressionQuality($quality);
        $im->writeImage($destDir . $bezeichnung . '.' . $out);
        $im->clear();
        $im->destroy();

        $img = $destDir . $bezeichnung . '.' . $out;
        if (!is_file($img)) {
            $return->msg = 'Convert failed!';
            return $return;
        }
        if (is_file($src)) {
            unlink($src);
        }
        if ($webp) {
            return $this->convert_image_to_webp($uploadDir, $img, $bezeichnung, $quality);
        }
        $return->status = true;
        $return->path = $destDir;
        $return->file = $img;
        $return->file_name = $bezeichnung . '.' . $out;
        $return->mimeType = $this->get_mime_type($img);
        $return->size = $this->get_file_size($img);
        $return->folder = 'convert';
        return $return;
    }

    /**
     * @throws ImagickException
     */
    public function convert_webp_to_image($uploadDir, $src, $fileName, $quality = 80, $out = 'png'): object
    {
        $return = new stdClass();
        $return->status = false;
        if (!class_exists("Imagick")) {
            $return->msg = 'Imagick not installed!';
            return $return;
        }

        $destDir = $uploadDir . 'convert' . DIRECTORY_SEPARATOR;
        if (!is_dir($destDir)) {
            mkdir($destDir, 0755, true);
        }

        $dest = $destDir . $fileName . '.' . $out;
        $im = new Imagick();
        $file = $src;
        $image = file_get_contents($file);

        $im->readImageBlob($image);

        switch ($out) {
            case 'png':
                $im->setImageFormat("png24");
                break;
            case 'jpg':
            case 'jpeg':
                $im->setImageFormat("jpeg");
                $im->setCompression(Imagick::COMPRESSION_JPEG);
                break;
        }

        $im->setImageCompressionQuality($quality);
        $im->writeImage($destDir . $fileName . '.' . $out);
        $im->clear();
        $im->destroy();
        if (is_file($src)) {
            unlink($src);
        }
        if (is_file($dest)) {
            $return->status = true;
            $return->path = $destDir;
            $return->file = $dest;
            $return->file_name = $fileName . '.' . $out;
            $return->mimeType = $this->get_mime_type($dest);
            $return->size = $this->get_file_size($dest);
            $return->folder = 'convert';
            return $return;
        }

        return $return;

    }

    /**
     * @throws ImagickException
     */
    public function convert_image_to_webp($uploadDir, $src, $fileName, $quality = 80, $out = 'webp'): object
    {
        $return = new stdClass();
        $return->status = false;
        if (!class_exists("Imagick")) {
            $return->msg = 'Imagick not installed!';
            return $return;
        }

        $destDir = $uploadDir . 'convert' . DIRECTORY_SEPARATOR;
        if (!is_dir($destDir)) {
            mkdir($destDir, 0755, true);
            $htaccess = 'Require all denied';
            // file_put_contents($destDir . DIRECTORY_SEPARATOR . '.htaccess', $htaccess);
        }

        $dest = $destDir . $fileName . '.' . $out;
        $im = new Imagick();
        $im->pingImage($src);
        $im->readImage($src);
        $im->setImageFormat("webp");
        $im->setImageCompressionQuality($quality);
        $im->setOption('webp:lossless', 'true');
        $im->writeImage($dest);
        if (is_file($src)) {
            unlink($src);
        }
        if (is_file($dest)) {
            $return->status = true;
            $return->path = $destDir;
            $return->file = $dest;
            $return->file_name = $fileName . '.' . $out;
            $return->mimeType = $this->get_mime_type($dest);
            $return->size = $this->get_file_size($dest);
            $return->folder = 'convert';
            return $return;
        }

        return $return;
    }

    public function app_resize_image($file, $newWidth): object
    {

        $return = new stdClass();
        $return->status = false;


        if (!is_file($file)) {
            return $return;
        }

        list($src_width, $src_height, $src_type) = getimagesize($file);
        if ($src_width <= $newWidth) {
            $return->file = $file;
            $return->status = true;
            return $return;
        }

        $reduced_width = ($src_width - $newWidth);

        $reduced_radio = round(($reduced_width / $src_width) * 100, 2);
        $reduced_height = round(($src_height / 100) * $reduced_radio, 2);

        $newHeight = $src_height - $reduced_height;

        $return->width = round((int)$newWidth);
        $return->height = round((int)$newHeight);
        $return->status = true;
        return $return;
    }

    public function get_file_size($file_path, int $clear_stat_cache = 1): float
    {
        if ($clear_stat_cache) {
            if (version_compare(PHP_VERSION, '5.3.0') >= 0) {
                clearstatcache(true, $file_path);
            } else {
                clearstatcache();
            }
        }
        return $this->fix_integer_overflow(filesize($file_path));
    }

    public function fix_integer_overflow($size): float
    {
        if ($size < 0) {
            $size += 2.0 * (PHP_INT_MAX + 1);
        }
        return (float)$size;
    }

    public function get_mime_type(string $file): string
    {
        if (is_file($file)) {
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            return $finfo->file($file);
        }
        return '';

    }

    public function get_image_size($file): array
    {
        $imgSize = getimagesize($file);
        if ($imgSize) {
            return [
                'height' => $imgSize[1],
                'width' => $imgSize[0],
                'type' => $imgSize[2],
                'attr' => $imgSize[3]
            ];
        }

        return [];
    }


    public function get_media_path($path, $file_name, $new_width = 180, $width = 400, $height = 300): object
    {
        $return = new stdClass();
        $return->status = false;
        if (!$path || !$file_name) {
            return $return;
        }

        if (!is_file($path . $file_name)) {
            return $return;
        }

        $return->path = $path;
        $return->file = $path . $file_name;

        $return->width = $width;
        $return->height = $height;
        $size = $this->app_resize_image($return->file, $new_width);
        if ($size->status) {
            $return->width = $size->width;
            $return->height = $size->height;
        }
        $return->file_name = $file_name;
        $return->mimeType = $this->get_mime_type($return->file);
        $return->fileSize = $this->get_file_size($return->file);

        $return->status = true;
        return $return;
    }

    public function arrayToObject($array): object
    {
        foreach ($array as $key => $value) {
            if (is_array($value)) $array[$key] = $this->arrayToObject($value);
        }
        return (object)$array;
    }

    public function FileSizeConvert(float $bytes): string
    {
        $result = '';
        $bytes = floatval($bytes);
        $arBytes = array(
            0 => array("UNIT" => "TB", "VALUE" => pow(1024, 4)),
            1 => array("UNIT" => "GB", "VALUE" => pow(1024, 3)),
            2 => array("UNIT" => "MB", "VALUE" => pow(1024, 2)),
            3 => array("UNIT" => "KB", "VALUE" => 1024),
            4 => array("UNIT" => "B", "VALUE" => 1),
        );

        foreach ($arBytes as $arItem) {
            if ($bytes >= $arItem["VALUE"]) {
                $result = $bytes / $arItem["VALUE"];
                $result = str_replace(".", ",", strval(round($result, 2))) . " " . $arItem["UNIT"];
                break;
            }
        }
        return $result;
    }

    public function object2array_recursive($object)
    {
        return json_decode(json_encode($object), true);
    }

    public function formatLanguage(DateTime $dt, string $format, string $language = 'en'): string
    {
        $curTz = $dt->getTimezone();
        if ($curTz->getName() === 'Z') {
            //INTL don't know Z
            $curTz = new DateTimeZone('Europe/Berlin');
        }

        $formatPattern = strtr($format, array(
            'D' => '{#1}',
            'l' => '{#2}',
            'M' => '{#3}',
            'F' => '{#4}',
        ));
        $strDate = $dt->format($formatPattern);
        $regEx = '~\{#\d}~';
        while (preg_match($regEx, $strDate, $match)) {
            $IntlFormat = strtr($match[0], array(
                '{#1}' => 'E',
                '{#2}' => 'EEEE',
                '{#3}' => 'MMM',
                '{#4}' => 'MMMM',
            ));

            $fmt = datefmt_create($language, IntlDateFormatter::FULL, IntlDateFormatter::FULL,
                $curTz, IntlDateFormatter::GREGORIAN, $IntlFormat);
            $replace = $fmt ? datefmt_format($fmt, $dt) : "???";
            $strDate = str_replace($match[0], $replace, $strDate);
        }

        return $strDate;
    }

    public function gps_map_extract($row): array
    {
        if ($row['GPSLatitudeRef'] == "N") {
            $GPSLatitudeRef = "Nord";
            $GPSLatitudeFaktor = 1;
        } else {
            $GPSLatitudeRef = "Süd";
            $GPSLatitudeFaktor = -1;
        }
        $GPSLatGrad = $GPSLatitudeFaktor * ($row['GPSLatitude1'] + ($row['GPSLatitude2'] + ($row['GPSLatitude3'] / 60)) / 60);
        if ($row['GPSLongitudeRef'] == "E") {
            $GPSLongitudeRef = "Ost";
            $GPSLongitudeFactor = 1;
        } else {
            $GPSLongitudeRef = "West";
            $GPSLongitudeFactor = -1;
        }

        $GPSLongGrad = $GPSLongitudeFactor * ($row['GPSLongitude1'] + ($row['GPSLongitude2'] + ($row['GPSLongitude3'] / 60)) / 60);
        return array("GPSLongGrad" => $GPSLongGrad, "GPSLatGrad" => $GPSLatGrad);
    }

    public function get_curl_json_data($lat = '', $lon = '', $zoom = 16, $format = 'geojson', $polygon_geojson = 1, $addressdetails = 1): object
    {
        $return = new stdClass();
        $return->status = false;
        if (!$lat || !$lon) {
            return $return;
        }
        $url = sprintf('https://nominatim.openstreetmap.org/reverse?lat=%s&lon=%s&format=%s&limit=1&zoom=16', $lat, $lon, $format);
        $opts = array('http' => array('header' => "User-Agent: XlsxReaderAddressScript 3.7.6\r\n"));
        $context = stream_context_create($opts);
        $file = file_get_contents($url, false, $context);
        if ($file) {
            $d = json_decode($file, true);
            if (isset($d['features'][0])) {
                //$geo_json = json_encode($d['features'][0]);
                $d['lon'] = $lon;
                $d['lat'] = $lat;
                $return->geo_json = $d['features'][0];
                $return->status = true;
            }
        }
        return $return;
    }

    public function get_osm_json_data($query = '', $format = 'json', $polygon_geojson = 1, $addressdetails = 0, $limit = 1): object
    {
        $return = new stdClass();
        $return->status = false;
        if(!$query){
            return $return;
        }
        $url = sprintf('https://nominatim.openstreetmap.org/search?q=%s&format=%s&polygon_geojson=%d&limit=%d', $query, $format, $polygon_geojson, $addressdetails, $limit);

        $opts = array('http' => array('header' => "User-Agent: XlsxReaderAddressScript 3.7.6\r\n"));
        $context = stream_context_create($opts);
        $file = file_get_contents($url, false, $context);

        if ($file) {
            $d = json_decode($file, true);
            if($limit == 1){
                if(isset($d[0])){
                    $geo_json = json_encode($d[0]);
                } else {
                    return  $return;
                }

            } else {
                $geo_json = json_encode($d);
            }
            if(!$d){
                return $return;
            }
            $return->geo_json = $geo_json;
            $return->status = true;
        }
        return $return;
    }

    public function umlaute_decode(string $txt): string
    {
        if (!$txt) {
            return '';
        }
        $str = array("Ä", "ä", "Ö", "ö", "Ü", "ü", "ß");
        $text = array("AE", "ae", "OE", "oe", "UE", "ue", "ss");
        return str_replace($str, $text, $txt);
    }

    public function replace_template($template): string
    {
        return preg_replace(['/<!--(.*)-->/Uis', "/[[:blank:]]+/"], ['', ' '], str_replace(["\n", "\r", "\t"], '', $template));
    }

    public function recursive_destroy_dir($dir): bool
    {
        if (!is_dir($dir) || is_link($dir))
            return unlink($dir);

        foreach (scandir($dir) as $file) {
            if ($file == "." || $file == "..")
                continue;
            if (!$this->recursive_destroy_dir($dir . DIRECTORY_SEPARATOR . $file)) {
                chmod($dir . DIRECTORY_SEPARATOR . $file, 0777);
                if (!$this->recursive_destroy_dir($dir . DIRECTORY_SEPARATOR . $file)) return false;
            }
        }
        return rmdir($dir);
    }

    /**
     * @throws Exception
     */
    public function move_file($file, $to, $unlink = false): void
    {
        if (copy($file, $to)) {
            if ($unlink) {
                if (!unlink($file)) {
                    throw new Exception('File konnte nicht gelöscht gefunden.');
                }
            }
        }
    }


    /**
     * @throws Exception
     */
    public function recursive_copy($src, $dst): void
    {
        $dir = opendir($src);
        if (!is_dir($dst)) {
            if (!mkdir($dst)) {
                throw new Exception('Destination Ordner nicht gefunden gefunden.');
            }
        }
        while (($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . DIRECTORY_SEPARATOR . $file)) {
                    $this->recursive_copy($src . DIRECTORY_SEPARATOR . $file, $dst . DIRECTORY_SEPARATOR . $file);
                } else {
                    copy($src . DIRECTORY_SEPARATOR . $file, $dst . DIRECTORY_SEPARATOR . $file);
                }
            }
        }
        closedir($dir);
    }

    /**
     * @throws Exception
     */
    public function make_is_dir($path): void
    {
        if (!is_dir($path)) {
            if (!mkdir($path, 0777, true)) {
                throw new Exception('Ordner konnte nicht erstellt werden.');
            }
        }
    }

    public function make_qrcode($data): string
    {
        $writer = new PngWriter();
        $qrCode = QrCode::create($data)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(ErrorCorrectionLevel::Low)
            ->setSize(300)
            ->setMargin(0)
            ->setForegroundColor(new Color(0, 0, 0))
            ->setBackgroundColor(new Color(255, 255, 255));
        // $logo = Logo::create( $this->getParameter('qrcodeDir').'qrcode.png')
        //    ->setResizeToWidth(50);
        $label = Label::create('')->setFont(new NotoSans(8));

        $qrCodes = [];
        $qrCodes['simple'] = $writer->write(
            $qrCode,
            null,
            $label->setText('Scan Authy or Google Authenticator')
        )->getDataUri();
        return $qrCodes['simple'];
    }

    public function order_by_args($array, $key, $order)
    {
        switch ($order) {
            case'1':
                usort($array, fn($a, $b) => $a[$key] - $b[$key]);
                return array_reverse($array);
            case '2':
                usort($array, fn($a, $b) => $a[$key] - $b[$key]);
                break;
        }

        return $array;
    }

    public function order_by_args_string($array, $key, $order)
    {
        switch ($order) {
            case'1':
                usort($array, fn($a, $b) => strcasecmp($a[$key], $b[$key]));
                return array_reverse($array);
            case '2':
                usort($array, fn($a, $b) => strcasecmp($a[$key], $b[$key]));
                break;
        }
        return $array;
    }

    public function get_animate_option(): array
    {
        $seekers = ["bounce", "flash", "pulse", "rubberBand", "shakeX", "headShake", "swing", "tada", "wobble", "jello", "heartBeat"];
        $entrances = ["backInDown", "backInLeft", "backInRight", "backInUp"];
        //$back_exits = array("backOutDown","backOutLeft","backOutRight","backOutUp");
        $bouncing = ["bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp"];
        $fade = ["fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig", "fadeInUp", "fadeInUpBig", "fadeInTopLeft", "fadeInTopRight", "fadeInBottomLeft", "fadeInBottomRight"];
        $flippers = ["flip", "flipInX", "flipInY", "flipOutX", "flipOutY"];
        $lightspeed = ["lightSpeedInRight", "lightSpeedInLeft", "lightSpeedOutRight", "lightSpeedOutLeft"];
        $rotating = ["rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight"];
        $zooming = ["zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp"];
        $sliding = ["slideInDown", "slideInLeft", "slideInRight", "slideInUp"];

        $ani_arr = [];
        for ($i = 0; $i < count($seekers); $i++) {
            $ani_item = [
                "animate" => $seekers[$i]
            ];
            $ani_arr[] = $ani_item;
        }
        $ani_arr[] = ["value" => '-', "animate" => '----', "divider" => true];

        for ($i = 0; $i < count($entrances); $i++) {
            $ani_item = [
                "animate" => $entrances[$i]
            ];
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = ["value" => '-', "animate" => '----', "divider" => true];

        for ($i = 0; $i < count($bouncing); $i++) {
            $ani_item = array(
                "animate" => $bouncing[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($fade); $i++) {
            $ani_item = array(
                "animate" => $fade[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($flippers); $i++) {
            $ani_item = array(
                "animate" => $flippers[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($lightspeed); $i++) {
            $ani_item = array(
                "animate" => $lightspeed[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($rotating); $i++) {
            $ani_item = array(
                "animate" => $rotating[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($zooming); $i++) {
            $ani_item = array(
                "animate" => $zooming[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($sliding); $i++) {
            $ani_item = array(
                "animate" => $sliding[$i]
            );
            $ani_arr[] = $ani_item;
        }

        return $ani_arr;
    }

    public function get_font_style($fontData, $id): array
    {
        foreach ($fontData as $tmp) {
            if ($tmp['id'] == $id) {
                return $tmp;
            }
        }
        return [];
    }

    public function array_values_recursive($array): array
    {
        $arr = [];
        foreach ($array as $tmp) {
            if ($tmp['__children']) {
                if (count($tmp['__children'])) {
                    $tmp['__children'] = $this->order_by_args($tmp['__children'], 'position', 2);
                }
                $child = $this->array_children($tmp['__children']);
                $tmp['__children'] = $child;
            }

            $arr[] = $tmp;
        }

        return $arr;
    }

    private function array_children($array): array
    {
        $child = [];
        foreach ($array as $tmp) {
            if ($tmp['__children'] && count($tmp['__children'])) {
                $tmp['__children'] = $this->order_by_args($tmp['__children'], 'position', 2);
                $this->array_children($tmp['__children']);
            }

            $child[] = $tmp;
        }
        return $child;
    }

    public function hex2rgba($hex): string
    {
        $hex = str_replace("#", "", $hex);
        $r = '';
        $g = '';
        $b = '';
        $a = '';
        switch (strlen($hex)) {
            case 3 :
                $r = hexdec(substr($hex, 0, 1).substr($hex, 0, 1));
                $g = hexdec(substr($hex, 1, 1).substr($hex, 1, 1));
                $b = hexdec(substr($hex, 2, 1).substr($hex, 2, 1));
                $a = 1;
                break;
            case 6 :
                $r = hexdec(substr($hex, 0, 2));
                $g = hexdec(substr($hex, 2, 2));
                $b = hexdec(substr($hex, 4, 2));
                $a = 1;
                break;
            case 8 :
                $a = hexdec(substr($hex, 0, 2)) / 255;
                $r = hexdec(substr($hex, 2, 2));
                $g = hexdec(substr($hex, 4, 2));
                $b = hexdec(substr($hex, 6, 2));
                break;
        }
        $rgba = array($r, $g, $b, $a);

        return 'rgba('.implode(', ', $rgba).')';
    }

   public function rgba2hex($color, $alpha = 1): string
   {
       $pattern = "/(\d{1,3})\,?\s?(\d{1,3})\,?\s?(\d{1,3})/";

       // Only if it's RGB
       if ( preg_match( $pattern, $color, $matches ) ) {
           $r = $matches[1];
           $g = $matches[2];
           $b = $matches[3];

           $alpha == 1 ? $aa = '' : $aa = $this->make_transparent_hex($alpha*100);
           $color = sprintf("#%02x%02x%02x", $r, $g, $b).$aa;
       }

       return $color;
    }

    public function make_transparent_hex($number): string
    {
        $value = $number * 255 / 100;
        $opacity = dechex((int)$value);
        return str_pad($opacity, 2, 0, STR_PAD_RIGHT);
    }

    public function get_php_version():string
    {
        $re = '~\d.*~';
        preg_match($re, PHP_DATADIR, $matches);
        $matches ? $v = $matches[0] : $v = '';
        return 'php' . $v;
    }
}