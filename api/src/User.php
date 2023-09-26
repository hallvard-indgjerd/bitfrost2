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

  public function getUsers(){
    $sql="WITH
      artifact AS (select u.id, u.name, u.role_id, role.value role, u.is_active, count(artifact.id) tot from user u inner join list_user_role role on u.role_id = role.id left join artifact on artifact.author = u.id group by u.id, u.name),
      model AS (select u.id, count(model.id) tot from user u left join model_metadata model on model.author = u.id group by u.id, u.name)
    SELECT artifact.id, artifact.name, artifact.role, artifact.is_active, artifact.tot artifact, model.tot model FROM artifact JOIN model
    WHERE artifact.id = model.id
    ORDER BY artifact.name asc;";
    return $this->simple($sql);
  }

  public function addUser(array $dati){
    try {
      $this->pdo()->beginTransaction();
      $pwd = $this->genPwd();
      $usr = array(
        "email"=>$dati['email'],
        "name"=>$dati['first_name']." ".$dati['last_name'],
        "password_hash"=>password_hash($pwd, PASSWORD_BCRYPT),
        "role"=>$dati['role'],
        "role_id"=>$dati['role_id'],
        "is_active"=>$dati['is_active']
      );
      unset($dati['role'],$dati['role_id'],$dati['is_active']);
      
      $sql = $this->buildInsert("person", $dati);
      $this->prepared($sql, $dati);
      
      $sql = $this->buildInsert("user", $usr);
      $this->prepared($sql, $usr);

      $datiMail=array(
        "email"=>$dati['email'], 
        "name"=>$usr['name'], 
        "pwd"=>$pwd, 
        "mailBody"=>1
      );
      $this->sendMail($datiMail);
      $this->pdo()->commit();
      return ["res"=> 1, "output"=>'ok '.$pwd];
    } catch (\Exception $e) {
      $this->pdo()->rollBack();
      return ["res"=>0, "output"=>$e->getMessage()];
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

/*   public function rescuePwd(array $dati){
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
  } */

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
        $body = file_get_contents('config/mailBody/newUser.html');
        $body = str_replace('%name%', $dati['name'], $body);
        $body = str_replace('%password%', $dati['pwd'], $body);
      break;
      case 2:
        $titolo="Send a new password";
        $body = file_get_contents('config/mailBody/rescuePwd.html');
        $body = str_replace('%name%', $dati['name'], $body);
        $body = str_replace('%password%', $dati['pwd'], $body);
      break;
    }
    $mailParams = parse_ini_file('config/mail.ini');
    if ($mailParams === false) {
      throw new \Exception("Error reading mail configuration file",0);
    }
    $this->mail->isSMTP();
    
    //da usare solo per i test, non stampa messaggi a video ma solo in console, non usare in produzione!!!!
    // $this->mail->SMTPDebug = SMTP::DEBUG_SERVER; 
    
    $this->mail->Host = $mailParams['host'];
    $this->mail->Port = $mailParams['port'];
    $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $this->mail->SMTPAuth = true;
    $this->mail->Username = $mailParams['usr'];
    $this->mail->Password = $mailParams['pwd'];
    // $this->mail->setFrom($mailParams['usr'], 'ADC crew');
    $this->mail->setFrom('omeka-ADC@ark.lu.se', 'Dynamic Collection Crew');
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
