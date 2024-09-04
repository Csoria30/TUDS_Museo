//- Obteniendo todos los clientes
export const obtenerDepartamentos = async () => {
    const url = "https://collectionapi.metmuseum.org/public/collection/v1/departments";
    try {
        const resultado = await fetch(url);
        const departamentos = await resultado.json();
        return departamentos;
        
    } catch (error) {
        console.log(error);
    }
}