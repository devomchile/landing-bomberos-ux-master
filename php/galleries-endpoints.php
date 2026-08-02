<?php
/*
Plugin Name: NextGEN Gallery API Endpoints
Description: Proporciona endpoints personalizados para obtener galerías e imágenes de NextGEN Gallery.
Version: 1.0
Author: Omar Olate Salas omarolate.96@gmail.com
*/



add_action('rest_api_init', function () {
    // Endpoint para obtener todas las galerías con paginación
    register_rest_route('wp/v2', '/nextgen-galleries', array(
        'methods' => 'GET',
        'callback' => 'get_nextgen_galleries',
        'permission_callback' => '__return_true',
        'args' => array(
            'page' => array(
                'default' => 1,
                'validate_callback' => function ($param) {
                    return is_numeric($param) && $param > 0;
                },
            ),
            'per_page' => array(
                'default' => 10,
                'validate_callback' => function ($param) {
                    return is_numeric($param) && $param > 0;
                },
            ),
        ),
    ));

    // Endpoint para obtener las imágenes de una galería con paginación
    register_rest_route('wp/v2', '/nextgen-gallery-images/(?P<gallery_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_nextgen_gallery_images',
        'permission_callback' => '__return_true',
        'args' => array(
            'page' => array(
                'default' => 1,
                'validate_callback' => function ($param) {
                    return is_numeric($param) && $param > 0;
                },
            ),
            'per_page' => array(
                'default' => 10,
                'validate_callback' => function ($param) {
                    return is_numeric($param) && $param > 0;
                },
            ),
        ),
    ));
});

function get_nextgen_galleries($data) {
    global $wpdb;
    $page = isset($data['page']) ? (int)$data['page'] : 1;
    $per_page = isset($data['per_page']) ? (int)$data['per_page'] : 10;

    // Calcular el OFFSET para la paginación
    $offset = ($page - 1) * $per_page;

    // Query para obtener todas las galerías con paginación ordenadas por fecha descendente
    $results = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}ngg_gallery 
         ORDER BY (SELECT MIN(imagedate) FROM {$wpdb->prefix}ngg_pictures WHERE galleryid = gid) DESC 
         LIMIT %d, %d",
        $offset, // Offset
        $per_page // Limit
    ));

    if (empty($results)) {
        return new WP_Error('no_galleries', 'No se encontraron galerías', array('status' => 404));
    }

    // Agregar información adicional para cada galería
    foreach ($results as &$gallery) {
        // Obtener una imagen aleatoria de la galería
        $random_image = get_random_image_from_gallery($gallery->gid, $gallery->path);

        // Obtener la fecha de la primera imagen asociada a la galería
        $image_date = $wpdb->get_var($wpdb->prepare(
            "SELECT imagedate FROM {$wpdb->prefix}ngg_pictures WHERE galleryid = %d ORDER BY imagedate ASC LIMIT 1",
            $gallery->gid
        ));

        // Asignar información a la galería
        $gallery->random_image = $random_image ? $random_image : null;
        $gallery->image_date = $image_date ? $image_date : null;
    }

    // Paginación: obtener el total de galerías
    $total_galleries = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}ngg_gallery");
    $total_pages = ceil($total_galleries / $per_page);

    // Añadir información de paginación
    return rest_ensure_response(array(
        'data' => $results,
        'pagination' => array(
            'total' => $total_galleries,
            'per_page' => $per_page,
            'current_page' => $page,
            'total_pages' => $total_pages,
        ),
    ));
}


function get_random_image_from_gallery($gallery_id, $gallery_path) {
    global $wpdb;

    // Obtener una imagen aleatoria de la galería
    $result = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM `6jgrG0_ngg_pictures` WHERE galleryId = %d ORDER BY RAND() LIMIT 1",
        $gallery_id
    ));
    

    if ($result) {
        // Asumiendo que el campo `path` contiene la ruta de la galería y el campo `filename` el nombre del archivo
        $image_url = home_url($gallery_path. $result->filename); // Concatenar el nombre de la carpeta y la imagen

        return array(
            'id' => $result->pid,
            'title' => $result->title,
            'url' => $image_url, // URL de la imagen
        );
    }

    return null;
}

function get_nextgen_gallery_images($data) {
    $gallery_id = $data['gallery_id'];
    $page = isset($data['page']) ? (int)$data['page'] : 1;
    $per_page = isset($data['per_page']) ? (int)$data['per_page'] : 10;

    global $wpdb;
    
    // Calcular el OFFSET para la paginación
    $offset = ($page - 1) * $per_page;

    // Query para obtener las imágenes de la galería con paginación
    $results = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM `6jgrG0_ngg_pictures` WHERE galleryid = %d LIMIT %d, %d",
        $gallery_id,
        $offset, // Offset
        $per_page // Limit
    ));

    // Obtener los datos de la galería
    $gallery = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM `6jgrG0_ngg_gallery` WHERE gid = %d LIMIT 1",
        $gallery_id
    ));

    if (empty($results)) {
        return new WP_Error('no_images', 'No se encontraron imágenes para esta galería', array('status' => 404));
    }

    if (!$gallery) {
        return new WP_Error('no_gallery', 'No se encontró la galería especificada', array('status' => 404));
    }

    // Construir la URL base de la galería
    $gallery_path = home_url($gallery->path);

    // Agregar URL para cada imagen
    $images = array();
    foreach ($results as $image) {
        $images[] = array(
            'id' => $image->pid,
            'title' => $image->title,
            'url' => $gallery_path . '/' . $image->filename, // Obtiene la URL de la imagen
            'slug' => $image->image_slug,
            'description' => $image->description,
            'altText' => $image->alttext,
            'imageDate' => $image->imagedate
        );
    }

    // Obtener la fecha de cualquier imagen (en este caso, la primera imagen)
    $gallery_date = isset($results[0]->imagedate) ? $results[0]->imagedate : null;

    // Paginación: obtener el total de imágenes
    $total_images = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM `6jgrG0_ngg_pictures` WHERE galleryid = %d",
        $gallery_id
    ));
    $total_pages = ceil($total_images / $per_page);

    // Añadir información de paginación y datos de la galería
    return rest_ensure_response(array(
        'gallery' => array(
            'id' => $gallery->gid,
            'title' => $gallery->title,
            'description' => $gallery->galdesc,
            'path' => $gallery_path,
            'date' => $gallery_date, // Fecha tomada de la primera imagen
        ),
        'images' => $images,
        'pagination' => array(
            'total' => $total_images,
            'per_page' => $per_page,
            'current_page' => $page,
            'total_pages' => $total_pages,
        ),
    ));
}






