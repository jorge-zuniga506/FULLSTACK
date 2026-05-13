const { Geolocalizacion, conexionGrafo, Solicitud, MetricaDashboard} = require('../models');

const crearGeolocalizacion = async (req,res)=>{
    const {user_id,latitud,longitud,direccion} = req.body;
    try{
        const geolocalizacion = await Geolocalizacion.create({
            user_id,
            latitud,
            longitud,
            direccion
        });
        res.status(201).json({message: 'Geolocalizacion creada exitosamente', geolocalizacion});
    }catch(error){
        res.status(500).json({message: 'Error al crear la geolocalizacion', error});
    }
}

const ObtenerGeolocalizaciones = async (req,res)=>{
    try{
const geolocalizaciones = await Geolocalizacion.findAll();
res.status(200).json(geolocalizaciones); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener las geolocalizaciones', error});
    }
}

const eliminarGeolocalizacion = async (req,res)=>{
    try{
        const {id_geolocalizacion} = req.params;

        const geolocalizacionEncontrada =await Geolocalizacion.findByPk(id_geolocalizacion);
        if(!geolocalizacionEncontrada){
            return res.status(404).json({message: 'Geolocalizacion no encontrada'});
        }
        await geolocalizacionEncontrada.destroy()
        res.status(500).json({message: 'Geolocalizacion eliminada correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar la geolocalizacion', error});
    }
}

const editarGeolocalizacion = async (req,res)=>{
    try{
        const {id_geolocalizacion} = req.params;

        const {user_id,latitud,longitud,direccion} = req.body;

        const geolocalizacionEncontrada = await Geolocalizacion.findByPk(id_geolocalizacion);

        if(!geolocalizacionEncontrada){
            return res.status(404).json({message: 'Geolocalizacion no encontrada'});
        }

        await geolocalizacionEncontrada.update({user_id,latitud,longitud,direccion});

        res.status(200).json(geolocalizacionEncontrada);

    }catch (error){
        res.status(500).json({message: 'Error al editar la geolocalizacion', error});
    }
}

const crearConexionGrafo = async (req,res)=>{
    const {actor_origen_id, actor_destino_id,  } = req.body;
    try{
        const conexionGrafo = await conexionGrafo.create({
            actor_origen_id,
            actor_destino_id,
            tipo_vinculo,
            
        });
        res.status(201).json({message: 'ConexionGrafo creada exitosamente', conexionGrafo});
    }catch(error){
        res.status(500).json({message: 'Error al crear la conexionGrafo', error});
    }
}

const ObtenerConexionesGrafo = async (req,res)=>{
    try{
const conexionesGrafo = await conexionGrafo.findAll();
res.status(200).json(conexionesGrafo); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener las conexionesGrafo', error});
    }
}

const eliminarConexionGrafo = async (req,res)=>{
    try{
        const {id_conexionGrafo} = req.params;

        const conexionGrafoEncontrada =await conexionGrafo.findByPk(id_conexionGrafo);
        if(!conexionGrafoEncontrada){
            return res.status(404).json({message: 'ConexionGrafo no encontrada'});
        }
        await conexionGrafoEncontrada.destroy()
        res.status(500).json({message: 'ConexionGrafo eliminada correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar la conexionGrafo', error});
    }
}

const editarConexionGrafo = async (req,res)=>{
    try{
        const {id_conexionGrafo} = req.params;

        const {actor_origen_id, actor_destino_id, tipo_vinculo} = req.body;

        const conexionGrafoEncontrada = await conexionGrafo.findByPk(id_conexionGrafo);

        if(!conexionGrafoEncontrada){
            return res.status(404).json({message: 'ConexionGrafo no encontrada'});
        }

        await conexionGrafoEncontrada.update({actor_origen_id, actor_destino_id,tipo_vinculo});

        res.status(200).json(conexionGrafoEncontrada);  

    }catch (error){
        res.status(500).json({message: 'Error al editar la conexionGrafo', error});
    }
}
 const CrearSolicitud = async (req,res)=>{
    const {user_id,tipo,estado,comentarios_admin} = req.body;
    try{
        const solicitud = await solicitud.create({
            user_id,
            tipo,
            estado,
            comentarios_admin
        });
        res.status(201).json({message: 'Solicitud creada exitosamente', solicitud});
    }catch(error){
        res.status(500).json({message: 'Error al crear la solicitud', error});
    }

} 

const ObtenerSolicitudes = async (req,res)=>{
    try{
const solicitudes = await solicitud.findAll();
res.status(200).json(solicitudes); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener las solicitudes', error});
    }
}   

const actualizarSolicitud = async (req,res)=>{
    try{
        const {id_solicitud} = req.params;

        const {user_id,tipo,estado,comentarios_admin} = req.body;

        const solicitudEncontrada = await solicitud.findByPk(id_solicitud);

        if(!solicitudEncontrada){
            return res.status(404).json({message: 'Solicitud no encontrada'});
        }

        await solicitudEncontrada.update({user_id,tipo,estado,comentarios_admin});

        res.status(200).json(solicitudEncontrada);

    }catch (error){
        res.status(500).json({message: 'Error al editar la solicitud', error});
    }
}

const eliminarSolicitud = async (req,res)=>{
    try{
        const {id_solicitud} = req.params;

        const solicitudEncontrada =await solicitud.findByPk(id_solicitud);
        if(!solicitudEncontrada){
            return res.status(404).json({message: 'Solicitud no encontrada'});
        }
        await solicitudEncontrada.destroy()
        res.status(500).json({message: 'Solicitud eliminada correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar la solicitud', error});
    }
}
  
const crearMetricaDashboard = async (req,res)=>{
    const {startup_id,num_empleados,valoracion_estimada,fecha_reporte} = req.body;
    try{
        const metricaDashboard = await metricaDashboard.create({
            startup_id,
            num_empleados,
            valoracion_estimada,
            fecha_reporte
        });
        res.status(201).json({message: 'MetricaDashboard creada exitosamente', metricaDashboard});
    }catch(error){
        res.status(500).json({message: 'Error al crear la metricaDashboard', error});
    }
}

const ObtenerMetricasDashboards = async (req,res)=>{
    try{
const metricasDashboards = await metricaDashboard.findAll();
res.status(200).json(metricasDashboards); 

    }catch (error){
        res.status(500).json({message: 'Error al obtener las metricasDashboards', error});
    }
}   

const actualizarMetricaDashboard = async (req,res)=>{
    try{
        const {id_metricaDashboard} = req.params;

        const {startup_id,num_empleados,valoracion_estimada,fecha_reporte} = req.body;

        const metricaDashboardEncontrada = await metricaDashboard.findByPk(id_metricaDashboard);

        if(!metricaDashboardEncontrada){
            return res.status(404).json({message: 'MetricaDashboard no encontrada'});
        }

        await metricaDashboardEncontrada.update({startup_id,num_empleados,valoracion_estimada,fecha_reporte});

        res.status(200).json(metricaDashboardEncontrada);

    }catch (error){
        res.status(500).json({message: 'Error al editar la metricaDashboard', error});
    }
}

const eliminarMetricaDashboard = async (req,res)=>{
    try{
        const {id_metricaDashboard} = req.params;

        const metricaDashboardEncontrada =await metricaDashboard.findByPk(id_metricaDashboard);
        if(!metricaDashboardEncontrada){
            return res.status(404).json({message: 'MetricaDashboard no encontrada'});
        }
        await metricaDashboardEncontrada.destroy()
        res.status(500).json({message: 'MetricaDashboard eliminada correctamente'});

    }catch (error){
        res.status(500).json({message: 'Error al eliminar la metricaDashboard', error});
    }

}
     module.exports = {
    crearGeolocalizacion,
    ObtenerGeolocalizaciones,
    eliminarGeolocalizacion,
    editarGeolocalizacion,
    crearConexionGrafo,
    ObtenerConexionesGrafo,
    eliminarConexionGrafo,
    editarConexionGrafo,
    CrearSolicitud,
    ObtenerSolicitudes,
    actualizarSolicitud,
    eliminarSolicitud,
    crearMetricaDashboard,
    ObtenerMetricasDashboards,
    actualizarMetricaDashboard,
    eliminarMetricaDashboard
}
