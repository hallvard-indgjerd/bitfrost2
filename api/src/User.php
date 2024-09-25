<?php
namespace Adc;
session_start();
use \Adc\Person;
use \PHPMailer\PHPMailer\PHPMailer;
use \PHPMailer\PHPMailer\SMTP;
use \PHPMailer\PHPMailer\Exception;

class User extends Conn{
  public $mail;
  public $person;
  function __construct(){
    $this->mail = new PHPMailer(true);
    $this->person = new Person();
  }

  public function addUser(array $dati){
    try {
      $this->pdo()->beginTransaction();
      $usr = array(
        "role"=>$dati['role'],
        "is_active"=>$dati['is_active']
      );
      unset($dati['role'],$dati['is_active']);
      
      $personSql = $this->buildInsert("person", $dati);
      $this->prepared($personSql, $dati);
      $personId = $this->pdo()->lastInsertId();
      $usr['person']=$personId;
      $userSql = $this->buildInsert("user", $usr);
      $this->prepared($userSql, $usr);

      $token = $this->genToken($dati['email']);
      $tokenData = array("email"=>$dati['email'], "token"=>$token);
      $tokenSql = $this->buildInsert("reset_password", $tokenData);
      $this->prepared($tokenSql, $tokenData);

      $datiMail = array(
        "email"=>$dati['email'], 
        "name"=>$dati['first_name']." ".$dati['first_name'], 
        "link"=>"https://dyncolldev.ht.lu.se/prototype/reset_password.php?key=".$token,
        "mailBody"=>1
      );
      $this->sendMail($datiMail);
      $this->pdo()->commit();
      return ["res"=> 1, "output"=>'Ok, user has been successfully created.'];
    } catch (\Exception $e) {
      $this->pdo()->rollBack();
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }
  public function addUsrFromPerson(array $dati){
    
  }

  public function changePassword(array $dati){
    try {
      $sql = "select password_hash from user where id = ".$dati['id'].";";
      $out = $this->simple($sql);
      $this->checkPwd($dati['curPwd'],$out[0]['password_hash']);
      $pwd = password_hash($dati['password_hash'], PASSWORD_BCRYPT);
      $newdata = array("password_hash"=>$pwd, "id"=>$dati['id']);
      $sql = "update user set password_hash = :password_hash where id = :id";
      $this->prepared($sql, $newdata);
      return ["res"=> 1, "output"=>'Ok, password has been succesfully modified'];
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  public function checkAdmin(){
    $sql = "select count(*) tot from user;";
    $res = $this->simple($sql);
    return $res[0]['tot'];
  }

  protected function checkEmail(string $email){
    $sql = "select u.id, p.id person, p.email, p.institution, u.role, u.password_hash from person p inner join user u on u.person = p.id where p.email = '".$email."' and u.is_active = 1;";
    $out = $this->simple($sql);
    $x = count($out);
    if ($x == 0) { throw new \Exception("The email is not in the database or your account is disabled. Please try again, if the problem persists please contact the project manager", 1); }
    return $out[0];
  }

  protected function checkPwd($toVerify,$hash){
    if (!password_verify($toVerify,$hash)) { throw new \Exception("The password is incorrect, please try again or request a new password", 1); }
    return true;
  }

  protected function checkResetRequest(string $email){
    $sql = "select * from reset_password where email = '".$email."';";
    $out = $this->simple($sql);
    $x = count($out);
    if ($x > 0) { throw new \Exception("Sorry, but there is already an active request for this email.<br>If you did not receive the email with the link to reset your password, please search in spam or contact the system administrator: giuseppe.naponiello@ark.lu.se", 1); }
    return $out[0];
  }
  public function checkToken(string $token){
    try {
      $sql = "select * from reset_password where token = '".$token."';";
      $out = $this->simple($sql);
      if (count($out) == 0) { throw new \Exception("Sorry, but your token is expired! Please try requesting a new password again", 0); }
      return ["res"=> 1, "output"=>$out[0]];
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
    return $out[0];
  }

  public function genPwd(){
    $pwd = "";
    $pwdRand = array_merge(range('A','Z'),range('a','z'),range(0,9),['*','%','$','#','@','!','+','?','.']);
    for($i=0; $i < 16; $i++) {$pwd .= $pwdRand[array_rand($pwdRand)];}
    return str_shuffle($pwd);
  }

  protected function genToken(string $email){ return md5($email).rand(10,9999); }

  public function getUsers(){
    $sql="select * from user_artifact_view order by name asc;";
    return $this->simple($sql);
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

  public function rescuePwd(string $email){
    try {
      // check if email exists and if it's active, and get user id
      $usr = $this->checkEmail($email);
      $this->checkResetRequest($email);
      // create a token to sent
      $token = $this->genToken($email);
      // save request in reset_password table
      $resArr = array("email" => $email, "token" => $token);
      $sql = $this->buildInsert("reset_password", $resArr);
      $this->prepared($sql, $resArr);
      // send an email with link
      $datiMail=array(
        "email"=>$email, 
        "name"=>$usr['name'], 
        "link"=>"https://dyncolldev.ht.lu.se/prototype/reset_password.php?key=".$token, 
        "mailBody"=>2
      );
      $this->sendMail($datiMail);
      return ["res" => 1, "output"=>"A reset link has been sent to provided email. The link will expires in 1 day"];
    } catch (\Exception $e) {
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  public function resetPassword(array $dati){
    try {
      $this->pdo()->beginTransaction();
      $array = array(
        "email" => $dati['email'],
        "password_hash" => password_hash($dati['password_hash'], PASSWORD_BCRYPT)
      );
      $sql = "update person, user set user.password_hash = :password_hash where user.person = person.id and person.email = :email";
      $this->prepared($sql, $array);
      
      $array = array( "token"=>$dati['token'], "email"=>$dati['email']);
      $sql = "delete from reset_password where token = :token and email = :email;";
      $this->prepared($sql, $array);

      $this->pdo()->commit();
      return ["res"=>1, "output" => 'Your password has been successfully reset, you can now log in.'];
    } catch (\Exception $e) {
      $this->pdo()->rollBack();
      return ["res"=>0, "output"=>$e->getMessage()];
    }
  }

  private function setSession(array $dati){
    $_SESSION['id'] = $dati['id'];
    $_SESSION['person'] = $dati['person'];
    $_SESSION['role'] = $dati['role'];
    $_SESSION['email'] = $dati['email'];
    $_SESSION['institution'] = $dati['institution'];
    return true;
  }


  protected function sendMail(array $dati){
    switch ($dati['mailBody']) {
      case 1:
        $titolo = "New account";
        $body = file_get_contents('config/mailBody/newUser.html');
        $body = str_replace('%name%', $dati['name'], $body);
        $body = str_replace('%link%', $dati['link'], $body);
      break;
      case 2:
        $titolo="Reset my password";
        $body = file_get_contents('config/mailBody/rescuePwd.html');
        $body = str_replace('%name%', $dati['name'], $body);
        $body = str_replace('%link%', $dati['link'], $body);
      break;
    }
    $mailParams = parse_ini_file('config/mail.ini');
    if ($mailParams === false) {
      throw new \Exception("Error reading mail configuration file",0);
    }
    $this->mail->isSMTP();
    
    // only for testing, print messages only in the console, do not use in production!!!!
    // $this->mail->SMTPDebug = SMTP::DEBUG_SERVER; 
    
    $this->mail->Host = $mailParams['host'];
    $this->mail->Port = $mailParams['port'];
    $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $this->mail->SMTPAuth = true;
    $this->mail->Username = $mailParams['usr'];
    $this->mail->Password = $mailParams['pwd'];
    $this->mail->setFrom('omeka-ADC@ark.lu.se', 'Dynamic Collection Crew');
    $this->mail->addAddress($dati['email'], $dati['name']);
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
