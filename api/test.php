<?PHP
  $file = new \SplFileObject("/tmp/tmp-test.txt", "a+");
  $file->fwrite("written to /tmp/ by " . posix_getpwuid(posix_geteuid())['name'] . "\n");
  $file = NULL;

  $file = new \SplFileObject(sys_get_temp_dir() . "/tmp-test.txt", "a+");
  $file->fwrite("written to sys_get_temp_dir() by " . posix_getpwuid(posix_geteuid())['name'] . "\n");
  $file = NULL;
?>
