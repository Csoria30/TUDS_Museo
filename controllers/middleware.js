export function paginacionResultados( m ){
    return (req, res, next) => {
        const pagina = parseInt(req.query.pagina);
        const limite = parseInt(req.query.limite);
        const startIndex = (pagina - 1) * limite;
        const endIndex = pagina * limite;
        const resultado = {};
        
        if ( endIndex < m.length){
            resultado.next = {
                pagina: pagina + 1,
                limite: limite
            }
        }
        
        if ( startIndex > 0 ){
            resultado.previous = {
                pagina: pagina - 1,
                limite: limite
            }
        }

        resultado.resultado = m.slice(startIndex, endIndex);

        res.paginacionResultados = resultado;
        next()
    }
}