# Diseño: grosor uniforme del marco superior del retablo

## Objetivo

Evitar que el marco rojo inclinado del frontón superior parezca ensancharse. Su grosor visible debe mantenerse uniforme en móvil y escritorio.

## Alcance y enfoque

El frontón se dibuja en un SVG que se adapta al tamaño disponible. Se ajustará únicamente su dibujo para que el grosor del borde inclinado no dependa de la deformación de las coordenadas del SVG. Se conservarán la silueta, los colores, el filete dorado, la ilustración floral y el comportamiento responsivo existentes.

Retocar solo los puntos del triángulo es una alternativa más sencilla, pero no asegura el mismo grosor en distintas proporciones de pantalla. Se prefiere una representación del borde cuyo grosor visible permanezca constante al escalar.

## Verificación

Actualizar la prueba enfocada de `RetabloWrapper` para proteger el tratamiento del marco SVG y ejecutar esa prueba. Confirmar que no se alteren la forma ni los elementos decorativos del frontón.
