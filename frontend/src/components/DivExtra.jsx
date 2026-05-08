import React from 'react'

function DivExtra({ agregarMiembro }) {

    return (
        <div>
            <p>Nombre y función de los miembros</p>
            <label htmlFor="">Nombre</label>
            <input type="text" placeholder='Nombre' />
            <label htmlFor="">Función</label>
            <input type="text" placeholder='Función' />


            <button onClick={agregarMiembro}>Agregar miembro</button>
        </div>
    )
}

export default DivExtra