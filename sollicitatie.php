<?php
// Controleer of het formulier daadwerkelijk is verzonden
if ($_SERVER["REQUEST_METHOD"] == "POST") {

  // --- 1. JOUW E-MAILADRES HIER ---
  $ontvanger = "info@ide-vloerentegelwerken.be";
  $onderwerp = "Nieuwe Sollicitatie via Website";

  // --- 2. DATA OPHALEN & BEVEILIGEN ---
  // strip_tags en htmlspecialchars voorkomen dat hackers code injecteren
  $naam      = htmlspecialchars(strip_tags($_POST['naam']));
  $email     = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
  $telefoon  = htmlspecialchars(strip_tags($_POST['telefoon']));
  $functie   = htmlspecialchars(strip_tags($_POST['functie']));
  $motivatie = htmlspecialchars(strip_tags($_POST['motivatie']));

  // --- 3. E-MAIL TEKST OPBOUWEN ---
  $bericht = "Er is een nieuwe sollicitatie binnengekomen via de website:\n\n";
  $bericht .= "Naam: $naam\n";
  $bericht .= "E-mail: $email\n";
  $bericht .= "Telefoon: $telefoon\n";
  $bericht .= "Functie: $functie\n\n";
  $bericht .= "Motivatie / Ervaring:\n$motivatie\n";

  // --- 4. BIJLAGE (CV) VERWERKEN ---
  // We maken een unieke 'boundary' aan. Dit is een scheidingsteken dat we
  // gebruiken om aan te geven waar de tekst stopt en de PDF begint.
  $boundary = md5(time());

  // Headers vertellen de e-mail server dat dit een mail is MET bijlagen (multipart/mixed)
  $headers = "From: $email\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

  // Deel 1 van de mail: De gewone tekst
  $body = "--$boundary\r\n";
  $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
  $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
  $body .= $bericht . "\r\n\r\n";

  // Deel 2 van de mail: Controleer of er een CV is geüpload en voeg dit toe
  if (isset($_FILES['cv']) && $_FILES['cv']['error'] == UPLOAD_ERR_OK) {
    $bestand_naam = $_FILES['cv']['name'];
    $bestand_type = $_FILES['cv']['type'];
    $bestand_tmp  = $_FILES['cv']['tmp_name'];

    // Lees het bestand uit en versleutel het (Base64) zodat het via e-mail verzonden kan worden
    $content = file_get_contents($bestand_tmp);
    $content = chunk_split(base64_encode($content));

    // Voeg het versleutelde bestand toe aan de mail
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: $bestand_type; name=\"$bestand_naam\"\r\n";
    $body .= "Content-Disposition: attachment; filename=\"$bestand_naam\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= $content . "\r\n\r\n";
  }

  $body .= "--$boundary--"; // Afsluiten van het pakketje

  // --- 5. VERSTUREN ---
  // We vertellen de browser dat we een 'JSON' antwoord teruggeven
  header('Content-Type: application/json');

  if (mail($ontvanger, $onderwerp, $body, $headers)) {
    // Succes
    echo json_encode(['status' => 'success']);
  } else {
    // Fout bij server
    echo json_encode(['status' => 'error']);
  }
  exit;
} else {
  header("Location: vacatures.html");
  exit;
}

?>
