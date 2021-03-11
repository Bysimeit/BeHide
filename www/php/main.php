<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');

session_start();

include_once('connect.php');
$bdd = new PDO('mysql:host=localhost;dbname=behide', 'serv', 'Warning&85246!');

if(isset($_SESSION['id'])) {
    $requser = $bdd->prepare("SELECT * FROM user WHERE id = ?");
    $requser->execute(array($_SESSION['id']));
    $userinfo = $requser->fetch();
}

if(isset($_POST['formconnexion'])) {
    $mailconnect = htmlspecialchars($_POST['mailconnect']);
    $mdpconnect = hash('sha256', $_POST['mdpconnect']);
    if(!empty($mailconnect) AND !empty($mdpconnect)) {
        $requser = $bdd->prepare("SELECT * FROM user WHERE mail = ? AND motdepasse = ?");
        $requser->execute(array($mailconnect, $mdpconnect));
        $userexist = $requser->rowCount();
        if($userexist == 1) {
            $userinfo = $requser->fetch();
            $_SESSION['id'] = $userinfo['id'];
            $_SESSION['mail'] = $userinfo['mail'];
            $stmt = $bdd->prepare("SELECT confirm FROM user WHERE mail like :mail");
            if($stmt->execute(array(':mail' => $mail))) {
                $actif = $userinfo['confirm'];
            }
            if ($actif == '1') {
                header("Location: main.html");
            } else {
                $erreur = "Votre compte n'est pas activé, veuillez vérifier vos e-mails !";
            }
        } else {
            $erreur = "Mail et/ou mot de passe incorrect !";
        }
    } else {
        $erreur = "Tous les champs doivent être complétés !";
    }
}

if(isset($_POST['forminscription'])) {
    $nom = htmlspecialchars($_POST['nom']);
    $prenom = htmlspecialchars($_POST['prenom']);
    $mail = htmlspecialchars($_POST['mail']);
    $mail2 = htmlspecialchars($_POST['mail2']);
    $mdp = hash('sha256', $_POST['mdp']);
    $mdp2 = hash('sha256', $_POST['mdp2']);
    if(!empty($_POST['nom']) AND !empty($_POST['prenom']) AND !empty($_POST['mail']) AND !empty($_POST['mdp']) AND !empty($_POST['mdp2'])) {
        $nomlenght = strlen($nom);
        $prenomlenght = strlen($prenom);
        $maillenght = strlen($mail);
        $mail2lenght = strlen($mail2);
        if($nomlenght <= 255 AND $prenomlenght <= 255 AND $maillenght <= 255 AND $mail2lenght <= 255) {
            if($mail == $mail2) {
                if(filter_var($mail, FILTER_VALIDATE_EMAIL)) {
                    $reqmail = $bdd->prepare("SELECT * FROM user WHERE mail = ?");
                    $reqmail->execute(array($mail));
                    $mailexist = $reqmail->rowCount();
                    if($mailexist == 0) {
                        if($mdp == $mdp2) {
                            $longueurKey = 16;
                            $key = "";
                            for($i = 1; $i < $longueurKey; $i++) {
                                $key .= mt_rand(0,9);
                            }
                            $longueurId = 11;
                            $id = "";
                            for($i = 1; $i < $longueurKey; $i++) {
                                $id .= mt_rand(0,9);
                            }
                            $insertmbr = $bdd->prepare("INSERT INTO user(id, nom, prenom, mail, motdepasse, confirmkey, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)");
                            $insertmbr->execute(array($id, $nom, $prenom, $mail, $mdp, $key, "default.jpg"));

                            $header = "MIME-Version: 1.0\r\n";
                            $header .= "From:BeHide<support@behide.be>"."\n";
                            $header .= "Content-Type:text/html; charset=UTF-8\r\n"."X-Mailer: PHP/".phpversion();
                            $header.='Content-Transfer-Encoding: 8bit';

                            $subject="Confirmation de compte";
                            $message='
							<html>
								<body>
									<div align="center">
										<img src="https://behide.be/images/mail/NomGIF2.gif" alt="Logo BeHide">
										<br>
										<h2>Bienvenue !</h2>
										<p>Bonjour '.$_POST['prenom'].',</p><br>
										<p>Merci de vous être inscrit à BeHide.</p><br>
										<p>Pour confirmer votre inscription, veuillez cliquer sur le lien de validation suivant :</p>
										<a href="localhost/BeHide/confirmation?pseudo='.urlencode($id).'&key='.$key.'">Confirmer l\'adresse mail !</a><br>
										<p>Merci ! ♥</p><br><br><br><br>
										<em style="font-size:1em; font-style:italic;">Vous avez reçu ce mail parce que vous vous êtes pré-inscrit sur HakoServ. <br>Si vous ne vous êtes pas inscrit, veuillez ignorer ce mail et ne pas cliquer sur le lien.<br><br>Ceci est un mail automatique. Merci de ne pas y répondre.</em>
									</div>
								</body>
							</html>
							';

                            mail($mail, $subject, $message, $header);
                        } else {
                            $erreur = "Vos mots de passes ne correpondent pas !";
                        }
                    } else {
                        $erreur = "Adresse mail déjà utilisée !";
                    }
                } else {
                    $erreur = "Votre adresse mail n'est pas valide !";
                }
            } else {
                $erreur = "Vos adresses mails ne correspondent pas !";
            }
        } else {
            $erreur = "Nombre de caractères trop grands !";
        }
    } else {
        $erreur = "Tous les champs doivent être complétés !";
    }
}

?>