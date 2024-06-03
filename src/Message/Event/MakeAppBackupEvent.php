<?php

namespace App\Message\Event;


class MakeAppBackupEvent
{
    private array $args;
    public function __construct(array $args)
    {
        $this->args = $args;
    }

    public function get_id():string
    {
        return $this->args['id'];
    }

    public function is_export_vendor():bool
    {
        return $this->args['export_vendor'];
    }
    public function get_sql_file(): string
    {
        return $this->args['sql_file'];
    }
    public function get_json_file(): string
    {
        return $this->args['json_file'];
    }
    public function get_created():bool
    {
        return $this->args['created'];
    }
    public function get_type():string
    {
        return $this->args['type'];
    }
}