<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Ontvanger e-mailadres (pas dit aan!)
  $to = "info@ide-vloerentegelwerken.be";
  $subject = "Nieuwe sollicitatie via website: " . $_POST['functie'];

  // Formulier data
  $name = $_POST['naam'];
  $email = $_POST['email'];
  $phone = $_POST['telefoon'];
  $message = $_POST['motivatie'];
  $job = $_POST['functie'];

  // Boundary voor e-mail (nodig voor bijlagen)
  $boundary = md5(time());

  // Headers
  $headers = "MIME-Version: 1.0\r\n";
  $headers .= "From: " . $email . "\r\n";
  $headers .= "Reply-To: " . $email . "\r\n";
  $headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";

  // E-mail body tekst
  $body = "--" . $boundary . "\r\n";
  $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
  $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
  $body .= "Naam: $name\nEmail: $email\nTelefoon: $phone\nFunctie: $job\n\nMotivatie:\n$message\r\n";

  // Bijlage verwerken
  if (isset($_FILES['cv']) && $_FILES['cv']['error'] == UPLOAD_ERR_OK) {
    $file_name = $_FILES['cv']['name'];
    $file_size = $_FILES['cv']['size'];
    $file_tmp  = $_FILES['cv']['tmp_name'];
    $file_type = $_FILES['cv']['type'];

    $handle = fopen($file_tmp, "r");
    $content = fread($handle, $file_size);
    fclose($handle);
    $encoded_content = chunk_split(base64_encode($content));

    $body .= "--" . $boundary . "\r\n";
    $body .= "Content-Type: $file_type; name=\"" . $file_name . "\"\r\n";
    $body .= "Content-Disposition: attachment; filename=\"" . $file_name . "\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= $encoded_content . "\r\n";
  }

  $body .= "--" . $boundary . "--";

  // Verzenden
  if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo "Bericht succesvol verzonden.";
  } else {
    http_response_code(500);
    echo "Er is iets misgegaan bij het verzenden.";
  }
} else {
  http_response_code(403);
  echo "Directe toegang niet toegestaan.";
}
?>
