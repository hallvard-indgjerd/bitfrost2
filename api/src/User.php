<?php
namespace Adc;
session_start();
use \PHPMailer\PHPMailer\PHPMailer;
use \PHPMailer\PHPMailer\SMTP;
use \PHPMailer\PHPMailer\Exception;

class User extends Conn{
  public $mail;
  function __construct(){
    $this->mail = new PHPMailer(true);
  }

  public function addUser(array $dati){
    try {
      $pwd = $dati['password'];
      $dati['password_hash'] = password_hash($pwd, PASSWORD_DEFAULT);
      unset($dati['password']);
      $sql = $this->buildInsert("user", $dati);
      $this->prepared($sql, $dati);
      //$datiMail=array("email"=>$dati['email'], "user"=>$dati['name'], "pwd"=>$pwd, "mailBody"=>1);
      //$this->sendMail($datiMail);
      return array("user created successfully", 1);
    } catch (\Exception $e) {
      return [$e->getMessage(), $e->getCode()];
    }

  }

  public function checkAdmin(){
    $sql = "select count(*) tot from user;";
    $res = $this->simple($sql);
    return $res[0]['tot'];
  }
  public function login(array $dati){
    try {
      $usr = $this->checkEmail($dati['email']);
      $this->checkPwd($dati['password'],$usr['password_hash']);
      $this->setSession($usr);
      return ["Ok, you are logged-in!",0];
    } catch (\Exception $e) {
      return [$e->getMessage(), $e->getCode()];
    }
  }
  protected function checkEmail(string $email){
    $sql = "select * from user where email = '".$email."' and is_active = 1;";
    $out = $this->simple($sql);
    $x = count($out);
    if ($x == 0) { throw new \Exception("The email is not present in the database or your account is disabled. Try again, if the problem persists contact the project manager", 1); }
    return $out[0];
  }
  protected function checkPwd($toVerify,$hash){
    if (!password_verify($toVerify,$hash)) { throw new \Exception("The password is incorrect, please try again or request a new password", 1); }
    return true;
  }
  private function setSession(array $dati){
    $_SESSION['id'] = $dati['id'];
    $_SESSION['role'] = $dati['role_id'];
    $_SESSION['email'] = $dati['email'];
    return true;
  }

  public function rescuePwd(array $dati){
    try {
      $usr = $this->checkEmail($dati['email']);
      $pwd = $this->genPwd();
      $this->updatePwd(array("id"=>$usr['id'], "password"=>$pwd));
      $datiMail=array("email"=>$dati['email'], "utente"=>$usr['nome']." ".$usr['cognome'], "password"=>$pwd, "tipo"=>2);
      $this->sendMail($datiMail);
      return ["La password appena creata è stata inviata all'indirizzo email indicato.", 0];
    } catch (\Exception $e) {
      return [$e->getMessage(), $e->getCode()];
    }
  }

  public function genPwd(){
    $pwd = "";
    $pwdRand = array_merge(range('A','Z'),range('a','z'),range(0,9),['*','%','$','#','@','!','+','?','.']);
    for($i=0; $i < 16; $i++) {$pwd .= $pwdRand[array_rand($pwdRand)];}
    return str_shuffle($pwd);
  }

  protected function sendMail(array $dati){
    switch ($dati['mailBody']) {
      case 1:
        $titolo = "New account";
        $body = file_get_contents('../config/mailBody/newUser.html');
        $body = str_replace('%user%', $dati['name'], $body);
        $body = str_replace('%password%', $pwd, $body);
      break;
      case 2:
        $titolo="Invio password di ripristino per la Boulder Factory Community";
        $body = file_get_contents('../assets/mail/rescuePwd.html');
        $body = str_replace('%utente%', $dati['utente'], $body);
        $body = str_replace('%password%', $dati['password'], $body);
      break;
    }
    $mailParams = parse_ini_file('mail.ini');
    if ($mailParams === false) {
      throw new \Exception("Error reading mail configuration file",0);
    }
    $this->mail->isSMTP();
    // $this->mail->SMTPDebug = SMTP::DEBUG_SERVER; //da usare solo per i test, non stampa messaggi a video ma solo in console, non usare in produzione!!!!
    $this->mail->Host = $mailParams['host'];
    $this->mail->Port = $mailParams['port'];
    $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $this->mail->SMTPAuth = true;
    $this->mail->Username = $mailParams['usr'];
    $this->mail->Password = $mailParams['pwd'];
    $this->mail->setFrom($mailParams['usr'], 'ADC crew');
    $this->mail->addAddress($dati['email'], $dati['utente']);
    $this->mail->Subject = $titolo;
    $this->mail->msgHTML($body, __DIR__);
    $this->mail->AltBody = $this->htmlToPlainText($body);
    if (!$this->mail->send()) {
      throw new \Exception('Mailer Error: '. $this->mail->ErrorInfo,0);
    }
    return true;
  }

  private function htmlToPlainText($str){
    $str = str_replace('&nbsp;', ' ', $str);
    $str = html_entity_decode($str, ENT_QUOTES | ENT_COMPAT , 'UTF-8');
    $str = html_entity_decode($str, ENT_HTML5, 'UTF-8');
    $str = html_entity_decode($str);
    $str = htmlspecialchars_decode($str);
    $str = strip_tags($str);
    return $str;
  }
}
?>
