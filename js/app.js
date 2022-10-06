//variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

console.log(carrito);

cargarEventListeners();

function cargarEventListeners (){

    //cuando agregas un curso presionando "agregar a carrito"
    listaCursos.addEventListener('click', agregarCurso);

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //muestra los cursos de LocalStorage
    document.addEventListener('DOMContentLoaded', ()=>{

        articulosCarrito =JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();

    });

    //vaciar el carrito de compra
    vaciarCarritoBtn.addEventListener('click', (e) => {

        e.preventDefault();
        articulosCarrito = [];//resetear el arreglo
        limpiarHTML();

    });

}

//Funciones

function agregarCurso (e){

    e.preventDefault(); //previene que el comportamiento por default, en este caso al hacer click la pagina sube por el # en <a href="#"><a/>

    //e.target nos retorna el html del elemento al que hicimos click

    if(e.target.classList.contains('agregar-carrito')){ //contains indica si el elemento tiene la clase agregar-carrito

        const cursoSelecionado = e.target.parentElement.parentElement;

        leerDatosCurso(cursoSelecionado);

    }

}

//Eliminar curso del carrito

function eliminarCurso (e){

    if(e.target.classList.contains('borrar-curso')){

       const cursoId = e.target.getAttribute('data-id')
       
       //borrar del arreglo los elementos del carrito al que hicimos click

       articulosCarrito = articulosCarrito.filter( (curso) => {

        return curso.id !== cursoId

       })

       carritoHTML();

    }

}

//Lee el contenido del HTML al que le dimos click y extrae la informacion del curso

function leerDatosCurso(curso){

    console.log(curso);

    //Crear un objeto con la info del curso actual
    const infoCurso = {
        
        //Extraemos los datos del DOM
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('H4').textContent,
        precio: curso.querySelector('.precio span.u-pull-right').textContent,
        id: curso.querySelector('.button').getAttribute('data-id'),
        cantidad: 1
    }

    //Revisa si un elemento ya existe en el carrito

    const existe = articulosCarrito.some( (curso) => {

        return curso.id === infoCurso.id;

    });

    if(existe){      

        //actualizamos la cantidad si existe el articulo en el carrito

        const cursos = articulosCarrito.map( (curso => {

            if(curso.id === infoCurso.id){

                curso.cantidad++;
                return curso; //esto retorna el objeto actualizado

            }else{

                return curso;//esto retorna  los objetos que no son duplicados pero que ya estan en el carrito
            }

        }));

    articulosCarrito = [...cursos];
        
    }else{
        //agregamos el curso al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    // agrega elementos al carrito

    console.log(articulosCarrito);

    carritoHTML();

}

//Muestra el carrito de compras en HTML

function carritoHTML (){

        //Limpiar el HTML
       limpiarHTML(); //sin esta funcion los elementos anteriores van a aparecer en el carrito ya que vuelve a iterar y insertar el HTML

        //Recorre el carrito y genera el HTML
        articulosCarrito.forEach( (curso)=>{

            const row = document.createElement('tr');
            const {imagen, titulo, precio, cantidad, id} = curso;

            row.innerHTML = `
            <td>
                <img src="${imagen}" width="80">
            </td>
            <td> ${titulo} </td>
            <td> ${precio} </td>
            <td> ${cantidad} </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
            `;

            //agrega el HTML del carrito en el tbody
            contenedorCarrito.appendChild(row);

        } );

        //Sincronizar con el Storage
        sincronizarStorage();

}

function sincronizarStorage (){

    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));

}


//Elimina los cursos del tbody

function limpiarHTML (){
    //forma lenta baja performance
    //contenedorCarrito.innerHTML = '';

    while(contenedorCarrito.firstChild){

        contenedorCarrito.removeChild(contenedorCarrito.firstChild);

    }
}