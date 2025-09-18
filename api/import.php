<?php
header('Content-Type: application/json');

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Файл не загружен']);
    exit;
}

$filename = $_FILES['file']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$required = ['id', 'name', 'category', 'price', 'stock', 'rating', 'created_at'];
$data = [];

if ($ext === 'json') {
    $content = file_get_contents($_FILES['file']['tmp_name']);
    $data = json_decode($content, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Некорректный формат JSON']);
        exit;
    }
} elseif ($ext === 'csv') {
    $handle = fopen($_FILES['file']['tmp_name'], 'r');
    if (!$handle) {
        http_response_code(400);
        echo json_encode(['error' => 'Не удалось открыть CSV']);
        exit;
    }
    $header = fgetcsv($handle);
    if ($header === false) {
        http_response_code(400);
        echo json_encode(['error' => 'Пустой CSV-файл']);
        exit;
    }
    while (($row = fgetcsv($handle)) !== false) {
        $data[] = array_combine($header, $row);
    }
    fclose($handle);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Поддерживаются только JSON и CSV']);
    exit;
}

// Валидация
$errors = [];
foreach ($data as $i => $row) {
    foreach ($required as $field) {
        if (!isset($row[$field]) || $row[$field] === '') {
            $errors[] = "Строка $i: отсутствует поле $field";
        }
    }
    if (isset($row['price']) && !is_numeric($row['price'])) {
        $errors[] = "Строка $i: поле price должно быть числом";
    }
    if (isset($row['stock']) && !is_int($row['stock'])) {
        $errors[] = "Строка $i: поле stock должно быть целым числом";
    }
    if (isset($row['rating']) && (!is_numeric($row['rating']) || $row['rating'] < 0 || $row['rating'] > 5)) {
        $errors[] = "Строка $i: поле rating должно быть числом от 0 до 5";
    }
    if (isset($row['created_at']) && !strtotime($row['created_at']) && $row['created_at'] > date('Y-m-d')) {
        $errors[] = "Строка $i: поле created_at некорректная дата";
    }
}

if ($errors) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

file_put_contents(__DIR__ . '/../api/products.json', json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
echo json_encode(['success' => true]);


