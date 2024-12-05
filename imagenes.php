<?php
// Configuración de la carpeta de destino
$directorio = __DIR__ . '/assets/imagenes/';

// Crear el directorio si no existe
if (!is_dir($directorio)) {
    mkdir($directorio, 0755, true);
}

// Leer el método HTTP
$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {
    case 'POST': // Subir imágenes (CREATE)
        if (isset($_FILES['imagenes'])) {
            $imagenes = $_FILES['imagenes'];
            $rutasImagenes = [];

            for ($i = 0; $i < count($imagenes['name']); $i++) {
                $nombreArchivo = basename($imagenes['name'][$i]);
                $nombreUnico = uniqid() . '-' . $nombreArchivo; // Generar un nombre único
                $rutaDestino = $directorio . $nombreUnico;

                if (move_uploaded_file($imagenes['tmp_name'][$i], $rutaDestino)) {
                    $rutasImagenes[] = '/assets/imagenes/' . $nombreUnico;
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'mensaje' => 'Error al mover el archivo: ' . $nombreArchivo
                    ]);
                    exit;
                }
            }

            http_response_code(200);
            echo json_encode([
                'mensaje' => 'Imágenes subidas exitosamente',
                'rutasArchivos' => $rutasImagenes
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['mensaje' => 'No se enviaron imágenes.']);
        }
        break;

    case 'GET': // Cargar imágenes (READ)
        $imagenes = array_diff(scandir($directorio), ['.', '..']);
        $rutas = array_map(function ($imagen) {
            return '/assets/imagenes/' . $imagen;
        }, $imagenes);

        http_response_code(200);
        echo json_encode([
            'mensaje' => 'Imágenes cargadas exitosamente',
            'imagenes' => $rutas
        ]);
        break;

    case 'DELETE': // Eliminar imagen (DELETE)
        parse_str(file_get_contents("php://input"), $datos);
        if (isset($datos['ruta'])) {
            $rutaCompleta = __DIR__ . $datos['ruta'];
            if (file_exists($rutaCompleta)) {
                unlink($rutaCompleta);
                http_response_code(200);
                echo json_encode(['mensaje' => 'Imagen eliminada exitosamente']);
            } else {
                http_response_code(404);
                echo json_encode(['mensaje' => 'Imagen no encontrada']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['mensaje' => 'Ruta de imagen no proporcionada']);
        }
        break;

    case 'PUT': // Modificar imagen (UPDATE)
        parse_str(file_get_contents("php://input"), $datos);
        if (isset($datos['ruta_antigua']) && isset($_FILES['imagen_nueva'])) {
            $rutaAntigua = __DIR__ . $datos['ruta_antigua'];
            $nombreUnico = uniqid() . '-' . basename($_FILES['imagen_nueva']['name']);
            $rutaNueva = $directorio . $nombreUnico;

            if (file_exists($rutaAntigua)) {
                // Eliminar imagen antigua
                unlink($rutaAntigua);
            }

            // Mover nueva imagen
            if (move_uploaded_file($_FILES['imagen_nueva']['tmp_name'], $rutaNueva)) {
                http_response_code(200);
                echo json_encode([
                    'mensaje' => 'Imagen actualizada exitosamente',
                    'nuevaRuta' => '/assets/imagenes/' . $nombreUnico
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['mensaje' => 'Error al mover la nueva imagen.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['mensaje' => 'Datos insuficientes para actualizar la imagen.']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['mensaje' => 'Método HTTP no soportado.']);
        break;
}
