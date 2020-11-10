import Swal from "sweetalert2"

export const actualizarAvance = () => {
    //Seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea')

    //Seleccionar las tareas completadas
    if (tareas) {
        const tareasCompletas = document.querySelectorAll('i.completo')

        //Calcular el avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100)

        //Calcular porcentaje
        const porcentaje = document.querySelector('#porcentaje')
        porcentaje.style.width = avance + '%'

        if (avance === 100) {
            Swal.fire(
                'Completaste el proyecto',
                'Felicidades, has terminado tu proyecto',
                'success'
            )
        }
    }

}