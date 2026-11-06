<?php
/**
 * OPUS CORP — réception du formulaire « Confiez-nous votre projet » (GLO.FOR, LIV.TEC.01–04).
 * Hébergement Hostinger : envoi via mail() de PHP depuis la boîte du domaine (SPF/DKIM Hostinger déjà en place).
 * Réponse JSON : { "ok": true } ou { "ok": false, "error": "..." }.
 */

const CONTACT_TO   = 'contact@opuscrp.com';  // destinataire des demandes
const CONTACT_FROM = 'contact@opuscrp.com';  // expéditeur : boîte existante du domaine (obligatoire chez Hostinger)
const MAX_LEN      = 500;

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) $data = $_POST;

// Nettoyage : texte court, sans retours à la ligne (anti-injection d'en-têtes).
$clean = function ($key) use ($data) {
    $v = isset($data[$key]) && is_string($data[$key]) ? $data[$key] : '';
    return trim(mb_substr(str_replace(["\r", "\n"], ' ', $v), 0, MAX_LEN));
};

// Pot de miel : champ invisible rempli = robot → réponse OK sans envoi.
if ($clean('company') !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$name    = $clean('name');
$email   = $clean('email');
$phone   = $clean('phone');
$project = $clean('project');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid']);
    exit;
}

$subject = '=?UTF-8?B?' . base64_encode("Nouvelle demande de projet — $name") . '?=';
$body = "Nouvelle demande depuis opuscrp.com\n\n"
      . "Nom : $name\n"
      . "E-mail : $email\n"
      . "Téléphone : " . ($phone ?: '—') . "\n"
      . "Type de projet : " . ($project ?: '—') . "\n";

$headers = implode("\r\n", [
    'From: OPUS CORP <' . CONTACT_FROM . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$sent = mail(CONTACT_TO, $subject, $body, $headers, '-f' . CONTACT_FROM);

if (!$sent) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'send']);
    exit;
}

echo json_encode(['ok' => true]);
